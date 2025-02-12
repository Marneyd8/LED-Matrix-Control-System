import { Rgb } from "../../types/rgb";
import Pixel from "./Pixel";

function Row(props: { width: number; rowIndex: number; selectedColor: Rgb; isDrawing: boolean; }) {
  const { width, rowIndex, selectedColor, isDrawing } = props;

  return (
    <div className="flex">
      {Array.from({ length: width }).map((_, colIndex) => (
        <Pixel
          key={colIndex}
          selectedColor={selectedColor}
          isDrawing={isDrawing}
          row={rowIndex}
          col={colIndex} />
      ))}
    </div>
  );
}

export default Row;
