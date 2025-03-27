#include "effects.h"
#include "led_control.h"
#include "config.h"

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
