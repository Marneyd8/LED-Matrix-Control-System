import { useState } from 'react';
import { Rgb } from '../types/rgb';
import { useWebSocket } from './WebSocketContext';

function Drawer() {
  const ws = useWebSocket();

  const [colors, setColors] = useState<string[][]>(
    // TODO get size of arduino from ws
    // TODO scale down panels
    new Array(8).fill(null).map(() => new Array(8).fill("rgb(169, 169, 169)"))
  );

  const [rgb, setRgb] = useState<Rgb>({ r: 0, g: 0, b: 255 });
  const [hex, setHex] = useState("#0000FF");
  const [isDrawing, setIsDrawing] = useState(false);

  const colorPalette = [
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF", "#000000"
  ];

  const handleMouseUp = () => setIsDrawing(false);
  const handleMouseEnter = (row: number, col: number) => isDrawing && updateColor(row, col);
  const handleMouseDown = (row: number, col: number) => {
    setIsDrawing(true);
    updateColor(row, col);
  };

  const updateColor = (row: number, col: number) => {
    setColors(prevColors => {
      const newColors = [...prevColors];
      newColors[row][col] = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      return newColors;
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
    const { name, value } = e.target;
    setRgb(prevRgb => {
      const updatedRgb = { ...prevRgb, [name]: Number(value) };
      setHex(rgbToHex(updatedRgb.r, updatedRgb.g, updatedRgb.b));
      return updatedRgb;
    });
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setHex(newHex);
    const newRgb = hexToRgb(newHex);
    if (newRgb) setRgb(newRgb);
  };

  const handlePaletteClick = (color: string) => {
    setHex(color);
    const newRgb = hexToRgb(color);
    if (newRgb) setRgb(newRgb);
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  };

  const hexToRgb = (hex: string): Rgb | null => {
    const result = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // TODO add button functions - in here and also in arduino

  return (
    <div className='flex flex-row justify-center'>
      {/* Color Controls */}
      <div className='flex flex-col items-center mr-4 p-12'>
        {/* Current Color */}
        <div className='w-16 h-16 mb-4 border' style={{ backgroundColor: hex }}></div>
        {/* RGB Sliders */}
        <label>Red:
          <input type='range' name='r' min='0' max='255' value={rgb.r} onChange={handleRgbChange} /> {rgb.r}
        </label>
        <label>Green:
          <input type='range' name='g' min='0' max='255' value={rgb.g} onChange={handleRgbChange} /> {rgb.g}
        </label>
        <label>Blue:
          <input type='range' name='b' min='0' max='255' value={rgb.b} onChange={handleRgbChange} /> {rgb.b}
        </label>
        {/* Color Palette */}
        <div className='flex flex-wrap mt-4'>
          {colorPalette.map((color, index) => (
            <div key={index} className='w-6 h-6 m-1 border cursor-pointer' style={{ backgroundColor: color }} onClick={() => handlePaletteClick(color)}></div>
          ))}
        </div>
        {/* Hex Input */}
        <input type='text' value={hex} onChange={handleHexChange} className='mt-2 p-1 border' maxLength={7} />
        <div className='p-5'>
          <button className='btn p-3 m-3'>FILL</button>
          <button className='btn p-3 m-3'>CLEAR</button>
        </div>

      </div>

      {/* LED Matrix */}
      <div className='grid grid-cols-8 gap-0 p-12'>
        {colors.map((row, rowIndex) =>
          row.map((color, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className='w-14 h-14 border border-gray-500 cursor-pointer'
              style={{ backgroundColor: color }}
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
              onMouseUp={handleMouseUp}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Drawer;
