import { Rgb } from "../../types/rgb";

const RgbSliders = (props: {
  rgb: Rgb;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { rgb, onChange } = props;
  return (
    <>
      {["r", "g", "b"].map((color) => (
        <label key={color}>
          {color.toUpperCase()}:
          <input
            type="range"
            name={color}
            min="0"
            max="255"
            value={rgb[color as keyof Rgb]}
            onChange={onChange}
          />
          {rgb[color as keyof Rgb]}
        </label>
      ))}
    </>
  );
};

export default RgbSliders;
