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
  // Initialize websocket and handle incoming messages
  useEffect(() => {
    if (!ws) return;
  
    const handleOpen = () => {
      ws.send("PARAMETERS");
    };
  
    const handleMessage = (message: MessageEvent) => {
      try {
        const data = JSON.parse(message.data);
        if (data.width && data.height) {
          setWidth(data.width);
          setHeight(data.height);
          setPixelColors(Array.from({ length: data.height }, () =>
            Array.from({ length: data.width }, () => ({ r: 0, g: 0, b: 0 }))
          ));
        }
  
        if (data.action === "FILL_BACK") {
          const { r, g, b } = data;
          setPixelColors(prev =>
            prev.map(row => row.map(() => ({ r, g, b })))
          );
        }
  
        if (data.action === "UPDATE_BACK") {
          const { row, col, r, g, b } = data;
          setPixelColors(prev => {
            const updated = [...prev];
            updated[row] = [...updated[row]];
            updated[row][col] = { r, g, b };
            return updated;
          });
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    };
  
    ws.addEventListener("open", handleOpen);
    ws.addEventListener("message", handleMessage);
  
    return () => {
      ws.removeEventListener("open", handleOpen);
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
