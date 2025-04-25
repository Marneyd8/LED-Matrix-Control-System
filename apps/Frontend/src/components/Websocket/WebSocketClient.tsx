import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import ConnectionStatus from "./ConnectionStatus";

function WebSocketClient(props: {setWs: React.Dispatch<React.SetStateAction<WebSocket | null>>}) {
  const {setWs} = props;
  const [connected, setConnected] = useState<boolean>(false);
  const isMounted = useRef<boolean>(false);

  const connectWebSocket = () => {
    const websocket = new WebSocket('ws://localhost:80');
    websocket.onopen = () => {
      websocket.send('WEBSITE CONNECTED');
    };

    websocket.onmessage = (message) => {
      const msg = message.data;
      if (msg === "SUCCESS") {
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
    <Header />
    <ConnectionStatus connected={connected} onRetry={connectWebSocket} />
  </div>
  );
}

export default WebSocketClient;
