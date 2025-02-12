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
bool connected = false;

void printWifiStatus()
{
  Serial.print(F("You're connected to the network, IP = "));
  Serial.println(WiFi.localIP());

  Serial.print(F("SSID: "));
  Serial.println(WiFi.SSID());
}

void parseWebSocketMessage(String msg) {
  StaticJsonDocument<256> json;
  DeserializationError error = deserializeJson(json, msg);
  if (error) {
    Serial.print("JSON Parsing Error: ");
    Serial.println(error.f_str());
    return;
  }

  int row = json["row"];
  int col = json["col"];
  int r = json["r"];
  int g = json["g"];
  int b = json["b"];

  if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
    updateLED(row, col, r, g, b);
    sendWebSocketConfirmation(row, col, r, g, b);
  } else {
    Serial.println("Failed to parse RGB values");
  }
}


void sendParameters(String msg) {
  StaticJsonDocument<200> responseJson;
  responseJson["width"] = MATRIX_WIDTH;
  responseJson["height"] = MATRIX_LENGTH;
  String response;
  serializeJson(responseJson, response);
  wsClient.beginMessage(TYPE_TEXT);
  wsClient.print(response);
  wsClient.endMessage();
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
  wsClient.beginMessage(TYPE_TEXT);
  wsClient.print(response);
  wsClient.endMessage();
}

void connectToWifi() {
  Serial.print(F("Connecting to SSID: "));
  Serial.println(ssid);
  
  int status = WiFi.begin(ssid, pass);
  delay(1000);
  Serial.println(status);
  while ( status != WL_CONNECTED)
  {
    delay(1000);
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
    if (!(connected)){
      // FIRST MESSAGE TO ESTABLISH CONNECTION
      wsClient.beginMessage(TYPE_TEXT);
      wsClient.print("ARDUINO CONNECTED");
      wsClient.endMessage();
      connected = true;
    }
    int size = wsClient.parseMessage();
    if (size > 0)
    {
      String message = wsClient.readString();
      Serial.println("Received: " + message);

      if (message == "PARAMETERS"){
        sendParameters(message);
      }else{
        parseWebSocketMessage(message);
      }
    }
  }
  // END OF CONNECTION
  connected = false;
  Serial.println("Disconnected from Websocket");
  delay(1000);
}
