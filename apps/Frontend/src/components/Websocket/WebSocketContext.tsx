import { createContext, useContext } from "react";

// Create a React context to hold the WebSocket instance
export const WebSocketContext = createContext<WebSocket | null>(null);

/**
 * Custom hook to access the WebSocket instance from context.
 * 
 * This hook allows any component to access the current WebSocket instance. 
 * It makes it easier to access the WebSocket without needing to pass it through each component as a prop.
 *
 * @returns {WebSocket | null} The WebSocket instance, or null if not available.
 */
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
