import { useState } from "react";
import { Rgb } from "../../types/rgb";
import DrawingPanel from "./DrawingPanel";
import DrawingOptions from "./DrawingOptions";

function Drawer() {
  const [rgb, setRgb] = useState<Rgb>({ r: 0, g: 0, b: 0 });

  return (
    <div className="flex flex-row justify-center p-5">
      {/* Drawer Options */}
      <DrawingOptions rgb={rgb} setRgb={setRgb} />

      {/* LED Matrix */}
      <DrawingPanel selectedColor={rgb} setRgb={setRgb} />
    </div>
  );
}

export default Drawer;
