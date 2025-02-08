import Drawer from "./Drawer";
import GifLoader from "./GifLoader";
import ImageLoader from "./ImageLoader";
import Sidebar from "./Sidebar";
import Typer from "./Typer";


function MainPage() {
  return <div><Drawer />
    <Typer />
    <ImageLoader />
    <GifLoader />
    <Sidebar />
  </div>;
}

export default MainPage;
