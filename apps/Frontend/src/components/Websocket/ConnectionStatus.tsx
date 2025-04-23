const ConnectionStatus = (props: { connected: boolean, onRetry:  () => void }) => {
  const {connected, onRetry} = props;
  return(
    <div className="p-4">
      {!connected ? (
        <div>
          <h2>Server: Unable to connect</h2>
          <button onClick={onRetry}>Try again</button>
        </div>
      ) : (
        <h2>Server: Connected</h2>
      )}
    </div>
  )};

export default ConnectionStatus;
