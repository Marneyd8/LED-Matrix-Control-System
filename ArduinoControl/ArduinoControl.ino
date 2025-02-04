#include <WiFiHttpClient.h>
#include <WiFiWebServer.h>
#include <Adafruit_NeoPixel.h>
#include <ArduinoJson.h>


// LEDS
#define NUM_LEDS 64
#define DATA_PIN 6
#define MATRIX_WIDTH 8
Adafruit_NeoPixel strip(NUM_LEDS, DATA_PIN, NEO_GRB + NEO_KHZ800);


// WEBSERVER
char ssid[] = "O2-Internet-923";
char pass[] = "D4fFpKAg"; 
char serverAddress[] = "10.0.0.15";
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

void updateLED(int row, int col, int r, int g, int b) {
  int index = row * MATRIX_WIDTH + col; // Convert row & col to LED index
  strip.setPixelColor(index, strip.Color(r, g, b));
  strip.show();
}

void parseWebSocketMessage(String msg) {
  Serial.println("Parsing message: " + msg);

  StaticJsonDocument<200> json;
  deserializeJson(json, msg);

  int row = json["row"];
  int col = json["col"];
  String color = json["color"];

  int r, g, b;
  if (sscanf(color.c_str(), "rgb(%d, %d, %d)", &r, &g, &b) == 3) {
    updateLED(row, col, r, g, b);
  } else {
    Serial.println("Failed to parse RGB values");
  }
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

void stripSetUp(){
  strip.begin();  // Initialize the LED strip
  strip.show();   // Set all LEDs to off
  strip.setBrightness(25);
}

void setup()
{
  Serial.begin(115200);
  stripSetUp();
  connectToWifi();
  printWifiStatus();
}

void loop()
{
  Serial.println("Starting WebSocket client");
  wsClient.begin();
  
  
  while (wsClient.connected())
  {
    if (connected == 0){
      // FIRST message
      wsClient.beginMessage(TYPE_TEXT);
      wsClient.print("ARDUINO CONNECTED");
      wsClient.endMessage();
      connected = 1;
    }
    int messageSize = wsClient.parseMessage();
    if (messageSize > 0)
    {
      Serial.println("Received a message:");
      String msg = wsClient.readString();
      Serial.println("Received: " + msg);
      
      parseWebSocketMessage(msg);

      wsClient.beginMessage(TYPE_TEXT);
      wsClient.print("Acknowledged: " + msg);
      wsClient.endMessage();
      
    }
  }
  // END OF CONNECTION
  connected = 0;
  Serial.println("Disconnected from Websocket");
  delay(1000);
}
