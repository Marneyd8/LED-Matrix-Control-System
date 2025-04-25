import { useRef, useState, useCallback, useEffect } from "react";
import { exportComponentAsPNG } from "react-component-export-image";
import { Rgb } from "../../types/rgb";
import { useWebSocket } from "../Websocket/WebSocketContext";
import DrawingPanelControls from "./DrawingPanelControls";
import Row from "./Row";

function DrawingPanel(props: { selectedColor: Rgb; setRgb: React.Dispatch<React.SetStateAction<Rgb>> }) {
  const { selectedColor, setRgb } = props;
  const ws = useWebSocket();
  const panelRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brightness, setBrightness] = useState(25);
  const [pixelColors, setPixelColors] = useState<Rgb[][]>([]);

  // Initializes the pixel colors (defaulting to black)
  const initializePixels = useCallback((width: number, height: number) => {
    setPixelColors(Array.from({ length: height }, () => Array.from({ length: width }, () => ({ r: 0, g: 0, b: 0 }))));
  }, []);

  // Handles the "FILL_BACK" action, which sets all pixels to a specific color
  const handleFillBack = useCallback(({ r, g, b }: Rgb) => {
    setPixelColors(prev =>
      prev.map(row => row.map(() => ({ r, g, b })))
    );
  }, []);

  // Updates the color of a specific pixel at a given position (row, col)
  const handleUpdateBack = useCallback((row: number, col: number, color: Rgb) => {
    setPixelColors(prev =>
      prev.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((c, colIndex) => (colIndex === col ? color : c))
          : r
      )
    );
  }, []);

  // Handles incoming WebSocket messages and triggers actions based on the message content
  const handleMessage = useCallback((message: MessageEvent) => {
    try {
      const data = JSON.parse(message.data);

      if (data.width && data.height) {
        initializePixels(data.width, data.height);
      } else if (data.action === "FILL_BACK") {
        handleFillBack(data);
      } else if (data.action === "UPDATE_BACK") {
        handleUpdateBack(data.row, data.col, { r: data.r, g: data.g, b: data.b });
      }
    } catch (err) {
      console.error("WebSocket message error:", err);
    }
  }, [initializePixels, handleFillBack, handleUpdateBack]);

  // Set up WebSocket listener on component mount
  useEffect(() => {
    if (!ws) return;

    const handleOpen = () => ws.send("PARAMETERS");
    ws.addEventListener("message", handleMessage);
    handleOpen();

    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [ws, handleMessage]);

  // Handles actions
  const handleAction = useCallback((action: string, value: any) => {
    let data: { action: string;[key: string]: any } | null = null;

    if (action === "FILL") {
      setRgb(value);
      data = { action: "FILL", r: value.r, g: value.g, b: value.b };
    } else if (action === "BRIGHTNESS") {
      setBrightness(value);
      data = { action: "BRIGHTNESS", value };
    }

    if (ws && data) {
      ws.send(JSON.stringify(data)); // Send data to the WebSocket server
      console.log("Sent to WebSocket:", data);
    }
  }, [ws, setRgb]);

  // Exports the drawing panel as a PNG image
  const handleExport = useCallback(() => {
    if (panelRef.current) exportComponentAsPNG(panelRef);
  }, []);

  // Updates the color of a specific pixel and sends the change to the WebSocket server
  const updatePixelColor = useCallback((row: number, col: number, color: Rgb) => {
    setPixelColors(prev =>
      prev.map((r, rowIndex) =>
        rowIndex === row ? r.map((c, colIndex) => (colIndex === col ? color : c)) : r
      )
    );

    if (ws) {
      ws.send(JSON.stringify({ action: "UPDATE", row, col, r: color.r, g: color.g, b: color.b })); // Send updated color to WebSocket server
    }
  }, [ws]);

  return (
    <div
      className="p-10"
      onMouseDown={() => setIsDrawing(true)}
      onMouseUp={() => setIsDrawing(false)}
      onMouseLeave={() => setIsDrawing(false)}
    >
      <div ref={panelRef} className="ml-14 w-${48 * WIDTH / 8}">
        {pixelColors.map((rowColors, rowIndex) => (
          <Row
            key={rowIndex}
            rowIndex={rowIndex}
            selectedColor={selectedColor}
            isDrawing={isDrawing}
            pixelRowColors={rowColors}
            updatePixelColor={updatePixelColor}
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
