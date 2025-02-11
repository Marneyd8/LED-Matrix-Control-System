import { useEffect, useRef, useState } from "react";

type WebSocketClientProps = {
  setWs: React.Dispatch<React.SetStateAction<WebSocket | null>>;
};

/**
 * WebSocketClient component manages the WebSocket connection.
 *
 * @param setWs The setter function to update the WebSocket state.
 * @returns {ReactNode} A React element that renders the WebSocket connection status.
 */
function WebSocketClient({ setWs }: WebSocketClientProps) {
  const serverIP: string = import.meta.env.VITE_SERVERADDRESS;
  const [connected, setConnected] = useState<boolean>(false);
  const isMounted = useRef<boolean>(false);

  const connectWebSocket = () => {
    const websocket = new WebSocket(`ws://${serverIP}:80`);
    websocket.onopen = () => {
      websocket.send('WEBSITE CONNECTED');
    };

    websocket.onmessage = (message) => {
      const msg = message.data;
      if (msg == "SUCESS") {
        console.log('Connected to WebSocket server');
        setConnected(true);
        setWs(websocket);
      }
    }

    websocket.onclose = () => {
      console.log('Disconnected from server');
      setConnected(false);
      setWs(null);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  useEffect(() => {
    if (!isMounted.current) {
      connectWebSocket();
      isMounted.current = true; // we only run this once
    }
  }, []); // [] => run on startup

  return (
    <div className="bg-main">
      <div className="text-4xl text-white p-2 pt-8">
        <div>Control System for LED Matrix Display</div>
      </div>

      <div className="p-4">
        {!connected ? (
          <div>
            <h2>Server: Unable to connect</h2>
            <button onClick={connectWebSocket}>Try again</button>
          </div>) :
          (<h2>Server: Connected</h2>)}
      </div>
    </div>
  );
}

export default WebSocketClient;
