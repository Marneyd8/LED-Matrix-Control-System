#include <WiFiHttpClient.h>
#include <WiFiWebServer.h>
#include <Adafruit_NeoPixel.h>
#include <ArduinoJson.h>
#include "config.h"

// WEBSERVER CONTROL VARIABLES
char ssid[] = WIFI_SSID;
char pass[] = WIFI_PASS; 
char serverAddress[] = SERVER_ADDRESS;
int port = 80;
WiFiClient client;
WiFiWebSocketClient wsClient(client, serverAddress, port);
bool connected = false;

// LED CONTROL VARIABLES
Adafruit_NeoPixel strip(MATRIX_WIDTH * MATRIX_WIDTH, DATA_PIN, NEO_GRB + NEO_KHZ800);

// EFECTS
bool fadeActive = false;
bool waveActive = false;
bool randomActive = false;
bool breathActive = false;
bool idkActive = false;


// WEBSERVER CONTROL FUNCTIONS
void printWifiStatus()
{
  Serial.print(F("You're connected to the network, IP = "));
  Serial.println(WiFi.localIP());

  Serial.print(F("SSID: "));
  Serial.println(WiFi.SSID());
}

void parseWebSocketMessage(String msg) {
  StaticJsonDocument<200> json;
  DeserializationError error = deserializeJson(json, msg);
  if (error) {
    Serial.print("JSON Parsing Error: ");
    Serial.println(error.f_str());
    return;
  }

  String action = json["action"];
  
  if (action == "FILL") {
    int r = json["r"];
    int g = json["g"];
    int b = json["b"];
    fillLED(r, g, b);
  }
  else if (action == "BRIGHTNESS") {
    int brightness = json["value"];
    strip.setBrightness(brightness);
    strip.show();
    Serial.println("Brightness set to: " + String(brightness));
  }
  else {
    int row = json["row"];
    int col = json["col"];
    int r = json["r"];
    int g = json["g"];
    int b = json["b"];

    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      updateLED(row, col, r, g, b);
    } else {
      Serial.println("Invalid RGB values received");
    }
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


// LED CONTROL FUNCTIONS

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

void fillLED(int r, int g, int b){
  for (int i = 0; i < MATRIX_WIDTH; i++){
    for (int j = 0; j < MATRIX_WIDTH; j++){
      int index = i * MATRIX_WIDTH + j;
      strip.setPixelColor(index, strip.Color(r, g, b));
      strip.show();
    }
  }
}

// EFFECT FUNCTIONS

void fadeEffect() {
  for (int brightness = 0; brightness <= 255; brightness += 5) {
    strip.setBrightness(brightness);
    strip.show();
    delay(30);
  }
  for (int brightness = 255; brightness >= 0; brightness -= 5) {
    strip.setBrightness(brightness);
    strip.show();
    delay(30);
  }
}

void waveEffect() {
  for (int i = 0; i < MATRIX_WIDTH; i++) {
    for (int j = 0; j < MATRIX_WIDTH; j++) {
      int index = i * MATRIX_WIDTH + j;
      strip.setPixelColor(index, strip.Color(0, 0, 255));
    }
    strip.show();
    delay(100);
    fillLED(0, 0, 0);
  }
}

void randomEffect() {
  for (int i = 0; i < MATRIX_WIDTH * MATRIX_WIDTH; i++) {
    int r = random(256);
    int g = random(256);
    int b = random(256);
    strip.setPixelColor(i, strip.Color(r, g, b));
  }
  strip.show();
  delay(500);
}

void breathEffect() {
  for (int brightness = 0; brightness <= 255; brightness += 5) {
    strip.setBrightness(brightness);
    strip.show();
    delay(50);
  }
  for (int brightness = 255; brightness >= 0; brightness -= 5) {
    strip.setBrightness(brightness);
    strip.show();
    delay(50);
  }
}

void idkEffect() {
  for (int i = 0; i < MATRIX_WIDTH * MATRIX_WIDTH; i++) {
    strip.setPixelColor(i, strip.Color(255, 0, 255));
  }
  strip.show();
  delay(1000);
  fillLED(0, 0, 0);
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
      }else if (message == "FADE") {
        fadeActive = !fadeActive;
      }else if (message == "WAVE") {
        waveActive = !waveActive;
      }else if (message == "RANDOM") {
        randomActive = !randomActive;
        if (randomActive == false){
          fillLED(0, 0, 0);
        }
      }else if (message == "BREATH") {
        breathActive = !breathActive;
      }else if (message == "IDK") {
        idkActive = !idkActive;
      }else{
        parseWebSocketMessage(message);
      }
    }

    if (fadeActive) fadeEffect();
    if (waveActive) waveEffect();
    if (randomActive) randomEffect();
    if (breathActive) breathEffect();
    if (idkActive) idkEffect();

  }
  // END OF CONNECTION
  connected = false;
  Serial.println("Disconnected from Websocket");
  delay(1000);
}
