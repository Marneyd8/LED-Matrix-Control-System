// DrawingPanel.tsx
import { useState, useEffect, useRef } from "react";
import Row from "./Row";
import { useWebSocket } from "../Websocket/WebSocketContext";
import { Rgb } from "../../types/rgb";
import { exportComponentAsPNG } from "react-component-export-image";
import DrawingPanelControls from "./DrawingPanelControls";

function DrawingPanel(props: { selectedColor: Rgb; setRgb: React.Dispatch<React.SetStateAction<Rgb>> }) {
  const { selectedColor, setRgb } = props;
  const ws = useWebSocket();
  const [isDrawing, setIsDrawing] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [fillButtonClicked, setFillButtonClicked] = useState(false);
  const [brightness, setBrightness] = useState(25);
  const [pixelColors, setPixelColors] = useState<Rgb[][]>([]); // 2D color array
  const panelRef = useRef(null);

  useEffect(() => {
    if (!ws) return;
  
    const initializePixels = (width: number, height: number) => {
      setWidth(width);
      setHeight(height);
      setPixelColors(
        Array.from({ length: height }, () =>
          Array.from({ length: width }, () => ({ r: 0, g: 0, b: 0 }))
        )
      );
    };
  
    const handleFillBack = ({ r, g, b }: Rgb) => {
      setPixelColors(prev => prev.map(row => row.map(() => ({ r, g, b }))));
    };
  
    const handleUpdateBack = (row: number, col: number, color: Rgb) => {
      setPixelColors(prev => {
        const updated = [...prev];
        updated[row] = [...updated[row]];
        updated[row][col] = color;
        return updated;
      });
    };
  
    const handleMessage = (message: MessageEvent) => {
      try {
        const data = JSON.parse(message.data);
  
        if (data.width && data.height) {
          initializePixels(data.width, data.height);
        }
  
        if (data.action === "FILL_BACK") {
          handleFillBack(data);
        }
  
        if (data.action === "UPDATE_BACK") {
          const { row, col, r, g, b } = data;
          handleUpdateBack(row, col, { r, g, b });
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    };
  
    const handleOpen = () => {
      ws.send("PARAMETERS");
    };
  
    ws.addEventListener("message", handleMessage);
    handleOpen();
    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [ws]);
  
  
  

  const handleAction = (action: string, value: any) => {
    let data = null;
    if (action === "FILL") {
      setFillButtonClicked(true);
      setRgb(value);
      data = { action: "FILL", r: value.r, g: value.g, b: value.b };
    }
    if (action === "BRIGHTNESS") {
      setBrightness(value);
      data = { action: "BRIGHTNESS", value };
    }
    if (ws) {
      ws.send(JSON.stringify(data));
      console.log("Sent to WebSocket:", data);
    }
  };

  const handleExport = () => {
    if (panelRef.current) exportComponentAsPNG(panelRef);
  };

  return (
    <div
      className="p-10"
      onMouseDown={() => setIsDrawing(true)}
      onMouseUp={() => setIsDrawing(false)}
      onMouseLeave={() => setIsDrawing(false)}
    >
      <div ref={panelRef} className="ml-14">
        {Array.from({ length: height }).map((_, rowIndex) => (
          <Row
            key={rowIndex}
            rowIndex={rowIndex}
            width={width}
            selectedColor={selectedColor}
            isDrawing={isDrawing}
            fillButtonClicked={fillButtonClicked}
            setFillButtonClicked={setFillButtonClicked}
            pixelRowColors={pixelColors[rowIndex] || []}
            updatePixelColor={(col, color) => {
              setPixelColors(prev => {
                const updated = [...prev];
                updated[rowIndex] = [...updated[rowIndex]];
                updated[rowIndex][col] = color;
                return updated;
              });
            }}
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
