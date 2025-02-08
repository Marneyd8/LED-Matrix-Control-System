import { useState } from 'react';
import '../App.css';
import { Rgb } from '../types/rgb';
import { useWebSocket } from './WebSocketContext';


function Drawer() {
  const ws = useWebSocket();
  
  const [colors, setColors] = useState<string[][]>(new Array(8).fill(null).map(() => new Array(8).fill("rgb(169, 169, 169)")));

  const [rgb, setRgb] = useState<Rgb>({ r: 0, g: 0, b: 255 });
  const [isDrawing, setIsDrawing] = useState(false);

  const handleMouseUp = () => {
    setIsDrawing(false);
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (isDrawing) {
      updateColor(row, col);
    }
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsDrawing(true);
    updateColor(row, col);
  };

  const updateColor = (row: number, col: number) => {
    setColors(prevColors => {
      prevColors[row][col] = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      return [...prevColors]; // create a new object = not mutate the existing state directly
    });
    
    if (ws) {
      const colorData = {
        row,
        col,
        color: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      };
      ws.send(JSON.stringify(colorData));
      console.log('Sent to WebSocket:', colorData);
    }
  };

  const handleRgbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // name = r/g/b value = 0:255
    setRgb(prevRgb => ({
      ...prevRgb, // create a new object = not mutate the existing state directly
      [name]: value,
    }));
  };




  // TODO - floating text across the LED, gifs/videos parser to pixelart and then show, establish protocol, make proper drawer

  return (
    <div>
      <div className="grid grid-cols-8 gap-0 p-4">
        {colors.map((row, rowIndex) =>
          row.map((color, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="w-10 h-10 border border-gray-500 cursor-pointer"
              style={{ backgroundColor: color }}
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
              onMouseUp={() => handleMouseUp()}
            />
          ))
        )}
      </div>

      {/* RGB Controls */}
      <div className="mt-4">
        <label>
          Red:
          <input
            type="range"
            name="r"
            min="0"
            max="255"
            value={rgb.r}
            onChange={handleRgbChange}
          />
          {rgb.r}
        </label>
        <br />
        <label>
          Green:
          <input
            type="range"
            name="g"
            min="0"
            max="255"
            value={rgb.g}
            onChange={handleRgbChange}
          />
          {rgb.g}
        </label>
        <br />
        <label>
          Blue:
          <input
            type="range"
            name="b"
            min="0"
            max="255"
            value={rgb.b}
            onChange={handleRgbChange}
          />
          {rgb.b}
        </label>
      </div>
    </div>
  );
}

export default Drawer;
