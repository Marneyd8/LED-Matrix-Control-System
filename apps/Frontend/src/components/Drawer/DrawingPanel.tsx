import { useState, useEffect, SetStateAction } from "react";
import Row from "./Row";
import { useWebSocket } from "../Websocket/WebSocketContext";
import { Rgb } from "../../types/rgb";

function DrawingPanel(props: { selectedColor: Rgb, setRgb: React.Dispatch<React.SetStateAction<Rgb>> }) {
  const { selectedColor, setRgb } = props;
  const ws = useWebSocket();
  const [isDrawing, setIsDrawing] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [fillButtonClicked, setFillButtonClicked] = useState<boolean>(false);
  const [brightness, setBrightness] = useState(25);

  useEffect(() => {
    if (ws) {
      ws.send("PARAMETERS");
      ws.onmessage = (message) => {
        try {
          const data = JSON.parse(message.data);
          if (data.width && data.height) {
            setWidth(data.width);
            setHeight(data.height);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    }
  }, [ws]);

  const handleAction = (action: string, value: any) => {
    let data = null;
    if (action == "FILL"){
      setFillButtonClicked(true);
      setRgb(value); // Set the new RGB color
      data = {
        action: action,
        r: value.r,
        g: value.g,
        b: value.b,
      };
    }
    if (action === "BRIGHTNESS") {
      setBrightness(value); // Set the brightness state when brightness changes
      data = {
        action: action,
        value: value,
      }
    }
    if (ws) {
      ws.send(JSON.stringify(data));  // Send to Arduino
      console.log("Sent to WebSocket:", data);
    }
  };


  // Handle export action
  const handleExport = () => {
    // TODO
  };

  return (
    <div
      className="flex flex-col align-center p-10"
      onMouseDown={() => setIsDrawing(true)}
      onMouseUp={() => setIsDrawing(false)}
      onMouseLeave={() => setIsDrawing(false)} // Stops drawing when mouse leaves panel
    >
      {Array.from({ length: height }).map((_, rowIndex) => (
        <Row
          key={rowIndex}
          rowIndex={rowIndex}
          width={width}
          selectedColor={selectedColor}
          isDrawing={isDrawing}
          fillButtonClicked={fillButtonClicked} // Pass the button click state
          setFillButtonClicked={setFillButtonClicked} // Pass the setter function
        />
      ))}
      <div className="p-5">
        <button className="btn p-3 m-3" onClick={() => handleAction("FILL", selectedColor)}>
          FILL
        </button>
        <button className="btn p-3 m-3" onClick={() => handleAction("FILL", { r: 0, g: 0, b: 0 })}>
          CLEAR
        </button>
        <button className="btn p-3 m-3" onClick={handleExport}>
          EXPORT
        </button>
      </div>
      <label>
        BRIGHTNESS
        <input 
          type="range" 
          name="brightness" 
          min="0" 
          max="255" 
          value={brightness} 
          onChange={(e) => handleAction("BRIGHTNESS", Number(e.target.value))} // Pass the updated value
        />
        <span>{brightness}</span> {/* Display the current brightness value */}
      </label>
    </div>
  );
}

export default DrawingPanel;
