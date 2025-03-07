import { useState, useEffect } from "react";
import { useWebSocket } from "../Websocket/WebSocketContext";

function ImageLoader() {
  const [image, setImage] = useState(null);
  const [pixels, setPixels] = useState([]);
  const ws = useWebSocket();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
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
      const img = new Image();
      img.src = image;
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;

        ctx.imageSmoothingEnabled = true; // Default bilinear interpolation

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

  useEffect(() => {
    if (ws && pixels.length > 0) {
      const sendRows = async () => {
        for (let row = 0; row < height; row++) {
          const rowPixels = pixels.filter(pixel => pixel.row === row);
          
          const payload = {
            action: "UPDATE_ROW",
            pixels: rowPixels,
          };
  
          console.log("Sending JSON:", JSON.stringify(payload)); // Debugging
          ws.send(JSON.stringify(payload));
  
          // Delay before sending the next row (500ms in this example)
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      };
  
      sendRows(); // Call the async function
    }
  }, [pixels, ws, height]);
  

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${width}, 10px)`,
          gap: "1px",
          marginTop: "10px",
        }}
      >
        {pixels.map((pixel, index) => (
          <div
            key={index}
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageLoader;
