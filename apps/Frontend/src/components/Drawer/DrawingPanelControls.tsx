import { ActionType, ActionValue } from "../../types/data";
import { Rgb } from "../../types/rgb";

const DrawingPanelControls = (props: {selectedColor: Rgb, handleAction: (action: ActionType, value: ActionValue) => void, brightness: number, handleExport: () => void }) => {
  const { selectedColor, handleAction, brightness, handleExport } = props;
  return (
    <div className="p-5">
      <button className="btn p-3 m-3" onClick={() => handleAction("FILL", selectedColor)}>
        FILL
      </button>
      <button className="btn p-3 m-3" onClick={() => handleAction("FILL", { r: 0, g: 0, b: 0 })}>
        CLEAR
      </button>
      <button className="btn p-3 m-3" onClick={() => handleExport()}>
        EXPORT
      </button>

      <div className="flex items-center ml-20">
        <label className="mr-2">BRIGHTNESS</label>
        <input
          type="number"
          min="1"
          max="255"
          value={brightness}
          onChange={(e) => handleAction("BRIGHTNESS", Number(e.target.value))}
          className="p-2 border border-gray-400 rounded w-24"
        />
      </div>
    </div>
  );
};

export default DrawingPanelControls;
