#ifndef TEXT_DISPLAY_H
#define TEXT_DISPLAY_H

#include <stdint.h>

#define MAX_TEXT_LENGTH 64

extern uint8_t globalTextmap[8][MAX_TEXT_LENGTH];
extern int globalSpeed;
extern int globalLength;
extern bool textActive;

void generateText(const char* text, int speed, bool loop);
void displayText(const uint8_t textmap[8][MAX_TEXT_LENGTH], int length, int speed);

#endif
