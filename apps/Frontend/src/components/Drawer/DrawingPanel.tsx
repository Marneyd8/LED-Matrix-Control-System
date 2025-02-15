import { useState, useEffect, SetStateAction } from "react";
import Row from "./Row";
import { useWebSocket } from "../Websocket/WebSocketContext";
import { Rgb } from "../../types/rgb";

function DrawingPanel(props: { selectedColor: Rgb, setRgb: React.Dispatch<React.SetStateAction<Rgb>> }) {
  const { selectedColor, setRgb } = props;
  const ws = useWebSocket();  // Get WebSocket instance
  const [isDrawing, setIsDrawing] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // Track if fill action is triggered
  const [fillButtonClicked, setFillButtonClicked] = useState<boolean>(false);

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

  const handleAction = (actionType: string, color: SetStateAction<Rgb>) => {
    setFillButtonClicked(true);
    setRgb(color); // Set the new RGB color
    if (ws) {
      const data = { action: actionType, color }; // Pass dynamic color based on the action
      ws.send(JSON.stringify(data));
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
        <button className="btn p-3 m-3" onClick={() => handleAction('FILL', selectedColor)}>
          FILL
        </button>
        <button className="btn p-3 m-3" onClick={() => handleAction('CLEAR', { r: 0, g: 0, b: 0 })}>
          CLEAR
        </button>
        <button className="btn p-3 m-3" onClick={handleExport}>
          EXPORT
        </button>
      </div>
    </div>
  );
}

export default DrawingPanel;
