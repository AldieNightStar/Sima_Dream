# Sima Dream Project
Text-based console-like multiplayer adventure. Create small multiplayer games and make fun with friends

# Install
```
npm install AldieNightStar/Sima_Dream
```

# Usage
```js
const sima = require("sima_dream");

// Let's define some HTTP port
const PORT = 8000;

// Then we will connect our logic to the game
// We don't need to worry about connecting and disconnecting players
let S = sima.init(PORT, function(ws, userData, cmdArg) {
	// ws       - User websocket. You can directly send some message to the user by 'ws.send("Hello!");'
	// userData - Object which contains current user data. We can put there coins, score, etc
	// cmdArg   - [command, argument] - Command and argument from User input
	//		When user is just connected: ["join"];
	//		When user is typed command: ["Command name", "Text after space"]
});


// We can manipulate
// =================
S.app // Express application
S.users // Object with user names as key and their WebSockets as value
S.userDatas // Object with user names as key and their userData as value
```

# Example (Echo game)
```js
const sima = require("sima_dream");

let S = sima.init(8080, (ws, data, cmdArg) => {
	return "ECHO: " + data.userName + " ==> " + cmdArg.join(" ");
})
```
