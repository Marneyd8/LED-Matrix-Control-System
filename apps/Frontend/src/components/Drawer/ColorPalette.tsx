const ColorPalette = (props: { colors: string[]; onSelect: (color: string) => void }) => {
  const { colors, onSelect } = props;
  return (
    <div className="flex flex-wrap mt-4">
      {colors.map((color) => (
        <div
          key={color}
          className="w-6 h-6 m-1 border cursor-pointer"
          style={{ backgroundColor: color }}
          onClick={() => onSelect(color)}
        />
      ))}
    </div>
  );
};

export default ColorPalette;
