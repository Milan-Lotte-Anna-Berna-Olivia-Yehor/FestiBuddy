#include <FastLED.h>

// Definícia pinov podľa tvojej dokumentácie
#define LED_PIN     16      // GPIO 16 s 330 ohm rezistorom [cite: 96, 99]
#define NUM_LEDS    9      // Sem zadaj reálny počet LEDiek na tvojom náramku
#define LED_TYPE    WS2812B // Typ tvojho LED pásika [cite: 107, 128]
#define COLOR_ORDER GRB

CRGB leds[NUM_LEDS];

void setup() {
    // Inicializácia sériovej linky pre debugovanie
    Serial.begin(115200);

    // KĽÚČOVÝ KROK PRE BEZPEČNOSŤ:
    // Nastavenie limitu 5V a 800mA chráni Schottkyho diódu pred prehriatím.
    FastLED.setMaxPowerInVoltsAndMilliamps(5, 800); 

    // Pridanie LED pásika do knižnice
    FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS)
           .setCorrection(TypicalLEDStrip);
    
    // Nastavenie celkového jasu (nižšia hodnota je bezpečnejšia pre test)
    FastLED.setBrightness(50); 

    Serial.println("Festival Buddy: Safe LED Test startuje...");
}

void loop() {
    // Jednoduchá rotujúca dúha - vizuálna kontrola, že všetky pixely fungujú
    static uint8_t startIndex = 0;
    startIndex = startIndex + 1; 

    fill_rainbow(leds, NUM_LEDS, startIndex, 8);
    
    // Zobrazenie na pásiku
    FastLED.show();
    
    // Rýchlosť animácie
    delay(20);
}