# Project Setup
This will help you configure the needed files and run both the Frontend and Backend of the application, as well as Arduino code.

## Configuration Files
Create configuration files from .example
### .env (Environment Variables in ./apps/Frontend folder)
- VITE_SERVERADDRESS &rarr; Your WIFI adress (you can find IPv4 Address value by using ipconfig in cmd) 

### config.h (Hardware Configuration in ./apps/ArduinoControl folder)
- WIFI_SSID &rarr; Your WiFi network name.
- WIFI_PASS &rarr; Your WiFi password.
- SERVER_ADDRESS &rarr; Your WIFI adress (you can find IPv4 Address value by using ipconfig in cmd) 
- DATA_PIN &rarr; Pin, where your arduino has its board connected
- MATRIX_WIDTH &rarr; Number of LEDs in Matrix's width
- MATRIX_LENGTH &rarr; Number of LEDs in Matrix's length

## Frontend
To start the frontend application:
```{bash}
npm run frontend
```
This will launch the frontend, and it should be accessible in your browser at the specified local address.

## Backend
The backend is written in TypeScript, and it needs to be compiled before running.
```{bash}
npm run server
```
The server will start, and the backend should be accessible to create websocket connections as specified in your configuration.

## Arduino
Start your Arduino IDE and download necessary libraries needed to run the program, after verifying, upload the code into your Arduino board.
