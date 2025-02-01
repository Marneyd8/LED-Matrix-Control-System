import { useState } from "react";
import WebSocketClient from "./WebSocketClient";
import Drawer from "./Drawer";

function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);

  return (
    <div>
      <WebSocketClient setWs={setWs} />
      {ws && <Drawer ws={ws} />}
    </div>
  );
}

export default App;
