#ifndef LED_CONTROL_H
#define LED_CONTROL_H

#include <Adafruit_NeoPixel.h>
extern Adafruit_NeoPixel strip;

// Function to set up the LED strip
// Initializes the NeoPixel strip, configuring the number of LEDs, pin, and other settings.
void stripSetUp();

// Function to update the color of a specific LED
// Updates the LED at position (row, col) with the given RGB (r, g, b) values.
void updateLED(int row, int col, int r, int g, int b);

// Function to fill the entire LED strip with a single color
// This will set all LEDs to the same RGB (r, g, b) values.
void fillLED(int r, int g, int b);

#endif
