import { useState } from "react";
import { Rgb } from "../../types/rgb";

function Pixel(props: { selectedColor: Rgb; isDrawing: boolean; updateColor: Function }) {
  const { selectedColor, isDrawing, updateColor } = props;
  const [pixelColor, setPixelColor] = useState({ r: 0, g: 0, b: 0 });
  const [tempColor, setTempColor] = useState(null);

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
