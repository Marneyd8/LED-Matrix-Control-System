import { Rgb } from "../../types/rgb";
import Pixel from "./Pixel";

function Row(props: { width: number; rowIndex: number; selectedColor: Rgb; isDrawing: boolean; fillButtonClicked: boolean; setFillButtonClicked: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { width, rowIndex, selectedColor, isDrawing, fillButtonClicked, setFillButtonClicked } = props;
  console.log(selectedColor);
  console.log(fillButtonClicked);
  return (
    <div className="flex">
      {Array.from({ length: width }).map((_, colIndex) => (
        <Pixel
          key={colIndex}
          row={rowIndex}
          col={colIndex}
          selectedColor={selectedColor}
          isDrawing={isDrawing}
          fillButtonClicked={fillButtonClicked} // Pass the button click state
          setFillButtonClicked={setFillButtonClicked} // Pass the setter function
        />
      ))}
    </div>
  );
}

export default Row;
