const HexInput = (props: {
  hexValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { hexValue, onChange } = props;
  return (
    <input
      type="text"
      value={hexValue}
      onChange={onChange}
      className="mt-2 p-1 border"
      maxLength={7}
    />
  );
};

export default HexInput;
