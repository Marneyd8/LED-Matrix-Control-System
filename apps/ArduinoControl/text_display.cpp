#include "text_display.h"
#include "font8x8_dict.h"
#include "led_control.h"

#define MAX_TEXT_LENGTH 64
int globalSpeed;
int globalLength;
uint8_t globalTextmap[8][MAX_TEXT_LENGTH];

void generateText(const char* text, int speed, bool loop) {
  char newText[MAX_TEXT_LENGTH];  // Buffer for modified text
  strncpy(newText, text, MAX_TEXT_LENGTH - 2);  // Copy text safely
  newText[MAX_TEXT_LENGTH - 2] = '\0';  // Ensure null termination
  strcat(newText, " ");  // Append space

  int length = strlen(newText);
  uint8_t textmap[8][MAX_TEXT_LENGTH] = {0};
  
  for (int i = 0; i < length; i++) {
    char target = newText[i];
    const uint8_t* bitmap = nullptr;
    
    for (int j = 0; j < fontSize; j++) {
      if (font8x8[j].character == target) {
          bitmap = font8x8[j].bitmap;
          break;
      }
    }

    if (bitmap) {  // Only process valid characters
      for (int row = 0; row < 8; row++) {
          textmap[row][i] = bitmap[row];
      }
    }
  }

  if (loop) {
      textActive = true;
      globalSpeed = speed;
      globalLength = length;
      memcpy(globalTextmap, textmap, sizeof(textmap));  // Correct array copying
  } else {
      textActive = false;
      displayText(textmap, length, speed);
  }
}



void displayText(const uint8_t textmap[8][MAX_TEXT_LENGTH], int length, int speed) {
  int list[8][2] = {{-1, -1}, {-1, -1}, {-1, -1}, {-1, -1}, {-1, -1}, {-1, -1}, {-1, -1}, {-1, -1}};
  for (int i = 0; i < length; i++) {
    for (int j = 0; j < 8; j++) {
      int element[2] = {i, j};

      // Shift the list to the left
      for (int k = 0; k < 7; k++) {
          list[k][0] = list[k + 1][0];
          list[k][1] = list[k + 1][1];
      }
      list[7][0] = element[0];
      list[7][1] = element[1];

      // Update LEDs
      for (int k = 0; k < 8; k++) {
        int first = list[k][0];
        int second = list[k][1];
        if (first == -1) {
            // Turn off LED at (k, j)
            //updateLED(k, j, 0, 0, 0);
            continue;
        }
        for (int l = 0; l < 8; l++){
          if (((textmap[l][first] >> second) & 1) == 1) {  // Corrected bitwise condition
            updateLED(l, k, 255, 255, 255);
          } else {
            updateLED(l, k, 0, 0, 0);
          }
          strip.show();
        }
      }
    }
    delay(speed);
  }
}
