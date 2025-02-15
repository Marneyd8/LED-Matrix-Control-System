import { useEffect, useState } from "react";
import { Rgb } from "../../types/rgb";
import { useWebSocket } from "../Websocket/WebSocketContext";

function Pixel(props: { selectedColor: Rgb; isDrawing: boolean; row: number; col: number; fillButtonClicked: boolean; setFillButtonClicked: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { selectedColor, isDrawing, row, col, fillButtonClicked, setFillButtonClicked } = props;
  const [pixelColor, setPixelColor] = useState({ r: 0, g: 0, b: 0 });
  const [tempColor, setTempColor] = useState(null);
  const ws = useWebSocket();

  // Function to send the color update to WebSocket
  const updateColor = () => {
    if (ws) {
      const colorData = {
        row,
        col,
        r: selectedColor.r,
        g: selectedColor.g,
        b: selectedColor.b
      };
      ws.send(JSON.stringify(colorData));  // Send to Arduino
      console.log("Sent to WebSocket:", colorData);
    } else {
      console.error("WebSocket is not open");
    }
  };

  function applyColor() {
    setPixelColor(selectedColor);
    updateColor();  // Send color update to WebSocket
    setTempColor(null);
  }

  function handleMouseEnter() {
    if (isDrawing) {
      setPixelColor(selectedColor); // Apply color while dragging
      updateColor();
    } else {
      setTempColor(selectedColor); // Only preview color
    }
  }

  function handleMouseLeave() {
    setTempColor(null);
  }

  function handleMouseDown() {
    applyColor(); // Immediately apply color on click
  }

  useEffect(() => {
    if (fillButtonClicked) {
      setPixelColor(selectedColor);
      // Reset the button click state *after* the fill has occurred
      setFillButtonClicked(false);
    }
  }, [fillButtonClicked]); // Add selectedColor as a dependency

  // TODO change w/h based on number of pixels
  return (
    <div
      className="w-6 h-6"
      style={{
        backgroundColor: tempColor
          ? `rgb(${tempColor.r}, ${tempColor.g}, ${tempColor.b})`
          : `rgb(${pixelColor.r}, ${pixelColor.g}, ${pixelColor.b})`,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}

export default Pixel;
