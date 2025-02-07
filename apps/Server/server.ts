import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

// Create HTTP server
const server = createServer();
const host: string = process.env.VITE_SERVERADDRESS || '0.0.0.0';
const port: number = 80;

server.listen(port, host, () => {
  console.log(`Server is listening on ${host}:${port}`);
});

// Create WebSocket server
const wss = new WebSocketServer({ server });
// Always first
let arduinoWs: WebSocket | null = null;
let websiteWs: WebSocket | null = null;

wss.on('connection', (ws: WebSocket) => {
  // Assign the first WebSocket connection to arduinoWs, then the next to websiteWs
  if (arduinoWs === null) {
    arduinoWs = ws;
    console.log('Connection opened on Arduino');
  } else if (websiteWs === null) {
    websiteWs = ws;
    console.log('Connection opened on Website');
  } else {
    console.log('Connection opened on someone who is not supposed to be here???');
  }

  // When a message is received from either arduinoWs or websiteWs, forward it to the other
  ws.on('message', (msg: string | Buffer) => {
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
  ws.on('close', () => {
    console.log('Connection closed');
    // Reset the respective WebSocket connection reference when closed
    if (ws === arduinoWs) {
      arduinoWs = null;
    } else if (ws === websiteWs) {
      websiteWs = null;
    }
  });
});

console.log(`WebSocket server is running on ws://${host}:${port}`);
