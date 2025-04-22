const SpeedControl = (props: { speed: number, setSpeed: (speed: number) => void }) => {
  const {speed, setSpeed} = props;
  return (
    <div className="flex flex-col items-center">
      <label className="text-sm font-semibold">Speed of Change (1-100)</label>
      <input
        type="number"
        value={speed}
        min="1"
        max="100"
        onChange={(e) => setSpeed(Number(e.target.value))}
        className="p-2 border border-gray-400 rounded w-64"
      />
    </div>
  );
};

export default SpeedControl;
