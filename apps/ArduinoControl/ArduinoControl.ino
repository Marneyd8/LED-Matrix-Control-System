#include <WiFiHttpClient.h>
#include <WiFiWebServer.h>
#include <Adafruit_NeoPixel.h>
#include <ArduinoJson.h>
#include "config.h"
#include "font8x8_dict.h"

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
bool textActive = false;


// WEBSERVER CONTROL FUNCTIONS
void printWifiStatus()
{
  Serial.print(F("You're connected to the network, IP = "));
  Serial.println(WiFi.localIP());

  Serial.print(F("SSID: "));
  Serial.println(WiFi.SSID());
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

// TYPER CONTROL
#define MAX_TEXT_LENGTH 64
int globalSpeed;
int globalLength;
uint8_t globalTextmap[8][MAX_TEXT_LENGTH];

void generateText(const char* text, int speed, bool loop) {
  char newText[MAX_TEXT_LENGTH];  // Buffer for modified text
  strncpy(newText, text, MAX_TEXT_LENGTH - 2);  // Copy text safely
  newText[MAX_TEXT_LENGTH - 2] = '\0';  // Ensure null termination
  strcat(newText, " ");  // Append space

  int length = strlen(newText);
  uint8_t textmap[8][MAX_TEXT_LENGTH] = {0};
  
  for (int i = 0; i < length; i++) {
    char target = newText[i];
    const uint8_t* bitmap = nullptr;
    
    for (int j = 0; j < fontSize; j++) {
      if (font8x8[j].character == target) {
          bitmap = font8x8[j].bitmap;
          break;
      }
    }

    if (bitmap) {  // Only process valid characters
      for (int row = 0; row < 8; row++) {
          textmap[row][i] = bitmap[row];
      }
    }
  }

  if (loop) {
      textActive = true;
      globalSpeed = speed;
      globalLength = length;
      memcpy(globalTextmap, textmap, sizeof(textmap));  // Correct array copying
  } else {
      textActive = false;
      displayText(textmap, length, speed);
  }
}



void displayText(const uint8_t textmap[8][MAX_TEXT_LENGTH], int length, int speed) {
  int list[8][2] = {{-1, -1}, {-1, -1}, {-1, -1}, {-1, -1}, {-1, -1}, {-1, -1}, {-1, -1}, {-1, -1}};
  for (int i = 0; i < length; i++) {
    for (int j = 0; j < 8; j++) {
      int element[2] = {i, j};

      // Shift the list to the left
      for (int k = 0; k < 7; k++) {
          list[k][0] = list[k + 1][0];
          list[k][1] = list[k + 1][1];
      }
      list[7][0] = element[0];
      list[7][1] = element[1];

      // Update LEDs
      for (int k = 0; k < 8; k++) {
        int first = list[k][0];
        int second = list[k][1];
        if (first == -1) {
            // Turn off LED at (k, j)
            //updateLED(k, j, 0, 0, 0);
            continue;
        }
        for (int l = 0; l < 8; l++){
          if (((textmap[l][first] >> second) & 1) == 1) {  // Corrected bitwise condition
            updateLED(l, k, 255, 255, 255);
          } else {
            updateLED(l, k, 0, 0, 0);
          }
          strip.show();
        }
      }
    }
    delay(speed);
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
}

void fillLED(int r, int g, int b){
  for (int i = 0; i < MATRIX_WIDTH; i++){
    for (int j = 0; j < MATRIX_WIDTH; j++){
      int index = i * MATRIX_WIDTH + j;
      strip.setPixelColor(index, strip.Color(r, g, b));
    }
  }
  strip.show();
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
    if (textActive) displayText(globalTextmap, globalLength, globalSpeed);
  }
  // END OF CONNECTION
  connected = false;
  Serial.println("Disconnected from Websocket");
  delay(100);
}
