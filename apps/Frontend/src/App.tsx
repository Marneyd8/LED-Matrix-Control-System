import { useState } from "react";
import { WebSocketContext } from "./components/WebSocketContext";
import WebSocketClient from "./components/WebSocketClient";
import MainPage from "./components/MainPage";


function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);

  return (
    <WebSocketContext.Provider value={ws}>
      <div className="flex flex-col w-screen text-center">
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
