#ifndef WEBSOCKET_HANDLER_H
#define WEBSOCKET_HANDLER_H

#include <WiFiHttpClient.h>


void parseWebSocketMessage(String msg);
void sendParameters(String msg);
void sendRgbValues(int row, int col, int r, int g, int b);
void connectToWifi();
void printWifiStatus();
void start();

#endif
