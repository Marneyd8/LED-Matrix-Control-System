#ifndef LED_CONTROL_H
#define LED_CONTROL_H

#include <Adafruit_NeoPixel.h>
extern Adafruit_NeoPixel strip;

void stripSetUp();
void updateLED(int row, int col, int r, int g, int b);
void fillLED(int r, int g, int b);

#endif
