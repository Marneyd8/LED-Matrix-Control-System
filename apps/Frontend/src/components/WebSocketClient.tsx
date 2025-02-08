import { useEffect, useRef, useState } from "react";

type WebSocketClientProps = {
  setWs: React.Dispatch<React.SetStateAction<WebSocket | null>>;
};

function WebSocketClient({ setWs }: WebSocketClientProps) {
  const [connected, setConnected] = useState<boolean>(false);
  const serverIP = import.meta.env.VITE_SERVERADDRESS;
  const isMounted = useRef(false);

  const connectWebSocket = () => {
    const websocket = new WebSocket(`ws://${serverIP}:80`);
    websocket.onopen = () => {
      console.log('Connected to WebSocket server');
      setConnected(true);
      setWs(websocket); // Update the parent App state with the WebSocket
    };

    websocket.onclose = () => {
      console.log('Disconnected from server');
      setConnected(false);
      setWs(null); // Clear WebSocket in the parent component
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  useEffect(() => {
    // Make sure the effect only runs once
    if (!isMounted.current) {
      connectWebSocket();
      isMounted.current = true; // Ensure we only run this once
    }
  }, []);

  return (
    <div className="bg-gray-800">
      <div className="text-4xl text-white p-2 pt-8">
        <div>Control System for LED Matrix Display</div>
      </div>

      <div className="p-4">
        {!connected ? (
          <div>
            <h2>Server: Unable to connect to the server</h2>
            <button onClick={connectWebSocket}>Try again</button>
          </div>) :
          (<h2>Server: Connected</h2>)}
      </div>
    </div>
  );
}

export default WebSocketClient;
