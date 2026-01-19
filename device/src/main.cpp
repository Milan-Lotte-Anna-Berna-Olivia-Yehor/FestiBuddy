#include <FastLED.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// --- KONFIGURÁCIA HARDVÉRU ---
#define LED_PIN     16      // GPIO 16 (Dátový pin) [cite: 96]
#define BUTTON_PIN  0       // GPIO 0 (BOOT Tlačidlo) [cite: 96]
#define NUM_LEDS    9      // Počet LED
#define LED_TYPE    WS2812B
#define COLOR_ORDER GRB

// --- BLE UUIDs ---
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

CRGB leds[NUM_LEDS];
BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;
char currentCommand = '0'; // 0 = IDLE

// --- Callbacky ---
class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("Zariadenie pripojené");
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("Zariadenie odpojené");
      // Okamžitý reštart advertisingu
      pServer->getAdvertising()->start(); 
    }
};

class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string value = pCharacteristic->getValue();
      if (value.length() > 0) {
        currentCommand = value[0];
        Serial.print("Nový príkaz: ");
        Serial.println(currentCommand);
      }
    }
};

void setup() {
  Serial.begin(115200);

  // 1. SETUP TLAČIDLA
  pinMode(BUTTON_PIN, INPUT_PULLUP); // Dôležité: GPIO 0 je v kľude HIGH

  // 2. LED SETUP
  FastLED.setMaxPowerInVoltsAndMilliamps(5, 800); 
  FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(100);

  // 3. BLE SETUP
  BLEDevice::init("FestiBuddy_Node");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_WRITE  |
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  pCharacteristic->setCallbacks(new MyCallbacks());
  pCharacteristic->addDescriptor(new BLE2902());

  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0); 
  BLEDevice::startAdvertising();
  
  Serial.println("FestiBuddy Ready...");
  
  // Vizuálny test (Modrá bodka)
  fill_solid(leds, NUM_LEDS, CRGB::Black);
  leds[0] = CRGB::Blue;
  FastLED.show();
  delay(1000);
}

void loop() {
  // --- 1. KONTROLA TLAČIDLA (RESET LOGIKA) ---
  if (digitalRead(BUTTON_PIN) == LOW) { // Tlačidlo stlačené
    delay(50); // Debounce
    unsigned long pressStart = millis();
    
    // Čakáme, kým ho držíš
    while (digitalRead(BUTTON_PIN) == LOW) {
      // Ak držíš dlhšie ako 3 sekundy
      if (millis() - pressStart > 3000) {
        Serial.println("!!! HARD RESET SPOJENIA !!!");
        
        // Vizuálna odozva (Rýchle modré prebliknutie)
        for(int i=0; i<3; i++) {
          fill_solid(leds, NUM_LEDS, CRGB::Blue);
          FastLED.show();
          delay(100);
          fill_solid(leds, NUM_LEDS, CRGB::Black);
          FastLED.show();
          delay(100);
        }

        // RESET BLE
        if (deviceConnected) {
            // Násilné odpojenie (číslo je client ID, 0 väčšinou funguje na všetkých)
            pServer->disconnect(0); 
        }
        
        currentCommand = '0'; // Reset stavu na IDLE
        
        // Čakáme kým pustíš tlačidlo, aby sa to neopakovalo
        while(digitalRead(BUTTON_PIN) == LOW) delay(10);
        break; 
      }
    }
  }

  // --- 2. LOGIKA LEDIEK ---
  if (currentCommand == 'S') { 
    // SOS - Červený stroboskop
    fill_solid(leds, NUM_LEDS, CRGB::Red);
    FastLED.show();
    delay(50);
    fill_solid(leds, NUM_LEDS, CRGB::Black);
    FastLED.show();
    delay(50);
  } 
  else if (currentCommand == 'C') {
    // CONNECTED - Zelená
    fill_solid(leds, NUM_LEDS, CRGB::Green);
    FastLED.show();
  }
  else if (currentCommand == '1') {
    // MANUÁL - Modrá
    fill_solid(leds, NUM_LEDS, CRGB::Blue);
    FastLED.show();
  }
  else if (currentCommand == '0') {
    // IDLE - Zhasnuté / Fade out
    fadeToBlackBy(leds, NUM_LEDS, 5);
    FastLED.show();
    delay(20);
  }
}