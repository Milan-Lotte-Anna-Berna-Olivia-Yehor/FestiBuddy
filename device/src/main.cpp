#include <Arduino.h>
#include <FastLED.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <WiFi.h>
#include <WiFiUdp.h>

// --- KONFIGURÁCIA ---
#define LED_PIN     16
#define NUM_LEDS    9       
#define LED_TYPE    WS2812B
#define COLOR_ORDER GRB
#define BOOT_BUTTON 0       

// --- WIFI & UDP (ORGANIZATOR) ---
#define ST_SSID     "MS_iPhone"
#define ST_PASS     "minkominko0"
#define UDP_PORT    21324

// --- BLE (USER) ---
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

CRGB leds[NUM_LEDS];
WiFiUDP Udp;
BLECharacteristic *pCharacteristic;
bool deviceConnected = false;

// Časovače
unsigned long buttonPressTime = 0; 
unsigned long lastAnimUpdate = 0;
unsigned long lastWifiCheck = 0;
uint8_t rainbowHue = 0;

// Buffer pre prijaté UDP dáta
char packetBuffer[255]; 

enum Mode {
  IDLE,
  SOS_MODE,         // Priorita 1 (User Critical)
  CONNECTED_FLASH,  // Priorita 2 (User Feedback)
  RAINBOW_TEST,     // Priorita 3 (User Action)
  SYNC_MODE         // Priorita 4 (Organizer Action)
};

volatile Mode currentMode = IDLE; 
CRGB syncColor = CRGB::Black; // Farba prijatá od organizátora

// --- BLE CALLBACKY ---
class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) { deviceConnected = true; };
    void onDisconnect(BLEServer* pServer) { 
      deviceConnected = false; 
      pServer->getAdvertising()->start(); 
    }
};

class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string value = pCharacteristic->getValue();
      if (value.length() > 0) {
        char cmd = value[0];
        switch (cmd) {
          case 'S': currentMode = SOS_MODE; break;
          case '0': 
            currentMode = IDLE; 
            FastLED.clear(); FastLED.show(); 
            break;
          case 'C': currentMode = CONNECTED_FLASH; lastAnimUpdate = 0; break;
          case 'T': 
          case '1': currentMode = RAINBOW_TEST; break;
        }
      }
    }
};

void setup() {
  Serial.begin(115200);
  pinMode(BOOT_BUTTON, INPUT_PULLUP);

  // LED Setup
  FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(100);
  FastLED.setMaxPowerInVoltsAndMilliamps(5, 800);

  // BLE Setup
  BLEDevice::init("FestiBuddy_Node");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());
  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY
                    );
  pCharacteristic->setCallbacks(new MyCallbacks());
  pCharacteristic->addDescriptor(new BLE2902());
  pService->start();
  BLEDevice::startAdvertising();

  // WiFi Setup (Non-blocking start)
  WiFi.mode(WIFI_STA);
  WiFi.begin(ST_SSID, ST_PASS);
  Serial.println("Connecting to WiFi...");
}

void loop() {
  unsigned long now = millis();

  // 1. WIFI RECONNECT & UDP START LOGIKA
  if (now - lastWifiCheck > 5000) {
    lastWifiCheck = now;
    if (WiFi.status() == WL_CONNECTED) {
       // Ak sme pripojení, uistíme sa, že UDP beží
       static bool udpStarted = false;
       if (!udpStarted) {
         Udp.begin(UDP_PORT);
         udpStarted = true;
         Serial.print("WiFi Connected! IP: ");
         Serial.println(WiFi.localIP());
         Serial.print("Listening on UDP: ");
         Serial.println(UDP_PORT);
         
         // Zelené bliknutie ako signál, že sme online
         currentMode = CONNECTED_FLASH;
       }
    } else {
       Serial.println("WiFi attempting reconnect...");
       // WiFi.reconnect() sa deje automaticky na pozadí, len logujeme
    }
  }

  // 2. UDP PARSING (ORGANIZER COMMANDS)
  // Spracujeme len ak nie je SOS (Safety First!)
  if (currentMode != SOS_MODE && currentMode != CONNECTED_FLASH) {
    int packetSize = Udp.parsePacket();
    if (packetSize) {
      int len = Udp.read(packetBuffer, 255);
      if (len >= 3) {
        // Očakávame formát: [R] [G] [B] (3 bajty)
        uint8_t r = packetBuffer[0];
        uint8_t g = packetBuffer[1];
        uint8_t b = packetBuffer[2];
        
        syncColor = CRGB(r, g, b);
        currentMode = SYNC_MODE;
        
        Serial.printf("UDP Color: R%d G%d B%d\n", r, g, b);
      }
    }
  }

  // 3. HARDWARE RESET
  if (digitalRead(BOOT_BUTTON) == LOW) {
    if (buttonPressTime == 0) buttonPressTime = now;
    if (now - buttonPressTime > 3000) {
      fill_solid(leds, NUM_LEDS, CRGB::Blue); FastLED.show();
      delay(500); ESP.restart();
    }
  } else {
    buttonPressTime = 0;
  }

  // 4. ANIMÁCIE
  if (currentMode == SOS_MODE) {
    if (now - lastAnimUpdate > 50) { 
      lastAnimUpdate = now;
      static bool s = false; s = !s;
      fill_solid(leds, NUM_LEDS, s ? CRGB::Red : CRGB::Black);
      FastLED.show();
    }
  }
  else if (currentMode == SYNC_MODE) {
    // Svieti farbou, ktorú poslal organizátor
    // Obnovujeme pravidelne, aby FastLED držal farbu
    if (now - lastAnimUpdate > 100) {
        lastAnimUpdate = now;
        fill_solid(leds, NUM_LEDS, syncColor);
        FastLED.show();
    }
  }
  else if (currentMode == RAINBOW_TEST) {
    if (now - lastAnimUpdate > 20) {
      lastAnimUpdate = now;
      fill_rainbow(leds, NUM_LEDS, rainbowHue++, 7);
      FastLED.show();
    }
  }
  else if (currentMode == CONNECTED_FLASH) {
    static int flashStep = 0;
    if (now - lastAnimUpdate > 200) {
       lastAnimUpdate = now;
       flashStep++;
       if (flashStep % 2 == 1) fill_solid(leds, NUM_LEDS, CRGB::Green);
       else fill_solid(leds, NUM_LEDS, CRGB::Black);
       FastLED.show();
       if (flashStep >= 6) { currentMode = IDLE; flashStep = 0; }
    }
  }
  else {
    // IDLE
    if (now - lastAnimUpdate > 100) {
      lastAnimUpdate = now;
      fadeToBlackBy(leds, NUM_LEDS, 20);
      FastLED.show();
    }
  }
}