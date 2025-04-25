#include "effects.h"
#include "led_control.h"
#include "config.h"
#include <math.h>

void spiralEffect() {
  strip.clear();
  static uint8_t hue = 0;
  float centerX = MATRIX_WIDTH / 2.0;
  float centerY = MATRIX_WIDTH / 2.0;
  float swirlFactor = 0.15;

  for (int y = 0; y < MATRIX_WIDTH; y++) {
    for (int x = 0; x < MATRIX_WIDTH; x++) {
      float dx = x - centerX;
      float dy = y - centerY;
      float distance = sqrt(dx * dx + dy * dy);
      float angle = atan2(dy, dx);

      uint8_t pixelHue = hue + (uint8_t)(distance * 15) + (uint8_t)(angle * swirlFactor * 180 / 3.14159265);

      uint32_t rgbColor = strip.ColorHSV(pixelHue * 256, 255, 255);
      uint8_t r = (rgbColor >> 16) & 0xFF;
      uint8_t g = (rgbColor >> 8) & 0xFF;
      uint8_t b = rgbColor & 0xFF;

      updateLED(x, y, r, g, b);
    }
  }
  strip.show();
  hue += 2;
  delay(50);
}

float phase = 0.0;
void waveEffect() {
  strip.clear();
  float frequency = 0.2;
  for (int x = 0; x < MATRIX_WIDTH; x++) {
    float amplitude = (float)MATRIX_WIDTH / 2.0 - 1;
    float waveY = amplitude * sin(frequency * x + phase) + (float)MATRIX_WIDTH / 2.0;
    int waveTop = round(waveY);
    if (waveTop >= 0 && waveTop < MATRIX_WIDTH) {
      for (int y = 0; y <= waveTop; y++) {
        float brightness = map(y, 0, waveTop, 50, 255);
        brightness = constrain(brightness, 0, 255);
        int red = brightness;
        int green = 0;
        int blue = 255 - brightness;

        updateLED(x, y, red, green, blue);
      }
    }
  }

  phase += 0.05;
  strip.show();
}


void randomEffect() {
  strip.clear();
  for (int y = 0; y < MATRIX_WIDTH; y += 2) {
    for (int x = 0; x < MATRIX_WIDTH; x += 2) {
      int r = random(256);
      int g = random(256);
      int b = random(256);

      for (int dy = 0; dy < 2; dy++) {
        for (int dx = 0; dx < 2; dx++) {
          int px = x + dx;
          int py = y + dy;
          if (px < MATRIX_WIDTH && py < MATRIX_WIDTH) {
            updateLED(px, py, r, g, b);
          }
        }
      }
    }
  }

  strip.show();
  delay(500);
}

void waterEffect() {
  strip.clear();
  static int frame = 0;
  static int centerX = random(MATRIX_WIDTH);
  static int centerY = random(MATRIX_WIDTH);
  static int maxRadius = MATRIX_WIDTH / 2;

  if (frame == 0) {
    centerX = random(MATRIX_WIDTH);
    centerY = random(MATRIX_WIDTH);
  }

  fillLED(40, 40, 255); // lighter blue

  for (int y = 0; y < MATRIX_WIDTH; y++) {
    for (int x = 0; x < MATRIX_WIDTH; x++) {
      int dx = x - centerX;
      int dy = y - centerY;
      float distance = sqrt(dx * dx + dy * dy);
      if (int(distance) == frame % maxRadius) {
        updateLED(x, y, 255, 255, 255);
      }
    }
  }

  strip.show();
  frame++;
  if (frame >= maxRadius) {
    frame = 0;
  }
  delay(110);
}

void fireEffect() {
  strip.clear();

  for (int y = 0; y < MATRIX_WIDTH; y++) {
    for (int x = 0; x < MATRIX_WIDTH; x++) {
      int flicker = random(100, 255 - y * 10); // fade upward
      int r = 255;
      int g = min(flicker, 180);
      int b = random(5); // slight blue tint occasionally

      if (random(100) < 5 && y > 1) {
        // Spark effect
        r = 255;
        g = 255;
        b = 100;
      }
      updateLED(x, y, r, g, b);
    }
  }

  strip.show();
  delay(40);
}

