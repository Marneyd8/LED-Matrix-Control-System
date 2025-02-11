import { Rgb } from "../../types/rgb";

function DrawingOptions({ rgb, hex, setRgb, setHex, rgbToHex, hexToRgb }) {
  const colorPalette = [
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
    "#FF00FF", "#00FFFF", "#FFFFFF", "#000000"
  ];

  const handleRgbChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setRgb((prevRgb: any) => {
      const updatedRgb = { ...prevRgb, [name]: Number(value) };
      setHex(rgbToHex(updatedRgb.r, updatedRgb.g, updatedRgb.b));
      return updatedRgb;
    });
  };

  const handleHexChange = (e: { target: { value: any; }; }) => {
    const newHex = e.target.value;
    setHex(newHex);
    const newRgb = hexToRgb(newHex);
    if (newRgb) setRgb(newRgb);
  };

  const handlePaletteClick = (color: string) => {
    setHex(color);
    const newRgb = hexToRgb(color);
    if (newRgb) setRgb(newRgb);
  };

  return (
    <div className="flex flex-col items-center mr-4 p-12">
      {/* Current Color Preview */}
      <div className="w-16 h-16 mb-4 border" style={{ backgroundColor: hex }}></div>

      {/* RGB Sliders */}
      <label>Red:
        <input type="range" name="r" min="0" max="255" value={rgb.r} onChange={handleRgbChange} /> {rgb.r}
      </label>
      <label>Green:
        <input type="range" name="g" min="0" max="255" value={rgb.g} onChange={handleRgbChange} /> {rgb.g}
      </label>
      <label>Blue:
        <input type="range" name="b" min="0" max="255" value={rgb.b} onChange={handleRgbChange} /> {rgb.b}
      </label>

      {/* Color Palette */}
      <div className="flex flex-wrap mt-4">
        {colorPalette.map((color, index) => (
          <div key={index} className="w-6 h-6 m-1 border cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={() => handlePaletteClick(color)}>
          </div>
        ))}
      </div>

      {/* Hex Input */}
      <input type="text" value={hex} onChange={handleHexChange} className="mt-2 p-1 border" maxLength={7} />

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
