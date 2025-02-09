function Sidebar() {
  return (
    <div className="text-white m-8 flex flex-col mt-10">
      <label className="text-xl pb-10">Special Effects</label>
      <button className="w-full py-4 mb-10 bg-main hover:bg-blue-600 rounded-lg text-center">
        FADE
      </button>
      <button className="w-full py-4 mb-10 bg-main hover:bg-blue-600 rounded-lg text-center">
        WAVE
      </button>
      <button className="w-full py-4 mb-10 bg-main hover:bg-blue-600 rounded-lg text-center">
        RANDOM
      </button>
      <button className="w-full py-4 mb-10 bg-main hover:bg-blue-600 rounded-lg text-center">
        BREATH
      </button>
      <button className="w-full py-4 bg-main hover:bg-blue-600 rounded-lg text-center">
        IDK
      </button>
    </div>
  );
}

export default Sidebar;
