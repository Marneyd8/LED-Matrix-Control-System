function AllowedCharacters(props: { allowedCharacters: string }) {
  const { allowedCharacters } = props;
  const allowedArray = ["A-Z", "a-z", "0-9"];

  const specialCharacters = Array.from(new Set(
    allowedCharacters
      .replace(/[A-Za-z0-9]/g, "")
      .split("")
      .map((c) => (c === " " ? "space" : c))
  ));

  allowedArray.push(...specialCharacters);

  return (
    <div className="text-xs italic">
      <p>Allowed characters:</p>
      <ul className="flex space-x-2">
        {allowedArray.map((char, index) => (
          <li key={index} className="py-1 rounded">
            {char}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllowedCharacters;
