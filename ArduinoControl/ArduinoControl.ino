#include <WiFiHttpClient.h>
#include <WiFiWebServer.h>
#include <Adafruit_NeoPixel.h>


// LEDS
#define NUM_LEDS 64
#define DATA_PIN 6
Adafruit_NeoPixel strip(NUM_LEDS, DATA_PIN, NEO_GRB + NEO_KHZ800);


// WEBSERVER
char ssid[] = "O2-Internet-923";
char pass[] = "D4fFpKAg"; 
char serverAddress[] = "10.0.0.15";
int port = 80;
WiFiClient client;
WiFiWebSocketClient wsClient(client, serverAddress, port);

void printWifiStatus()
{
  Serial.print(F("You're connected to the network, IP = "));
  Serial.println(WiFi.localIP());

  Serial.print(F("SSID: "));
  Serial.println(WiFi.SSID());
}

void changeLEDS()
{
  /**
  for(int dot = 0; dot < NUM_LEDS; dot++) {
        strip.clear();  // Clear previous LED states
        strip.setPixelColor(dot, strip.Color(0, 0, 255));  // Set LED to blue
        strip.show();  // Update the LED strip
        delay(30);  // Delay for effect
    }
    **/
}

void setup()
{
  Serial.begin(115200);
  strip.begin();  // Initialize the LED strip
  strip.show();   // Set all LEDs to off

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

  // conection finished
  printWifiStatus();
}

void loop()
{
  Serial.println("Starting WebSocket client");
  wsClient.begin();

  while (wsClient.connected())
  {
    Serial.println("Im alive");
    // IF WE GET MESSAGE = PARSE
    int messageSize = wsClient.parseMessage();
    if (messageSize > 0)
    {
      Serial.println("Received a message:");
      String msg = wsClient.readString();
      Serial.println(msg);
      
      changeLEDS();

      Serial.println("Sending a message:" + msg);
      wsClient.beginMessage(TYPE_TEXT);
      wsClient.print("Thanks for message" + msg);
      wsClient.endMessage();
      
    }
  }

  Serial.println("Disconnected from Websocket");
}
