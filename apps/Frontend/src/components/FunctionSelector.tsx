import pencil from "../assets/pencil.png";
import keyboard from "../assets/keyboard.png";
import photo from "../assets/photo.png";

const FunctionSelector = ({ handleFunctionClick }: { handleFunctionClick: (name: string) => void }) => {
  return (
    <div className="flex justify-evenly p-6 bg-second m-5">
      <button onClick={() => handleFunctionClick("Drawer")} className="btn-fucniton">
        <span>Drawer</span>
        <img src={pencil} alt="Drawer" />
      </button>
      <button onClick={() => handleFunctionClick("Typer")} className="btn-fucniton">
        <span>Typer</span>
        <img src={keyboard} alt="Typer" />
      </button>
      <button onClick={() => handleFunctionClick("ImageLoader")} className="btn-fucniton">
        <span>ImageLoader</span>
        <img src={photo} alt="ImageLoader" />
      </button>
    </div>
  );
};

export default FunctionSelector;
