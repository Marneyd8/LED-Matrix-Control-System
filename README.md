# Project Setup
This will help you configure the needed files and run both the Frontend and Backend of the application, as well as Arduino code.

## Configuration Files
Create configuration files from .example
### .env (Environment Variables)
- VITE_SERVERADDRESS &rarr; Your WIFI adress (you can find IPv4 Address value by using ipconfig in cmd) 
- VITE_SERVERPORT &rarr; Your network port (most likely 80 = default network port for webservers using HTTP)

### config.h (Hardware Configuration in ArduinoControl folder)
- WIFI_SSID &rarr; Your WiFi network name.
- WIFI_PASS &rarr; Your WiFi password.
- SERVER_ADDRESS &rarr; Your WIFI adress (you can find IPv4 Address value by using ipconfig in cmd) 
- SERVER_PORT &rarr; Your network port (most likely 80 = default network port for webservers using HTTP)
- DATA_PIN &rarr; Pin, where your arduino has its board connected
- MATRIX_WIDTH &rarr; Number of LEDs on one side

## Frontend
To start the frontend application in development mode:
```{bash}
npm run dev
```
This will launch the frontend, and it should be accessible in your browser at the specified local address.

## Backend
The backend is written in TypeScript, and it needs to be compiled before running.

### Compile the TypeScript file:

Use the following command to compile the backend's main server file (server.ts):

```{bash}
npx tsc ./src/server.ts
```

### Run the server:

After compiling, you can run the backend using Node.js:

```{bash}
node ./src/server.js
```

The server will start, and the backend should be accessible to create websocket connections as specified in your configuration.

## Arduino

Start your Arduino IDE and download necessary libraries needed to run the program, after verifying, upload the code into your Arduino board.
