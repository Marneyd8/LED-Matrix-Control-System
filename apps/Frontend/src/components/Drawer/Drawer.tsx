import { useState } from "react";
import { Rgb } from "../../types/rgb";
import { useWebSocket } from "../Websocket/WebSocketContext";
import DrawingPanel from "./DrawingPanel";
import DrawingOptions from "./DrawingOptions";

function Drawer() {
  const ws = useWebSocket();  // Automatically fetch WebSocket instance

  const [rgb, setRgb] = useState<Rgb>({ r: 0, g: 0, b: 255 });
  const [hex, setHex] = useState("#0000FF");

  const rgbToHex = (r, g, b) =>
    `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;

  const hexToRgb = (hex) => {
    const result = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  return (
    <div className="flex flex-row justify-center p-5">
      {/* Drawer Options */}
      <DrawingOptions
        rgb={rgb}
        hex={hex}
        setRgb={setRgb}
        setHex={setHex}
        rgbToHex={rgbToHex}
        hexToRgb={hexToRgb}
      />

      {/* LED Matrix */}
      <DrawingPanel width={8} height={8} selectedColor={rgb} />
    </div>
  );
}

export default Drawer;
