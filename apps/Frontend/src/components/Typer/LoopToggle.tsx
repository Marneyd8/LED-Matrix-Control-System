const LoopToggle = (props: { loop: boolean, toggleLoop: () => void }) => {
  const {loop, toggleLoop} = props;
  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={loop}
        onChange={toggleLoop}
        className="w-4 h-4"
      />
      <span>Loop text</span>
    </label>
  );
};

export default LoopToggle;
