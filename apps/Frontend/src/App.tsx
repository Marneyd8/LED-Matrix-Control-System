import { useState } from "react";
import { WebSocketContext } from "./components/Websocket/WebSocketContext";
import WebSocketClient from "./components/Websocket/WebSocketClient";
import MainPage from "./components/MainPage";


function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);

  return (
    <WebSocketContext.Provider value={ws}>
      <div className="w-screen text-center font-mono mt-5">
        <div className="h-[18%]">
          <WebSocketClient setWs={setWs} />
        </div>
        <div className="h-[82%]">
          {ws && <MainPage />}
        </div>
      </div>
    </WebSocketContext.Provider>
  );

}

export default App;
