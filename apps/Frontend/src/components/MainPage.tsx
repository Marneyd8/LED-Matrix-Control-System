import { useState } from "react";
import Drawer from "./Drawer/Drawer";
import ImageLoader from "./ImageLoader/ImageLoader";
import Sidebar from "./Sidebar";
import Typer from "./Typer/Typer";
import pencil from "../assets/pencil.png";
import keyboard from "../assets/keyboard.png";
import photo from "../assets/photo.png";

const MainPage = () => {
  // State to hold the selected component
  const [selectedFunction, setSelectedFunction] = useState<string>("Drawer");

  const handleFunctionClick = (name: string) => {
    setSelectedFunction(name);
  };

  return (
    <div className="flex">
      <div className="w-[20%] bg-second">
        <Sidebar />
      </div>

      <div className="w-[80%]">
        <div className="flex justify-evenly p-6 bg-second m-5">
          <button onClick={() => handleFunctionClick("Drawer")} className="btn-fucniton">
            <span>Drawer</span>
            <img src={pencil} alt="Drawer"/>
          </button>
          <button onClick={() => handleFunctionClick("Typer")} className="btn-fucniton">
            <span>Typer</span>
            <img src={keyboard} alt="Typer"/>
          </button>
          <button onClick={() => handleFunctionClick("ImageLoader")} className="btn-fucniton">
            <span>ImageLoader</span>
            <img src={photo} alt="ImageLoader"/>
          </button>
        </div>
  
        <div className="">
          {selectedFunction === "Drawer" && <Drawer />}
          {selectedFunction === "Typer" && <Typer />}
          {selectedFunction === "ImageLoader" && <ImageLoader />}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
