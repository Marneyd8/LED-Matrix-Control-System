#ifndef WEBSOCKET_HANDLER_H
#define WEBSOCKET_HANDLER_H

#include <WiFiHttpClient.h>

// Function to parse incoming WebSocket messages
void parseWebSocketMessage(String msg);

// Function to send parameters (width and height) to the WebSocket server
void sendParameters(String msg);

// Function to send RGB color values for a specific LED at the given row and column.
void sendRgbValues(int row, int col, int r, int g, int b);

// Function to send RGB values to fill all LEDs with.
void sendFillValues(int r, int g, int b);

// Function to handle the WiFi connection process.
void connectToWifi();

// Function to print the WiFi connection status.
void printWifiStatus();

// Function to initialize and start the WebSocket communication, establishing the connection with the server.
void start();

#endif
