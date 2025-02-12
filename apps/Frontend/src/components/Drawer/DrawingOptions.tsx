import { Rgb } from "../../types/rgb";

function DrawingOptions(props: { rgb: Rgb, setRgb: React.Dispatch<React.SetStateAction<Rgb>> }) {
  const { rgb, setRgb } = props;
  const colorPalette = [
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
    "#FF00FF", "#00FFFF", "#FFFFFF", "#000000"
  ];

  const rgbToHex = (r: number, g: number, b: number) =>
    `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : null;
  };

  const handleRgbChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    const updatedRgb = { ...rgb, [name]: Number(value) };
    setRgb(updatedRgb);
  };

  const handleHexChange = (e: { target: { value: string } }) => {
    const newRgb = hexToRgb(e.target.value);
    if (newRgb) setRgb(newRgb);
  };

  const handlePaletteClick = (color: string) => {
    const newRgb = hexToRgb(color);
    if (newRgb) setRgb(newRgb);
  };

  return (
    <div className="flex flex-col items-center mr-4 p-12">
      {/* Current Color Preview */}
      <div className="w-16 h-16 mb-4 border" style={{ backgroundColor: rgbToHex(rgb.r, rgb.g, rgb.b) }}></div>

      {/* RGB Sliders */}
      {["r", "g", "b"].map((color) => (
        <label key={color}>
          {color.toUpperCase()}:
          <input type="range" name={color} min="0" max="255" value={rgb[color]} onChange={handleRgbChange} />
          {rgb[color]}
        </label>
      ))}

      {/* Color Palette */}
      <div className="flex flex-wrap mt-4">
        {colorPalette.map((color) => (
          <div key={color} className="w-6 h-6 m-1 border cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={() => handlePaletteClick(color)}>
          </div>
        ))}
      </div>

      {/* Hex Input */}
      <input type="text" value={rgbToHex(rgb.r, rgb.g, rgb.b)} onChange={handleHexChange} className="mt-2 p-1 border" maxLength={7} />

      {/* Action Buttons */}
      <div className="p-5">
        <button className="btn p-3 m-3">FILL</button>
        <button className="btn p-3 m-3">CLEAR</button>
        <button className="btn p-3 m-3">EXPORT</button>
      </div>
    </div>
  );
}

export default DrawingOptions;
