let console_pre = undefined;
let input_field = undefined;

let mus = new Audio();
let snd = new Audio();

let commands = {};

window.addEventListener("load", async function () {
	let name = undefined;
	let nameCorrect = false;
	while (true) {
		name = window.prompt("Enter your name: ");
		nameCorrect = await connect(name);
		if (name.length > 20) {
			window.alert("Name is too long!");
			continue;
		}
		if (name.length < 3) {
			window.alert("Name is too short");
			continue;
		}
		if (nameCorrect === true) {
			break;
		} else {
			window.alert("Name is not correct or busy!");
		}
	}

	console_pre = document.getElementById('console-output');
	input_field = document.getElementById('input-field');
	input_field.onkeypress = e => {
		if (e.keyCode === 13) {
			e.preventDefault();
			let text = input_field.value;
			if (!text) return;
			input_field.value = "";
			print(`🥨 <b><i>${text}</i></b>`);
			srv_send(text);

			// Scroll console down
			let c = document.getElementById('console');
			c.scrollTop = c.scrollHeight;
		}
	}
})

// Elements
function elem(name, cb, appendTo) {
	let e = document.createElement(name);
	cb(e);
	if (appendTo) {
		appendTo.appendChild(e);
	}
	return e;
}


// Sending/Receiving info
// ============
function srv_send(text) {
	ws.send(text);
}

function srv_recv(text) {
	let f = '<font color="green">✔ </font>';
	print(f + text);
}

// Console
// ========
function print(txt) {
	elem("span", s => {
		s.innerHTML = txt + "<br>";
	}, console_pre);
}

function clear() {
	console_pre.innerHTML = "";
}


// Music and Sound
// ================
function music(src) {
	if (!src || src === ".") {
		mus.pause();
		mus.currentTime = 0;
		return;
	}
	mus.loop = true;
	mus.src  = src;
	mus.currentTime = 0;
	mus.play();
}

function sound(src) {
	if (!src || src === ".") {
		snd.pause();
		snd.currentTime = 0;
		return;
	}
	snd.src = src;
	snd.currentTime = 0;
	snd.play();
}

// WebSockets
// ==========
function wsConnect(route) {
  let prefix = "ws://" + location.hostname + ":" + location.port + "/";
  if (route[0] == "/") {
    route = route.substr(1);
  }
  return new WebSocket(prefix + route);
}

function connect(name) {
	return new Promise(resolve => {
		let nameCorrect = false;
		let ws = wsConnect("/sima");
		if (!ws) {
			window.alert("WebSocket is not available!");
			resolve(false);
			return;
		}
		ws.addEventListener("message", function(evt) {
			if (nameCorrect) {
				srv_recv(evt.data);
				return;
			} else {
				if (evt.data === "OK") {
					nameCorrect = true;
					resolve(true);
				} else {
					resolve(false);
				}
			}
		});
		ws.addEventListener("open", function() {
			// Send our name to websocket
			ws.send(name);
		})

		window.ws = ws;
	})
}