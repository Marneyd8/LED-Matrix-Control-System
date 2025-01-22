#include <WiFiHttpClient.h>
#include <WiFiWebServer.h>

char ssid[] = "O2-Internet-923";
char pass[] = "D4fFpKAg"; 

// echo.websocket.org is not working anymore.Please use your local WS server
char serverAddress[] = "10.0.0.15";  // server address
int port = 80;

WiFiClient           client;
WiFiWebSocketClient  wsClient(client, serverAddress, port);

int count = 0;

void printWifiStatus()
{
  // print the SSID of the network you're attached to:
  // you're connected now, so print out the data
  Serial.print(F("You're connected to the network, IP = "));
  Serial.println(WiFi.localIP());

  Serial.print(F("SSID: "));
  Serial.print(WiFi.SSID());
}

void setup()
{
  Serial.begin(115200);

  Serial.print(F("Connecting to SSID: "));
  Serial.println(ssid);

  int status = WiFi.begin(ssid, pass);
  delay(1000);
  Serial.print(status);
  while ( status != WL_CONNECTED)
  {
    delay(500);
    status = WiFi.status();
  }

  printWifiStatus();
}

void loop()
{

  Serial.println("Starting WebSocket client");

  wsClient.begin();

  Serial.println("Is it alive?");

  while (wsClient.connected())
  {
    int messageSize = wsClient.parseMessage();
    if (messageSize > 0)
    {

      Serial.println("Received a message:");
      String msg = wsClient.readString();
      Serial.println(msg);

      Serial.println("Sending a message:" + msg);

      wsClient.beginMessage(TYPE_TEXT);
      wsClient.print("Thanks for message" + msg);
      wsClient.endMessage();
    }
  }

  Serial.println("disconnected");
  /* 
  static String data = " => Hello from SimpleWebSocket";

  Serial.println("Starting WebSocket client");

  wsClient.begin();

  Serial.println("Is it alive?");

  while (wsClient.connected())
  {
    Serial.print("Sending Hello ");
    Serial.println(count);

    // send a hello #
    wsClient.beginMessage(TYPE_TEXT);
    wsClient.print(count);

    wsClient.print(data);
    wsClient.print(millis());

    wsClient.endMessage();

    // increment count for next message
    count++;

    // check if a message is available to be received
    int messageSize = wsClient.parseMessage();

    if (messageSize > 0)
    {
      Serial.println("Received a message:");
      Serial.println(wsClient.readString());
    }

    // wait 5 seconds
    delay(5000);
  }

  Serial.println("disconnected");
  */
}