"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var ws_1 = require("ws");
var dotenv = require("dotenv");
var path = require("path");
dotenv.config({ path: path.resolve(__dirname, '../Frontend/.env') });
// Create HTTP server
var server = (0, http_1.createServer)();
var host = process.env.VITE_SERVERADDRESS || '0.0.0.0';
var port = 80;
server.listen(port, host, function () {
    console.log("Server is listening on ".concat(host, ":").concat(port));
});
// Create WebSocket server
var wss = new ws_1.WebSocketServer({ server: server });
var arduinoWs = null;
var websiteWs = null;
wss.on('connection', function (ws) {
    ws.on('message', function (message) {
        var msg = message.toString();
        console.log(msg);
        if (msg === 'ARDUINO CONNECTED' && arduinoWs === null) {
            arduinoWs = ws;
            console.log('Arduino connection established');
            ws.send("SUCESS");
        }
        else if (msg === 'WEBSITE CONNECTED' && websiteWs === null) {
            websiteWs = ws;
            console.log('Website connection established');
            ws.send("SUCESS");
        }
        else {
            // Forward messages between Arduino and Website
            if (ws === websiteWs && arduinoWs) {
                arduinoWs.send(msg);
            }
            else if (ws === arduinoWs && websiteWs) {
                websiteWs.send(msg);
            }
        }
    });
    // Handle WebSocket connection close
    ws.on('close', function () {
        if (ws === arduinoWs) {
            console.log('Arduino WebSocket closed');
            arduinoWs = null;
        }
        else if (ws === websiteWs) {
            console.log('Website WebSocket closed');
            websiteWs = null;
        }
    });
});
console.log("WebSocket server is running on ws://".concat(host, ":").concat(port));
