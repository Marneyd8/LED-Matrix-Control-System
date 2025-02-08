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
// Always first
var arduinoWs = null;
var websiteWs = null;
wss.on('connection', function (ws) {
    // Assign the first WebSocket connection to arduinoWs, then the next to websiteWs
    if (arduinoWs === null) {
        arduinoWs = ws;
        console.log('Connection opened on Arduino');
    }
    else if (websiteWs === null) {
        websiteWs = ws;
        console.log('Connection opened on Website');
    }
    else {
        console.log('Connection opened on someone who is not supposed to be here???');
    }
    // When a message is received from either arduinoWs or websiteWs, forward it to the other
    ws.on('message', function (msg) {
        console.log('Message received:', msg.toString());
        if (ws === websiteWs && arduinoWs !== null) {
            console.log('Forwarding message to Arduino:', msg.toString());
            arduinoWs.send(msg);
        }
        if (ws === arduinoWs && websiteWs !== null) {
            console.log('Forwarding message to Website:', msg.toString());
            websiteWs.send(msg);
        }
    });
    // When a WebSocket connection is closed
    ws.on('close', function () {
        console.log('Connection closed');
        // Reset the respective WebSocket connection reference when closed
        if (ws === arduinoWs) {
            arduinoWs = null;
        }
        else if (ws === websiteWs) {
            websiteWs = null;
        }
    });
});
console.log("WebSocket server is running on ws://".concat(host, ":").concat(port));
