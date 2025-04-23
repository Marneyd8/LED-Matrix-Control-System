import { Rgb } from "../../types/rgb";
import Pixel from "./Pixel";

function Row(props: { rowIndex: number, selectedColor: Rgb, isDrawing: boolean, pixelRowColors: Rgb[], updatePixelColor: (row: number, col: number, color: Rgb) => void;}) {
  const { rowIndex, selectedColor, isDrawing, pixelRowColors, updatePixelColor } = props;

  return (
    <div className="flex">
      {pixelRowColors.map((color, colIndex) => (
        <Pixel
          key={colIndex}
          row={rowIndex}
          col={colIndex}
          selectedColor={selectedColor}
          isDrawing={isDrawing}
          color={color}
          setColor={(c) => updatePixelColor(rowIndex, colIndex, c)}
        />
      ))}
    </div>
  );
}

export default Row;
