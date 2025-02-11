import { useState } from "react";
import Drawer from "./Drawer/Drawer";
import GifLoader from "./Loaders/GifLoader";
import ImageLoader from "./Loaders/ImageLoader";
import Sidebar from "./Sidebar";
import Typer from "./Typer/Typer";
import pencil from "../assets/pencil.png";
import Demo from "./Demo";

const MainPage = () => {
  // State to hold the selected component
  const [selectedFunction, setSelectedFunction] = useState<string>("Drawer");

  const handleFunctionClick = (name: string) => {
    setSelectedFunction(name);
  };
  // TODO IMAGES
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
            <img src="path/to/image2.jpg" alt="Typer"/>
          </button>
          <button onClick={() => handleFunctionClick("ImageLoader")} className="btn-fucniton">
            <span>ImageLoader</span>
            <img src="path/to/image3.jpg" alt="ImageLoader"/>
          </button>
          <button onClick={() => handleFunctionClick("GifLoader")} className="btn-fucniton">
            <span>GifLoader</span>
            <img src="path/to/image4.jpg" alt="GifLoader"/>
          </button>
          <button onClick={() => handleFunctionClick("Demo")} className="btn-fucniton">
            <span>Demo</span>
            <img src="path/to/image5.jpg" alt="Demo"/>
          </button>
        </div>
  
        <div className="">
          {selectedFunction === "Drawer" && <Drawer />}
          {selectedFunction === "Typer" && <Typer />}
          {selectedFunction === "ImageLoader" && <ImageLoader />}
          {selectedFunction === "GifLoader" && <GifLoader />}
          {selectedFunction === "Demo" && <Demo />}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
