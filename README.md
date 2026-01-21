# FestiBuddy 🎸✨

**FestiBuddy** is an all-in-one companion app designed to revolutionize your festival experience. By combining a powerful multicross-platform mobile application with a custom smart IoT bracelet, FestiBuddy ensures you never miss a beat, find your way around easily, and stay safe in the crowd.

---

## 🌟 Key Features

### 📅 Smart Lineup & Live Stages

* **Real-time Updates**: View currently performing artists across all festival stages.
* **Personal Favorites**: "Like" your favorite performances to build your own schedule.
* **Upcoming Events**: Browse a curated list of future festivals and events.

### 🗺️ Interactive Festival Map

* **Live POIs**: Locate stages, chill zones, lockers, and restrooms with ease.
* **Navigation**: Get direct visual routes from your current location to any Point of Interest.
* **Zoomable View**: High-detail SVG-based map with smooth zoom and pan controls.

### 🚨 Safety First (SOS System)

* **Emergency Signal**: Trigger a high-intensity red strobe on your wristband during emergencies.
* **Haptic Feedback**: The app provides tactile confirmation when the SOS signal is active.
* **One-Touch Stop**: Deactivate the signal immediately once help arrives.

### 🤖 AI Festival Assistant

* **Smart Chatbot**: Ask "Festival Buddy" about pairing, stage locations, or safety info.
* **Quick Questions**: One-tap chips for common queries like "Where is the WC?" or "SOS Help".

### ⌚ Smart Wristband Integration

* **BLE Pairing**: Seamlessly connect your phone to your ESP32-powered wristband.
* **Organizer Sync**: Through UDP broadcasting, festival organizers can synchronize all wristband colors for a massive light show during headliner sets.
* **Hardware Powered by FastLED**: High-performance animations and color management.

---

## 🛠️ Tech Stack

### Mobile Application

* **Framework**: Expo / React Native
* **Language**: TypeScript
* **State Management**: React Hooks & AsyncStorage
* **Navigation**: Expo Router (File-based)
* **Backend**: Firebase
* **Connectivity**: `react-native-ble-plx` (Bluetooth) & `react-native-udp`

### Hardware (Smart Wristband)

* **Microcontroller**: ESP32
* **Framework**: Arduino / PlatformIO
* **Libraries**: FastLED for WS2812B LED control.

---

## 🚀 Getting Started

### 1. Mobile App Setup

1. **Install dependencies**:
```bash
npm install

```


2. **Start the app**:
```bash
npx expo start

```


*Open the app via Expo Go (iOS/Android) or a development build.*

### 2. Hardware Setup

1. Open the `device/` directory in **VS Code** with the **PlatformIO** extension installed.
2. Connect your **ESP32** via USB.
3. Modify the `ST_SSID` and `ST_PASS` in `device/src/main.cpp` to match your local WiFi for UDP synchronization testing.
4. **Upload** the code to your device.

---

## 📂 Project Structure

* `/app`: The main React Native application source code (routing and screens).
* `/assets`: App icons, logos, and festival map images.
* `/components`: Reusable UI elements like buttons and headers.
* `/constants`: Data for artists, events, and chatbot responses.
* `/device`: ESP32 firmware and PlatformIO configuration.
* `/services`: BLE and UDP communication logic.

---

## 🛡️ Permissions

The app requires the following permissions for full functionality:

* **Bluetooth**: For pairing and controlling your wristband.
* **Location**: Necessary for Bluetooth scanning (Android requirement).
* **Internet**: For real-time updates and synchronization.

---

Developed with ❤️ for the festival community.
