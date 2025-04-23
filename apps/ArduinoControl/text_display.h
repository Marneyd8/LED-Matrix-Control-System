#ifndef TEXT_DISPLAY_H
#define TEXT_DISPLAY_H

#include <stdint.h>

#define MAX_TEXT_LENGTH 64

extern uint8_t globalTextmap[8][MAX_TEXT_LENGTH];
extern int globalSpeed;
extern int globalLength;
extern bool textActive;

// Function to generate the pixel map for the given text
// Converts the input text to an 8xMAX_TEXT_LENGTH array representation for display.
// text: The string to display.
// speed: The speed at which the text should scroll or display.
// loop: Whether the text should loop after displaying.
void generateText(const char* text, int speed, bool loop);

// Function to display the generated text map on the display
// This function takes the pixel representation of the text and displays it.
// textmap: The 8xMAX_TEXT_LENGTH array holding the pixel data for the text.
// length: The length of the text to display.
// speed: The speed at which the text should be displayed.
void displayText(const uint8_t textmap[8][MAX_TEXT_LENGTH], int length, int speed);

#endif
