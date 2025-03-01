import { useState } from "react";
import { useWebSocket } from "../Websocket/WebSocketContext";
import AllowedCharacters from "./AllowedCharacters";

function Typer() {
  const ws = useWebSocket();
  const [text, setText] = useState("");
  const [speed, setSpeed] = useState(10);
  const [loop, setLoop] = useState(false);
  const allowedCharacters = "A-Za-z0-9 .,!?#-$%&@><="; 
  const allowedRegex = new RegExp(`^[${allowedCharacters}]*$`); 

  const handleTextChange = (e: { target: { value: any; }; }) => {
    const input = e.target.value;
    if (allowedRegex.test(input)) {
      setText(input);
    }
  };

  const sendToArduino = () => {
    if (ws && text.trim() !== "") {
      const data = {
        action: "TEXT",
        text: text,
        speed: speed,
        loop: loop,
      };
      ws.send(JSON.stringify(data));
      console.log("Sent to WebSocket:", data);
    }
  };

  return (
    <div className="flex flex-col items-center p-5 space-y-4">
      <input
        type="text"
        placeholder="Enter text..."
        value={text}
        onChange={handleTextChange}
        className="p-2 border border-gray-400 rounded w-64"
      />
      <AllowedCharacters allowedCharacters={allowedCharacters}/>

      <div className="flex flex-col items-center">
        <label className="text-sm font-semibold">Speed of Change (1-100)</label>
        <input
          type="number"
          value={speed}
          min="1"
          max="100"
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="p-2 border border-gray-400 rounded w-64"
        />
      </div>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={loop}
          onChange={() => setLoop(!loop)}
          className="w-4 h-4"
        />
        <span>Loop text</span>
      </label>

      <button
        onClick={sendToArduino}
        className="btn p-3 m-3"
      >
        Send to LED
      </button>
    </div>
  );
}

export default Typer;
