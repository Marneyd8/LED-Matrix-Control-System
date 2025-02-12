import { useState, useEffect } from "react";
import Row from "./Row";
import { useWebSocket } from "../Websocket/WebSocketContext";
import { Rgb } from "../../types/rgb";

function DrawingPanel(props: { selectedColor: Rgb }) {
  const { selectedColor } = props;
  const ws = useWebSocket();  // Get WebSocket instance
  const [isDrawing, setIsDrawing] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

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
  }, []);

  

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
          rowIndex={rowIndex}  // Pass the row index down
          width={width}
          selectedColor={selectedColor}
          isDrawing={isDrawing}
        />
      ))}
    </div>
  );
}

export default DrawingPanel;
