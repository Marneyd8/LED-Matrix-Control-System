import { useState } from "react";

type WebSocketClientProps = {
  setWs: React.Dispatch<React.SetStateAction<WebSocket | null>>;
};

function WebSocketClient({ setWs }: WebSocketClientProps) {
  const [connected, setConnected] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [serverMessage, setServerMessage] = useState<string>('');
  const [ws, setWsLocal] = useState<WebSocket | null>(null);

  const serverIP = '10.0.0.15';

  const connectWebSocket = () => {
    const websocket = new WebSocket(`ws://${serverIP}:80`);
    websocket.onopen = () => {
      console.log('Connected to WebSocket server');
      setConnected(true);
      setWsLocal(websocket);
      setWs(websocket); // Update the parent App state with the WebSocket
    };

    websocket.onmessage = async (event) => {
      const text = await new Response(event.data).text();
      console.log('Message from server:', text);
      setServerMessage(text);
    };

    websocket.onclose = () => {
      console.log('Disconnected from server');
      setConnected(false);
      setWsLocal(null);
      setWs(null); // Clear WebSocket in the parent component
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const sendMessage = () => {
    if (connected && ws) {
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

export default WebSocketClient;
