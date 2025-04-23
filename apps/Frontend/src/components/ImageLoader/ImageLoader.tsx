import { useState, useEffect } from "react";
import { useWebSocket } from "../Websocket/WebSocketContext";
import ImageUploader from "./ImageUploader";
import PixelGrid from "./PixelGrid";
import { Pixel } from "../../types/pixel";

function ImageLoader() {
  const ws = useWebSocket();
  const [image, setImage] = useState<string>("");
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

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

  useEffect(() => {
    if (image) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true; // Default bilinear interpolation

      const img = new Image();
      img.src = image;
      img.crossOrigin = "anonymous";
      
      img.onerror = (err) => {
        console.error("Image failed to load:", img.src, err);
      };

      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height).data;
        const pixelArray = [];

        for (let i = 0; i < imageData.length; i += 4) {
          const row = Math.floor(i / 4 / width);
          const col = (i / 4) % width;
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];

          pixelArray.push({ row, col, r, g, b });
        }

        setPixels(pixelArray);
      };
    }
  }, [image, width, height]);

  const sendRows = async () => {
    if (!ws || pixels.length === 0) return;
  
    // Group pixels by row
    const rows = Array.from({ length: height }, (_, rowIndex) =>
      pixels.filter(pixel => pixel.row === rowIndex)
    );
  
    for (const rowPixels of rows) {
      const payload = {
        action: "UPDATE_ROW",
        pixels: rowPixels,
      };
      
      ws.send(JSON.stringify(payload));
      await new Promise(resolve => setTimeout(resolve, width * height /4 )); // Delay
    }
  };
  
  useEffect(() => {
      sendRows();
  }, [pixels, ws, height]);
  

  return (
    <div>
      <ImageUploader onChange={handleImageChange} />
      <PixelGrid pixels={pixels} width={width} />
    </div>
  );
}

export default ImageLoader;
