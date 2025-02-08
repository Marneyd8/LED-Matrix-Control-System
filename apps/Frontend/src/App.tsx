import { useState } from "react";
import WebSocketClient from "./components/WebSocketClient";
import MainPage from "./components/MainPage";
import { WebSocketContext } from "./components/WebSocketContext";

function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);

  return (
    <WebSocketContext.Provider value={ws}>
      <WebSocketClient setWs={setWs} />
      {ws && <MainPage />}
    </WebSocketContext.Provider>
  );
}

export default App;
