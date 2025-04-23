// Pixel.tsx
import { useEffect, useState } from "react";
import { Rgb } from "../../types/rgb";
import { useWebSocket } from "../Websocket/WebSocketContext";

function Pixel(props: {
  selectedColor: Rgb;
  isDrawing: boolean;
  row: number;
  col: number;
  fillButtonClicked: boolean;
  setFillButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  color: Rgb;
  setColor: (color: Rgb) => void;
}) {
  const {
    selectedColor,
    isDrawing,
    row,
    col,
    fillButtonClicked,
    setFillButtonClicked,
    color,
    setColor
  } = props;

  const [tempColor, setTempColor] = useState<Rgb | null>(null);
  const ws = useWebSocket();

  const updateColor = () => {
    if (ws) {
      const colorData = {
        action: "UPDATE",
        row,
        col,
        r: selectedColor.r,
        g: selectedColor.g,
        b: selectedColor.b
      };
      ws.send(JSON.stringify(colorData));
    }
  };

  const applyColor = () => {
    updateColor();
    setColor(selectedColor);
    setTempColor(null);
  };

  const handleMouseEnter = () => {
    if (isDrawing) {
      setColor(selectedColor);
      updateColor();
    } else {
      setTempColor(selectedColor);
    }
  };

  const handleMouseLeave = () => {
    setTempColor(null);
  };

  const handleMouseDown = () => {
    applyColor();
  };

  useEffect(() => {
    if (fillButtonClicked) {
      setColor(selectedColor);
      setFillButtonClicked(false);
    }
  }, [fillButtonClicked]);

  return (
    <div
      className="w-6 h-6"
      style={{
        backgroundColor: tempColor
          ? `rgb(${tempColor.r}, ${tempColor.g}, ${tempColor.b})`
          : `rgb(${color.r}, ${color.g}, ${color.b})`,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}

export default Pixel;
