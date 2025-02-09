import { useState } from "react";
import Drawer from "./Drawer";
import GifLoader from "./GifLoader";
import ImageLoader from "./ImageLoader";
import Sidebar from "./Sidebar";
import Typer from "./Typer";
import pencil from "../assets/pencil.png";

const MainPage = () => {
  // State to hold the selected function (component)
  const [selectedFunction, setSelectedFunction] = useState<string>("Drawer");

  const handleImageClick = (functionName: string) => {
    setSelectedFunction(functionName);
  };

  return (
    <div className="flex">
      <div className="w-[15%] bg-second">
        <Sidebar />
      </div>

      <div className="w-[85%]">
        <div className="flex justify-evenly p-6 bg-second m-5">
          <button onClick={() => handleImageClick("Drawer")} className="w-40 h-24 bg-main rounded-lg flex flex-col items-center justify-center text-white">
            <span>Drawer</span>
            <img src={pencil} alt="Drawer" className="w-40 h-14 object-cover mt-2 rounded-lg" />
          </button>
          <button onClick={() => handleImageClick("Typer")} className="w-40 h-24 bg-main rounded-lg flex flex-col items-center justify-center text-white">
            <span>Typer</span>
            <img src="path/to/image2.jpg" alt="Typer" className="w-40 h-14 object-cover mt-2 rounded-lg" />
          </button>
          <button onClick={() => handleImageClick("ImageLoader")} className="w-40 h-24 bg-main rounded-lg flex flex-col items-center justify-center text-white">
            <span>ImageLoader</span>
            <img src="path/to/image3.jpg" alt="ImageLoader" className="w-40 h-14 object-cover mt-2 rounded-lg" />
          </button>
          <button onClick={() => handleImageClick("GifLoader")} className="w-40 h-24 bg-main rounded-lg flex flex-col items-center justify-center text-white">
            <span>GifLoader</span>
            <img src="path/to/image4.jpg" alt="GifLoader" className="w-40 h-14 object-cover mt-2 rounded-lg" />
          </button>
        </div>
  
        <div className="">
          {selectedFunction === "Drawer" && <Drawer />}
          {selectedFunction === "Typer" && <Typer />}
          {selectedFunction === "ImageLoader" && <ImageLoader />}
          {selectedFunction === "GifLoader" && <GifLoader />}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
