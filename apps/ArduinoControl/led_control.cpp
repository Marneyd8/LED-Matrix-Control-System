#include "led_control.h"
#include "config.h"

Adafruit_NeoPixel strip(MATRIX_WIDTH * MATRIX_WIDTH, DATA_PIN, NEO_GRB + NEO_KHZ800);

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
