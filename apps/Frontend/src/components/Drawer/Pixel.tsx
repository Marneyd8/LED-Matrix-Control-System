import { useState } from "react";
import { Rgb } from "../../types/rgb";

function Pixel(props: { selectedColor: Rgb, isDrawing: boolean, row: number, col: number, color: Rgb, setColor: (color: Rgb) => void }) {
  const { selectedColor, isDrawing, color, setColor } = props;
  const [hovered, setHovered] = useState(false);

  const applyColor = () => {
    setColor(selectedColor);
  };

  const handleMouseEnter = () => {
    setHovered(true);
    if (isDrawing) {
      applyColor();
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleMouseDown = () => {
    applyColor();
  };

  return (
    <div
      style={{
        width: '1.5rem', height: '1.5rem', cursor: 'pointer',
        backgroundColor: `rgb(${hovered && !isDrawing ? selectedColor.r : color.r}, 
                              ${hovered && !isDrawing ? selectedColor.g : color.g}, 
                              ${hovered && !isDrawing ? selectedColor.b : color.b})`
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );

}

export default Pixel;
