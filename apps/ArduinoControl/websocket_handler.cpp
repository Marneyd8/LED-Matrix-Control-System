#include "websocket_handler.h"
#include "text_display.h"
#include "effects.h"
#include "led_control.h"
#include "config.h"
#include <ArduinoJson.h>
#include <WiFiWebServer.h>

WiFiClient client;
WiFiWebSocketClient wsClient(client, SERVER_ADDRESS, 80);
char serverAddress[] = SERVER_ADDRESS;
int port = 80;
bool connected = false;
bool spiralActive = false;
bool waveActive = false;
bool randomActive = false;
bool fireActive = false;
bool waterActive = false;
bool textActive = false;

char ssid[] = WIFI_SSID;
char pass[] = WIFI_PASS;

void start(){
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
    if (size > 0) {
      textActive = false;

      String message = "";
      while (wsClient.available()) {
        message += (char)wsClient.read();
      }
      // Convert to char array before parsing (alternative method)
      const char* msg = message.c_str(); 

      if (message == "PARAMETERS"){
        sendParameters(message);
      }else if (message == "SPIRAL") {
        spiralActive = !spiralActive;
        if (spiralActive == false){
          fillLED(0, 0, 0);
        }
      }else if (message == "WAVE") {
        waveActive = !waveActive;
        if (waveActive == false){
          fillLED(0, 0, 0);
        }
      }else if (message == "RANDOM") {
        randomActive = !randomActive;
        if (randomActive == false){
          fillLED(0, 0, 0);
        }
      }else if (message == "FIRE") {
        fireActive = !fireActive;
        if (fireActive == false){
          fillLED(0, 0, 0);
        }
      }else if (message == "WATER") {
        waterActive = !waterActive;
        if (waterActive == false){
          fillLED(0, 0, 0);
        }
      }else{
        parseWebSocketMessage(message);
      }
    }

    if (spiralActive) spiralEffect();
    if (waveActive) waveEffect();
    if (randomActive) randomEffect();
    if (fireActive) fireEffect();
    if (waterActive) waterEffect();
    if (textActive) displayText(globalTextmap, globalLength, globalSpeed);
  }
  // END OF CONNECTION
  connected = false;
  Serial.println("Disconnected from Websocket");
  delay(100);
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

void printWifiStatus()
{
  Serial.print(F("You're connected to the network, IP = "));
  Serial.println(WiFi.localIP());

  Serial.print(F("SSID: "));
  Serial.println(WiFi.SSID());
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

void parseWebSocketMessage(String msg) {
  textActive = false;
  StaticJsonDocument<8192> json; 
  DeserializationError error = deserializeJson(json, msg);
  if (error) {
    Serial.print("JSON Parsing Error: ");
    Serial.println(error.f_str());
    Serial.print("Received message: ");
    Serial.println(msg); // Debugging: Print raw message
    return;
  }

  String action = json["action"];
  if (action == "FILL") {
    int r = json["r"];
    int g = json["g"];
    int b = json["b"];
    fillLED(r, g, b);
  }
  else if (action == "TEXT"){
    const char* text = json["text"];
    int speed = json["speed"];
    bool loop = json["loop"];
    generateText(text, speed, loop);
  }
  else if (action == "BRIGHTNESS") {
    int brightness = json["value"];
    strip.setBrightness(brightness);
    strip.show();
  }
  else if (action == "UPDATE_ROW") {
    JsonArray pixels = json["pixels"];
    for (JsonObject pixel : pixels) {
      int row = pixel["row"];
      int col = pixel["col"];
      int r = pixel["r"];
      int g = pixel["g"];
      int b = pixel["b"];

      if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
        updateLED(row, col, r, g, b);
      } else {
        Serial.println("Invalid RGB values in UPDATE_ALL");
      }
    }

    strip.show();
  }
  else {
    int row = json["row"];
    int col = json["col"];
    int r = json["r"];
    int g = json["g"];
    int b = json["b"];

    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      updateLED(row, col, r, g, b);
      strip.show();
    } else {
      Serial.println("Invalid RGB values received");
    }
  }
}
