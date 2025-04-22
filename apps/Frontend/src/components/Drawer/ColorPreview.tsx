const ColorPreview = (props: { hexColor: string }) => {
  const { hexColor } = props;
  return (
    <div className="w-16 h-16 mb-4 border" style={{ backgroundColor: hexColor }}></div>
  );
};

export default ColorPreview;
