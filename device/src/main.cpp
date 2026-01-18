#include <FastLED.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// --- KONFIGURÁCIA HARDVÉRU [cite: 96, 128] ---
#define LED_PIN     16      // GPIO 16 (Dátový pin)
#define NUM_LEDS    9       // Počet LED (uprav podľa reality)
#define LED_TYPE    WS2812B
#define COLOR_ORDER GRB

// --- BLE UUIDs ---
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

CRGB leds[NUM_LEDS];
BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;
char currentCommand = '0'; // Default: IDLE

// --- LOGIKA STAVOV (State Machine) [cite: 44] ---
enum State { BOOT, IDLE, CONNECTED, SOS_MODE, SYNC_MODE };
State currentState = BOOT;

// --- CALLBACKY PRE BLUETOOTH ---
class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      currentState = CONNECTED;
      Serial.println("Device Connected");
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      currentState = IDLE;
      Serial.println("Device Disconnected");
      // Reštart advertisingu, aby sa dalo znova pripojiť
      pServer->getAdvertising()->start(); 
    }
};

class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string value = pCharacteristic->getValue();
      if (value.length() > 0) {
        currentCommand = value[0]; // Čítame prvý znak príkazu
        Serial.print("New Command: ");
        Serial.println(currentCommand);

        // Prepínanie stavov na základe príkazu
        if (currentCommand == 'S') currentState = SOS_MODE;
        else if (currentCommand == 'C') currentState = CONNECTED;
        else if (currentCommand == '1') currentState = SYNC_MODE; // Manuálna farba
        else currentState = IDLE;
      }
    }
};

void setup() {
  Serial.begin(115200);

  // 1. POWER MANAGEMENT [cite: 91]
  FastLED.setMaxPowerInVoltsAndMilliamps(5, 800); 
  FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(100);

  // 2. BLE INITIALIZATION
  BLEDevice::init("FestiBuddy_Node"); // Názov zariadenia
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
  
  Serial.println("Waiting for client connection...");
  
  // Vizuálna signalizácia BOOT  (Modrá bodka)
  fill_solid(leds, NUM_LEDS, CRGB::Black);
  leds[0] = CRGB::Blue;
  FastLED.show();
  delay(1000);
  currentState = IDLE;
}

void loop() {
  // --- STATE MACHINE LOGIC [cite: 44] ---
  switch (currentState) {
    case IDLE:
      // Šetrenie energie, vypnuté LED alebo jemné dýchanie
      fadeToBlackBy(leds, NUM_LEDS, 10);
      break;

    case CONNECTED:
      // 2x Zelené bliknutie na potvrdenie 
      // (Zjednodušená verzia: svieti na zeleno)
      fill_solid(leds, NUM_LEDS, CRGB::Green);
      break;

    case SOS_MODE:
      // Červený stroboskop (10Hz) 
      fill_solid(leds, NUM_LEDS, CRGB::Red);
      FastLED.show();
      delay(50);
      fill_solid(leds, NUM_LEDS, CRGB::Black);
      FastLED.show();
      delay(50);
      return; // Skip finálny FastLED.show() aby sme nemenili časovanie

    case SYNC_MODE:
      // Napr. Modrá farba pre organizátora
      fill_solid(leds, NUM_LEDS, CRGB::Blue);
      break;
  }

  FastLED.show();
  delay(30); // 30ms = cca 33 FPS
}