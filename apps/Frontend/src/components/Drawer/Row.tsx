// Row.tsx
import { Rgb } from "../../types/rgb";
import Pixel from "./Pixel";

function Row(props: {
  width: number;
  rowIndex: number;
  selectedColor: Rgb;
  isDrawing: boolean;
  fillButtonClicked: boolean;
  setFillButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  pixelRowColors: Rgb[];
  updatePixelColor: (col: number, color: Rgb) => void;
}) {
  const {
    width,
    rowIndex,
    selectedColor,
    isDrawing,
    fillButtonClicked,
    setFillButtonClicked,
    pixelRowColors,
    updatePixelColor
  } = props;

  return (
    <div className="flex">
      {Array.from({ length: width }).map((_, colIndex) => (
        <Pixel
          key={colIndex}
          row={rowIndex}
          col={colIndex}
          selectedColor={selectedColor}
          isDrawing={isDrawing}
          fillButtonClicked={fillButtonClicked}
          setFillButtonClicked={setFillButtonClicked}
          color={pixelRowColors[colIndex]}
          setColor={(color) => updatePixelColor(colIndex, color)}
        />
      ))}
    </div>
  );
}

export default Row;
