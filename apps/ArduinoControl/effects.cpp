#include "effects.h"
#include "led_control.h"
#include "config.h"

#define PI 3.14159265

void spiralEffect() {
  static uint8_t hue = 0;
  for (int y = 0; y < MATRIX_WIDTH; y++) {
    for (int x = 0; x < MATRIX_WIDTH; x++) {
      int index = y * MATRIX_WIDTH + x;
      uint8_t pixelHue = hue + (x * 10) + (y * 10);
      strip.setPixelColor(index, strip.ColorHSV(pixelHue * 256, 255, 255));
    }
  }
  strip.show();
  hue += 2;
  delay(50);
}

void waveEffect() {
  static float phase = 0;
  phase += 0.3;
  for (int x = 0; x < MATRIX_WIDTH; x++) {
    float sineValue = sin(x * 0.5 + phase);
    int y = (MATRIX_WIDTH / 2) + (sineValue * (MATRIX_WIDTH / 2));

    for (int row = 0; row < MATRIX_WIDTH; row++) {
      int index = row * MATRIX_WIDTH + x;
      if (row == y || row == y + 1) {
        uint8_t hue = ((int)(phase * 10) + x * 8) % 255;
        strip.setPixelColor(index, strip.ColorHSV(hue * 256, 255, 255));
      } else {
        strip.setPixelColor(index, strip.Color(0, 0, 0));
      }
    }
  }
  strip.show();
  delay(60);
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

void waterEffect() {
  static int frame = 0;
  static int centerX = random(MATRIX_WIDTH);
  static int centerY = random(MATRIX_WIDTH);
  static int maxRadius = MATRIX_WIDTH / 2;

  if (frame == 0) {
    centerX = random(MATRIX_WIDTH);
    centerY = random(MATRIX_WIDTH);
  }

  fillLED(0, 0, 255); // Fill with blue base

  for (int y = 0; y < MATRIX_WIDTH; y++) {
    for (int x = 0; x < MATRIX_WIDTH; x++) {
      int dx = x - centerX;
      int dy = y - centerY;
      float distance = sqrt(dx * dx + dy * dy);
      if (int(distance) == frame % maxRadius) {
        int index = y * MATRIX_WIDTH + x;
        strip.setPixelColor(index, strip.Color(255, 255, 255));
      }
    }
  }

  strip.show();
  frame++;
  if (frame >= maxRadius) {
    frame = 0;
  }
  delay(120);
}

void fireEffect() {
  for (int i = 0; i < (MATRIX_WIDTH * MATRIX_LENGTH); i++) {
    int flicker = random(128);
    strip.setPixelColor(i, strip.Color(255, flicker, 0));
  }
  strip.show();
  delay(50);
}
