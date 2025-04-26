import { useState } from "react";
import { useWebSocket } from "../Websocket/WebSocketContext";
import AllowedCharacters from "./AllowedCharacters";
import LoopToggle from "./LoopToggle";
import SendButton from "./SendButton";
import SpeedControl from "./SpeedControl";
import TextInput from "./TextInput";

function Typer() {
  const ws = useWebSocket();
  const [text, setText] = useState("");
  const [speed, setSpeed] = useState(10);
  const [loop, setLoop] = useState(false);
  const allowedCharacters = "A-Za-z0-9 .,!?#-$%&@><="; 
  const allowedRegex = new RegExp(`^[${allowedCharacters}]*$`); 

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
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
      <TextInput value={text} onChange={handleTextChange} />
      <AllowedCharacters allowedCharacters={allowedCharacters} />
      <SpeedControl speed={speed} setSpeed={setSpeed} />
      <LoopToggle loop={loop} toggleLoop={() => setLoop(!loop)} />
      <SendButton onClick={sendToArduino} />
    </div>
  );
}

export default Typer;
