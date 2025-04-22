import { useState, useEffect, useRef } from "react";
import Row from "./Row";
import { useWebSocket } from "../Websocket/WebSocketContext";
import { Rgb } from "../../types/rgb";
import { exportComponentAsPNG } from "react-component-export-image";
import DrawingPanelControls from "./DrawingPanelControls";

function DrawingPanel(props: { selectedColor: Rgb, setRgb: React.Dispatch<React.SetStateAction<Rgb>> }) {
  const { selectedColor, setRgb } = props;
  const ws = useWebSocket();
  const [isDrawing, setIsDrawing] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [fillButtonClicked, setFillButtonClicked] = useState<boolean>(false);
  const [brightness, setBrightness] = useState(25);
  const panelRef = useRef(null);

  useEffect(() => {
    if (ws) {
      ws.send("PARAMETERS");
      ws.onmessage = (message) => {
        try {
          const data = JSON.parse(message.data);
          if (data.width && data.height) {
            setWidth(data.width);
            setHeight(data.height);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    }
  }, [ws]);

  const handleAction = (action: string, value: any) => {
    let data = null;
    if (action == "FILL"){
      setFillButtonClicked(true);
      setRgb(value); // Set the new RGB color
      data = {
        action: action,
        r: value.r,
        g: value.g,
        b: value.b,
      };
    }
    if (action === "BRIGHTNESS") {
      setBrightness(value); // Set the brightness state when brightness changes
      data = {
        action: action,
        value: value,
      }
    }
    if (ws) {
      ws.send(JSON.stringify(data));  // Send to Arduino
      console.log("Sent to WebSocket:", data);
    }
  };


  // Handle export action
  const handleExport = () => {
    if (panelRef.current){
      exportComponentAsPNG(panelRef);
    }
  };

  return (
    <div
      className="p-10"
      onMouseDown={() => setIsDrawing(true)}
      onMouseUp={() => setIsDrawing(false)}
      onMouseLeave={() => setIsDrawing(false)} // Stops drawing when mouse leaves panel
    >
    <div ref={panelRef} className="ml-14 w-${height}">
        {Array.from({ length: height }).map((_, rowIndex) => (
          <Row
            key={rowIndex}
            rowIndex={rowIndex}
            width={width}
            selectedColor={selectedColor}
            isDrawing={isDrawing}
            fillButtonClicked={fillButtonClicked}
            setFillButtonClicked={setFillButtonClicked}
          />
        ))}
      </div>
      <DrawingPanelControls
        selectedColor={selectedColor}
        handleAction={handleAction}
        brightness={brightness}
        handleExport={handleExport}
      />
    </div>
  );
}

export default DrawingPanel;
