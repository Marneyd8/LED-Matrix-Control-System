import { Pixel } from "../../types/pixel";

const PixelGrid = (props: { pixels: Pixel[], width: number }) => {
  const { pixels, width } = props;
  return (
    <div className="flex justify-center mt-4">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${width}, 25px)`,
        }}>
      {pixels.map((pixel, index) => (
        <div
          key={index}
          className="w-[25px] h-[25px]"
          style={{
            backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`,
          }}
        />
      ))}
      </div>
    </div>
  );
};

export default PixelGrid;
