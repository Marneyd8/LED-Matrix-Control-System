#include "config.h"
#include "led_control.h"
#include "effects.h"
#include "text_display.h"
#include "websocket_handler.h"
// CONTROL VARIABLES

void setup()
{
  Serial.begin(115200);
  connectToWifi();
  printWifiStatus();
  stripSetUp();
}

void loop()
{
  start();
}
