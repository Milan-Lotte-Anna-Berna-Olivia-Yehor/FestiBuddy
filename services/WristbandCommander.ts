// services/WristbandCommander.ts

// Simulácia odoslania príkazu na "Gateway" alebo priamo na náramky
export const sendCrowdCommand = async (command: string, color: string = "#FFFFFF") => {
    console.log(`[GATEWAY] Sending command: ${command} with color ${color}`);
    
    // Tu by bol reálny fetch request na ESP32 Gateway alebo Firebase
    // await fetch('http://gateway-ip/api/command', { ... })
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, timestamp: new Date() });
        }, 500); // Simulujeme latenciu siete
    });
};

export const crowdStats = {
    activeWristbands: 12453,
    batteryAverage: 82,
    signalStrength: "Strong"
};