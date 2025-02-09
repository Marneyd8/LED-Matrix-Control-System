import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../Frontend/.env') });

// Create HTTP server
const server = createServer();
const host: string = process.env.VITE_SERVERADDRESS || '0.0.0.0';
const port: number = 80;

server.listen(port, host, () => {
  console.log(`Server is listening on ${host}:${port}`);
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

let arduinoWs: WebSocket | null = null;
let websiteWs: WebSocket | null = null;

wss.on('connection', (ws: WebSocket) => {

  ws.on('message', (message: string) => {
    const msg = message.toString();
    console.log(msg);
    if (msg === 'ARDUINO CONNECTED' && arduinoWs === null) {
      arduinoWs = ws;
      console.log('Arduino connection established');
      ws.send("SUCESS");
    } else if (msg === 'WEBSITE CONNECTED' && websiteWs === null) {
      websiteWs = ws;
      console.log('Website connection established');
      ws.send("SUCESS");
    }else{
      // Forward messages between Arduino and Website
      if (ws === websiteWs && arduinoWs) {
        arduinoWs.send(msg);
      } else if (ws === arduinoWs && websiteWs) {
        websiteWs.send(msg);
      }
    }
  });

  // Handle WebSocket connection close
  ws.on('close', () => {
    if (ws === arduinoWs) {
      console.log('Arduino WebSocket closed');
      arduinoWs = null;
    } else if (ws === websiteWs) {
      console.log('Website WebSocket closed');
      websiteWs = null;
    }
  });
});

console.log(`WebSocket server is running on ws://${host}:${port}`);
