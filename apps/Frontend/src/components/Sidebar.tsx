function Sidebar() {
  return (
    <div className="text-white m-8 flex flex-col mt-6 ml-20 p-8">
      <label className="text-xl pb-10">Special Effects</label>
      <button className="btn w-full py-4 mb-10">
        FADE
      </button>
      <button className="btn w-full py-4 mb-10">
        WAVE
      </button>
      <button className="btn w-full py-4 mb-10">
        RANDOM
      </button>
      <button className="btn w-full py-4 mb-10">
        BREATH
      </button>
      <button className="btn w-full py-4 ">
        IDK
      </button>
    </div>
  );
}

export default Sidebar;
