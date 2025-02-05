#include <WiFiHttpClient.h>
#include <WiFiWebServer.h>
#include <Adafruit_NeoPixel.h>
#include <ArduinoJson.h>
#include "config.h"


// WEBSERVER CONTROL FUNCTIONS AND VARIABLES
char ssid[] = WIFI_SSID;
char pass[] = WIFI_PASS; 
char serverAddress[] = SERVER_ADDRESS;
int port = 80;
WiFiClient client;
WiFiWebSocketClient wsClient(client, serverAddress, port);
int connected = 0;

void printWifiStatus()
{
  Serial.print(F("You're connected to the network, IP = "));
  Serial.println(WiFi.localIP());

  Serial.print(F("SSID: "));
  Serial.println(WiFi.SSID());
}

void parseWebSocketMessage(String msg) {
  // static json - slightly faster then dynamic json
  StaticJsonDocument<200> json;
  if (!deserializeJson(json, msg)) {
    Serial.println("Failed to parse JSON");
    return;
  }

  int row = json["row"];
  int col = json["col"];
  String color = json["color"];
  
  int r, g, b;
  if (parseRGB(color, r, g, b)) {
    // UPDATE LEDS BASED ON RECIEVED JSON
    updateLED(row, col, r, g, b);
    // SEND CONFIRMATION AFTER UPDATING MATRIX
    sendWebSocketConfirmation(row, col, r, g, b);
  } else {
    Serial.println("Failed to parse RGB values");
  }
}

bool parseRGB(String color, int &r, int &g, int &b) {
  color.replace("rgb(", "");
  color.replace(")", "");

  int firstComma = color.indexOf(',');
  int secondComma = color.lastIndexOf(',');
  
  if (firstComma > 0 && secondComma > firstComma) {
    r = color.substring(0, firstComma).toInt();
    g = color.substring(firstComma + 1, secondComma).toInt();
    b = color.substring(secondComma + 1).toInt();
    return true;
  }
  return false;
}

void sendWebSocketConfirmation(int row, int col, int r, int g, int b) {
  StaticJsonDocument<200> responseJson;
  responseJson["row"] = row;
  responseJson["col"] = col;
  responseJson["r"] = r;
  responseJson["g"] = g;
  responseJson["b"] = b;
  
  String response;
  serializeJson(responseJson, response);
  webSocket.sendTXT(response);
}

void connectToWifi() {
  Serial.print(F("Connecting to SSID: "));
  Serial.println(ssid);
  
  int status = WiFi.begin(ssid, pass);
  delay(1000);
  Serial.println(status);
  while ( status != WL_CONNECTED)
  {
    delay(500);
    status = WiFi.status();
  }
}


// LED CONTROL FUNCTIONS AND VARIABLES
Adafruit_NeoPixel strip(MATRIX_WIDTH * MATRIX_WIDTH, DATA_PIN, NEO_GRB + NEO_KHZ800);

void stripSetUp(){
  strip.begin();  // Initialize the LED strip
  strip.show();   // Set all LEDs to off
  strip.setBrightness(25);
}

void updateLED(int row, int col, int r, int g, int b) {
  int index = row * MATRIX_WIDTH + col; // Convert row and col to LED index (1D array)
  strip.setPixelColor(index, strip.Color(r, g, b));
  strip.show();
}


// ARDUINO SETUP AND LOOP

void setup()
{
  Serial.begin(115200);
  connectToWifi();
  printWifiStatus();
  stripSetUp();
}

void loop()
{
  Serial.println("Starting WebSocket client");
  wsClient.begin();
  
  while (wsClient.connected())
  {
    if (connected == 0){
      // FIRST MESSAGE TO ESTABLISH CONNECTION
      wsClient.beginMessage(TYPE_TEXT);
      wsClient.print("ARDUINO CONNECTED");
      wsClient.endMessage();
      connected = 1;
    }
    int messageSize = wsClient.parseMessage();
    if (messageSize > 0)
    {
      String msg = wsClient.readString();
      Serial.println("Received: " + msg);
      
      parseWebSocketMessage(msg);
    }
  }
  // END OF CONNECTION
  connected = 0;
  Serial.println("Disconnected from Websocket");
  delay(1000);
}
