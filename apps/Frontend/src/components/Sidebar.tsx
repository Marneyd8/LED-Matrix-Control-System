import { useState } from "react";
import { useWebSocket } from "./Websocket/WebSocketContext";

function Sidebar() {
  const ws = useWebSocket();
  const [activeEffects, setActiveEffects] = useState<Record<string, boolean>>({
    SPIRAL: false,
    WAVE: false,
    RANDOM: false,
    FIRE: false,
    WATER: false,
  });

  const toggleEffect = (effect: string) => {
    setActiveEffects((prev) => ({ ...prev, [effect]: !activeEffects[effect] }));
    if (ws) {
      ws.send(`${effect}`);
    }
  };

  return (
    <div className="text-white m-8 flex flex-col mt-6 ml-20 p-8">
      <label className="text-xl pb-10">Special Effects</label>
      {Object.entries(activeEffects).map(([effect, isActive]) => (
        <button
          key={effect}
          className={`rounded-lg text-center active:scale-95 shadow-md transition-all duration-300 w-full py-4 mb-10 ${isActive ? "bg-main" : "bg-main_dark"}`}
          onClick={() => toggleEffect(effect)}
        >
          {effect}
        </button>
      ))}
    </div>
  );
}

export default Sidebar;
