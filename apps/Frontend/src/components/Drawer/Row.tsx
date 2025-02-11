import { Rgb } from "../../types/rgb";
import Pixel from "./Pixel";

function Row(props: { width: number; rowIndex: number; selectedColor: Rgb; isDrawing: boolean; updateColor: Function }) {
  const { width, rowIndex, selectedColor, isDrawing, updateColor } = props;

  return (
    <div className="flex">
      {Array.from({ length: width }).map((_, colIndex) => (
        <Pixel
          key={colIndex}
          selectedColor={selectedColor}
          isDrawing={isDrawing}
          updateColor={() => updateColor(rowIndex, colIndex)}  // Use rowIndex here
        />
      ))}
    </div>
  );
}

export default Row;
