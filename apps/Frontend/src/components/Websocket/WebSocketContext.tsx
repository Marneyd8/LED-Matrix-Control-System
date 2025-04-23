import { createContext, useContext } from "react";

// Create a React context to hold the WebSocket instance
export const WebSocketContext = createContext<WebSocket | null>(null);

// Custom hook to access the WebSocket instance from context.
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
