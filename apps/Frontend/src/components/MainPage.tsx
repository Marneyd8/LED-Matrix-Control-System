import { useState } from "react";
import Drawer from "./Drawer/Drawer";
import ImageLoader from "./ImageLoader/ImageLoader";
import Sidebar from "./Sidebar";
import Typer from "./Typer/Typer";
import FunctionSelector from "./FunctionSelector";

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
        <FunctionSelector handleFunctionClick={handleFunctionClick} />
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
