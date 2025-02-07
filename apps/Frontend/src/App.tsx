import { useState } from "react";
import WebSocketClient from "./components/WebSocketClient";
import MainPage from "./components/MainPage";

function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);

  return (
    <div>
      <WebSocketClient setWs={setWs} />
      {ws && <MainPage ws={ws} />}
    </div>
  );
}

export default App;
