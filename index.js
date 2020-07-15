/* CALLBACK - function(ws, data, [command, arg])
	data - {userName: "MrX", ...} -- current user data
	ws   - WebSocket connection with such user

returns {
	app, users, userDatas
}
*/
function init(PORT, CALLBACK) {
	const express = require('express');
	const app = express();
	const expressWs = require('express-ws')(app)
	const { parse } = require("./message_parser")
	const userDatas = {};

	let users = {};

	app.ws("/sima", function(ws, req) {
	  // req - Simple Express Request
	  // ws  - Client connection
	  let userData = {};

	  ws.on('message', async function(msg) {
		if (!userData.userName) {
			// Do not allow short/long names or names with strange symbols
			if (msg.length < 3 || msg.length > 20
				|| msg.indexOf("<") > -1
				|| msg.indexOf(">") > -1
				|| msg.indexOf("&") > -1
				|| msg.indexOf("$") > -1
				|| msg.indexOf("/") > -1
				|| msg.indexOf("\\")> -1
				|| msg.indexOf(";") > -1
			) {
				ws.send("ERR");
				return;
			}
			// Do not allow to repeat the names
			// Send 'ERR' if already busy
			if (users[msg] === undefined) {
				// Name is free
				userData.userName = msg;
				userDatas[userData.userName] = userData;
				users[userData.userName] = ws;
				let res = await CALLBACK(ws, userData, ["join"]);
				ws.send("OK");
				if (res) {
					ws.send(res);
				}
			} else {
				// Name is busy
				ws.send("ERR");
			}
			return;
		}
		let cmdArg = parse(msg);
		let res = await CALLBACK(ws, userData, cmdArg);
		if (res) {
			ws.send(res);
		}
	  });
	 
	  ws.on('close', function() {
	  	delete users[userData.userName];
	  	delete userDatas[userData.userName];
	  	delete userData;
	  });

	  // On Connected
	  // Nothing to do
	 
	});

	app.use("/", express.static(__dirname + '/static'));
	app.listen(PORT)
	
	return { app, users, userDatas };
};

module.exports = { init }