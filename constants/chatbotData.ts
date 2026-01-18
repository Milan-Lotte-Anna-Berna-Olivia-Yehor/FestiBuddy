export interface ChatResponse {
  keywords: string[];
  topic: string; // Pridané pre lepšiu identifikáciu témy
  response: string;
}

export const chatbotKnowledge: ChatResponse[] = [
  // --- GREETINGS ---
  {
    keywords: ["hello", "hi", "cau", "ahoj", "start", "menu", "hey"],
    topic: "Greetings",
    response: "Hey party animal! 🎉 I'm Festival Buddy. I can help you with:\n\n• 🔗 Bracelet Pairing\n• 🚨 SOS & Safety\n• 🎵 Lineup & Stages\n• 🗺️ Navigation\n• 🎒 Lost & Found\n\nJust type your question below or pick a topic!",
  },
  
  // --- BRACELET & PAIRING ---
  {
    keywords: ["pair", "connect", "bracelet", "bluetooth", "sync", "pripojit", "naramok", "spojit"],
    topic: "Bracelet",
    response: "To pair your Festival Buddy wristband:\n1. Go to Profile -> Pair Bracelet ⌚\n2. Make sure Bluetooth is ON 🔵\n3. Hold the button on your wristband for 3s until it blinks blue.\n4. Tap 'Scan' in the app.",
  },

  // --- SOS & SAFETY ---
  {
    keywords: ["sos", "help", "emergency", "doctor", "medic", "pomoc", "uraz", "sanitka"],
    topic: "Safety",
    response: "🚨 SOS FUNCTION 🚨\nIf you are in danger:\n1. Press the 'SOS' tab in the bottom menu.\n2. Hold the big red button.\n3. Your bracelet will flash RED strobe to alert security nearby.\n\nFirst Aid tent is next to the Main Stage.",
  },

  // --- MAP & NAVIGATION ---
  {
    keywords: ["where", "map", "location", "find", "get to", "kde", "mapa", "navigacia"],
    topic: "Navigation",
    response: "Check the 'Map' tab 🗺️! You can zoom in and navigate from your current position. Just tap on a marker (like a Stage or WC) and hit 'GO'.",
  },
  {
    keywords: ["toilet", "wc", "bathroom", "restroom", "peeing", "zachod"],
    topic: "Facilities",
    response: "Restrooms are located near the Main Stage (Left side) and behind the Chill Garden. Look for the 💧 icon on the map.",
  },
  
  // --- LINEUP & STAGES ---
  {
    keywords: ["lineup", "artist", "playing", "who", "stage", "kto hra", "program", "vystupenie"],
    topic: "Lineup",
    response: "We have 3 stages running right now!\n• Main Stage 🔊\n• Techno Dome 💣\n• Chill Garden 🌿\n\nCheck the 'My Plan' tab to see specific times and your liked artists.",
  },

  // --- FESTIVALS ---
  {
    keywords: ["festival", "next", "upcoming", "dreamwave", "istanbul", "dalsie", "ine"],
    topic: "Festivals",
    response: "Current Festival: Dreamwave (Budapest) 🇭🇺\n\nUpcoming events:\n• Istanbul Waves (Sept 20-22) 🇹🇷\n• Brit Rock London (Oct 05-07) 🇬🇧\n\nDetails are in the Home tab!",
  }
];

// --- SMART LOGIC ---

export const getSmartResponse = (input: string): string => {
  const lowerInput = input.toLowerCase();

  // 1. Priama zhoda (Hľadáme kľúčové slová)
  const exactMatch = chatbotKnowledge.find(item => 
    item.keywords.some(keyword => lowerInput.includes(keyword))
  );

  if (exactMatch) {
    return exactMatch.response;
  }

  // 2. Čiastočná zhoda / Návrh (Ak nevieme presne, ale tušíme)
  if (lowerInput.includes("ticket") || lowerInput.includes("money") || lowerInput.includes("refund")) {
    return "I don't handle tickets directly, but you can sort this out at the Info Point near the entrance. 🎫";
  }
  
  if (lowerInput.includes("lost") || lowerInput.includes("found") || lowerInput.includes("phone") || lowerInput.includes("wallet")) {
    return "Did you lose something? 😟 The Lost & Found office is at the Main Entrance. It's open 24/7.";
  }

  if (lowerInput.includes("food") || lowerInput.includes("drink") || lowerInput.includes("water") || lowerInput.includes("bar")) {
    return "Thirsty or hungry? 🍔🍺 Food Court is in the center area. Free water stations are near every stage.";
  }

  // 3. Totálny Fallback (Priznanie sa + Návrh)
  return "I'm sorry, I didn't quite catch that. 🤖\n\nTry asking me about:\n• 'Pair Bracelet'\n• 'Where is WC'\n• 'Lineup'\n• 'SOS'";
};