import { useState } from 'react'
import './App.css'

function App() {
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [serverMessage, setServerMessage] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  const serverIP = '10.0.0.15';

  const connectWebSocket = () => {
    const websocket = new WebSocket(`ws://${serverIP}:80`);
    websocket.onopen = () => {
      console.log('Connected to WebSocket server');
      setConnected(true);
      setWs(websocket);
    };

    websocket.onmessage = async (event) => {
      //BLOB ?
      const text = await new Response(event.data).text()
      console.log('Message from server:', event.data);
      setServerMessage(text);
    };

    websocket.onclose = () => {
      console.log('Disconnected from server');
      setConnected(false);
      setWs(null);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const sendMessage = () => {
    if (ws) {
      ws.send(message);
      console.log('Sent message:', message);
    } else {
      console.log('WebSocket not connected');
    }
  };

  return (
    <div>
      <h1>Arduino WebSocket Client</h1>
      {!connected ? (
        <button onClick={connectWebSocket}>Connect to WebSocket</button>
      ) : (
        <div>
          <h2>Connected</h2>
          <div>
            <label>Message to Arduino:</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
      {serverMessage && (
        <div>
          <h3>Message from Arduino:</h3>
          <p>{serverMessage}</p>
        </div>
      )}
    </div>
  );
}

export default App
