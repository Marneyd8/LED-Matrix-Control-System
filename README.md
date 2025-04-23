# Project Description
This project is a **real-time LED matrix control system** that uses **WebSocket** communication to control an array of **RGB LEDs** on an **Arduino-based LED matrix**. The system allows users to interact with the matrix through a **React-based frontend**, a **TypeScript backend**, and an **Arduino controller** that manages the hardware.

## Components:
1. **Frontend**: The frontend is a web application written in React.js and Vite. where users can select colors, trigger effects, and control the brightness of the LED matrix. The frontend communicates with the backend via WebSockets to send commands for the Arduino.

2. **Backend**: The backend uses TypeScript, Node.js, WebSocket library and manages WebSocket communication, acting as a bridge between the frontend and the Arduino. It receives commands from the frontend, processes them, and forwards them to the Arduino via WebSocket or other way around.

3. **Arduino**: The Arduino controls the physical LED matrix using C/C++ with the Adafruit NeoPixel library and WiFiWebServer + WiFiHttpClient for network communication. It is programmed to handle incoming WebSocket messages from the backend and update the LED matrix accordingly, and send confirmation messages with other data to frontend.

---

# Project Setup
This guide will help you configure the necessary files and run both the **Frontend** and **Backend** applications, as well as the **Arduino code**.

## Frontend
The frontend is a React application and can be started using npm.
```{bash}
npm install
npm run frontend
```
This will launch the frontend, and it should be accessible in your browser at the specified local address.

## Backend
The backend is written in TypeScript, and it needs to be compiled before running.
```{bash}
npm run server
```
The server will start, and the backend should be accessible to create websocket connections.

## Arduino

### Create config.h (Hardware Configuration in ./apps/ArduinoControl folder copying config.example.h)
- WIFI_SSID &rarr; Your WiFi network name.
- WIFI_PASS &rarr; Your WiFi password.
- SERVER_ADDRESS &rarr; Your WIFI adress (you can find IPv4 Address listed after starting WebSocket server) 
- DATA_PIN &rarr; Pin, where your Arduino has its LED Matrix connected
- MATRIX_WIDTH &rarr; Number of LEDs in Matrix's width
- MATRIX_LENGTH &rarr; Number of LEDs in Matrix's length

After this:

1. Open the Arduino IDE.
2. Install necessary libraries (Adafruit NeoPixel, WiFiHttpClient, ArduinoJson etc.) required for the project.
3. Verify the hardware configuration:
   - Ensure the correct Arduino board is selected.
   - Make sure the correct port is set.
4. Upload the code from the `ArduinoControl` directory to your Arduino.

Once the code is uploaded, the Arduino will:
- Connect to your WiFi network using the credentials in `config.h`.
- Establish a WebSocket connection to the backend server using the provided server address.
- Start controlling the LED matrix according to the messages received from the backend.


