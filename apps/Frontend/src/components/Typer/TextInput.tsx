const TextInput = (props: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  const { value, onChange } = props;
  return (
    <input
      type="text"
      placeholder="Enter text..."
      value={value}
      onChange={onChange}
      className="p-2 border border-gray-400 rounded w-64"
    />
  );
};

export default TextInput;
