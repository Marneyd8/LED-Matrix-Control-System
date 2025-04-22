const SendButton= (props: { onClick: () => void }) => {
  const {onClick} = props;
  return (
    <button onClick={onClick} className="btn p-3 m-3">
      Send to LED
    </button>
  );
};

export default SendButton;
