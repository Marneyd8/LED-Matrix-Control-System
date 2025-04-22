import { Rgb } from "../../types/rgb";
import ColorPalette from "./ColorPalette";
import ColorPreview from "./ColorPreview";
import HexInput from "./HexInput";
import RgbSliders from "./RgbSliders";

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
      <ColorPreview hexColor={rgbToHex(rgb.r, rgb.g, rgb.b)} />
      <RgbSliders rgb={rgb} onChange={handleRgbChange} />
      <ColorPalette colors={colorPalette} onSelect={handlePaletteClick} />
      <HexInput hexValue={rgbToHex(rgb.r, rgb.g, rgb.b)} onChange={handleHexChange} />
    </div>
  );
}

export default DrawingOptions;
