import { useState } from "react";
import Row from "./Row";
import { useWebSocket } from "../Websocket/WebSocketContext";

function DrawingPanel(props: { width: number; height: number; selectedColor: Rgb }) {
  const { width, height, selectedColor } = props;
  const ws = useWebSocket();  // Get WebSocket instance
  const [isDrawing, setIsDrawing] = useState(false);

  function handleMouseDown() {
    setIsDrawing(true);
  }

  function handleMouseUp() {
    setIsDrawing(false);
  }

  // Function to send the color update to WebSocket
  const updateColor = (row: number, col: number) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const colorData = {
        row,
        col,
        color: `rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`,
      };
      ws.send(JSON.stringify(colorData));  // Send to Arduino
      console.log("Sent to WebSocket:", colorData);
    } else {
      console.error("WebSocket is not open");
    }
  };

  return (
    <div
      className="flex flex-col align-center p-10"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Stops drawing when mouse leaves panel
    >
      {Array.from({ length: height }).map((_, rowIndex) => (
        <Row
          key={rowIndex}
          rowIndex={rowIndex}  // Pass the row index down
          width={width}
          selectedColor={selectedColor}
          isDrawing={isDrawing}
          updateColor={updateColor}
        />
      ))}
    </div>
  );
}

export default DrawingPanel;
