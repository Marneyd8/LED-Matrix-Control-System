#ifndef WEBSOCKET_HANDLER_H
#define WEBSOCKET_HANDLER_H

#include <WiFiHttpClient.h>


void parseWebSocketMessage(String msg);
void sendParameters(String msg);
void connectToWifi();
void printWifiStatus();
void start();

#endif
