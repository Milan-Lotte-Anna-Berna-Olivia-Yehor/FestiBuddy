import { Buffer } from 'buffer';
import dgram from 'react-native-udp';

// Singleton pattern - jedna inštancia pre celú appku
class UDPService {
  private socket: any = null;
  private readonly PORT = 21324; // Musí sedieť s ESP32
  private readonly HOST = "255.255.255.255"; // Broadcast

  // Inicializácia socketu
  init() {
    if (this.socket) return;
    
    try {
      this.socket = dgram.createSocket('udp4');
      this.socket.bind(this.PORT); // Bind, aby sme mohli aj počúvať (ak treba)
      console.log("[UDP Service] Socket initialized");
    } catch (e) {
      console.error("[UDP Service] Init Failed:", e);
    }
  }

  // Odoslanie farby [R, G, B]
  broadcastColor(r: number, g: number, b: number) {
    if (!this.socket) this.init();

    const message = Buffer.from([r, g, b]);

    this.socket.send(message, 0, message.length, this.PORT, this.HOST, (err: any) => {
      if (err) console.error("[UDP Service] Send Error:", err);
      else console.log(`[UDP] Sent RGB(${r},${g},${b})`);
    });
  }

  // PRE BEZPEČNOSŤ: Pošle príkaz 3x rýchlo za sebou (Burst)
  // Aby sme mali istotu, že to dav zachytí aj v rušení
  broadcastBurst(r: number, g: number, b: number) {
    let count = 0;
    const interval = setInterval(() => {
        this.broadcastColor(r, g, b);
        count++;
        if (count >= 5) clearInterval(interval); // Pošle 5x
    }, 50); // Každých 50ms
  }

  // Stop / Blackout
  stop() {
    this.broadcastBurst(0, 0, 0); // Pošle čiernu viackrát
  }

  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const udpService = new UDPService();