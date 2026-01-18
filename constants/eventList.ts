import { ImageSourcePropType } from "react-native";

export interface Performance {
  id: number;
  artistName: string;
  time: string;
  stage: string;
  day: string; // Pridaný deň pre lepšie triedenie
}

export interface EventInfo {
  label: string;
  value: string;
  icon: string; 
}

export interface Event {
  id: number;
  title: string;
  status: "live" | "upcoming" | "past"; // Status eventu
  date: string;
  location: string;
  image: ImageSourcePropType;
  description: string;
  stages: string[];
  performances: Performance[];
  usefulInfo: EventInfo[];
}

export const eventList: Event[] = [
  {
    id: 1,
    title: "Dreamwave",
    status: "live",
    date: "14. - 16. Aug",
    location: "Budapest, Hungary",
    image: require("../assets/images/event_dreamwave.png"), 
    description: "Welcome to Dreamwave, the ultimate electronic music experience in Central Europe! Spanning 3 days on an island in the Danube, this festival brings together top-tier techno, house, and trance artists. Enjoy the massive light shows, chill zones, and the unique energy of thousands of connected souls.",
    stages: ["Main Stage", "Techno Dome", "Riverside Deck"],
    usefulInfo: [
      { label: "Age", value: "18+", icon: "person-add" },
      { label: "Gate", value: "K-Bridge", icon: "enter" },
      { label: "Weather", value: "24°C Night", icon: "sunny" },
      { label: "Camping", value: "Zone C", icon: "camp" }, // camp icon might need mapping or custom
    ],
    performances: [
        { id: 101, artistName: "Neon Lights", time: "20:00 - 21:30", stage: "Main Stage", day: "Friday" },
        { id: 102, artistName: "Synth Punks", time: "22:00 - 23:30", stage: "Main Stage", day: "Friday" },
        { id: 201, artistName: "Dark Matter", time: "21:00 - 22:30", stage: "Techno Dome", day: "Friday" },
        { id: 301, artistName: "Sunset Vibes", time: "19:00 - 20:30", stage: "Riverside Deck", day: "Friday" },
        { id: 103, artistName: "Galactic Bass", time: "00:00 - 02:00", stage: "Main Stage", day: "Saturday" },
    ]
  },
  {
    id: 2,
    title: "Istanbul Waves",
    status: "upcoming",
    date: "20. - 22. Sep",
    location: "Istanbul, Turkey",
    image: require("../assets/images/event_istanbulwaves.png"),
    description: "Experience the magic where East meets West. Istanbul Waves offers a unique blend of modern electronic beats and traditional oriental instruments, set against the backdrop of the Bosphorus. Don't miss the ferry boat parties!",
    stages: ["Bosphorus Stage", "Grand Bazaar Tent"],
    usefulInfo: [
       { label: "Age", value: "16+", icon: "person-add" },
       { label: "Transport", value: "Ferry Only", icon: "boat" }
    ],
    performances: [
        { id: 401, artistName: "Bosphorus Beats", time: "19:00 - 21:00", stage: "Bosphorus Stage", day: "Saturday" },
        { id: 402, artistName: "Sultan's Groove", time: "22:00 - 00:00", stage: "Grand Bazaar Tent", day: "Saturday" }
    ]
  },
  {
    id: 3,
    title: "Brit Rock",
    status: "upcoming",
    date: "05. - 07. Oct",
    location: "London, UK",
    image: require("../assets/images/event_britrock.png"),
    description: "Raw energy, loud guitars, and London rain. Brit Rock brings the best of indie and alternative rock to Wembley Park. Put on your boots and get ready to mosh.",
    stages: ["Wembley Arena", "Underground Club"],
    usefulInfo: [
        { label: "Entry", value: "Gate 4", icon: "ticket" }
    ],
    performances: [
        { id: 501, artistName: "The Guitars", time: "20:00 - 22:00", stage: "Wembley Arena", day: "Sunday" },
        { id: 502, artistName: "Garage Boys", time: "18:00 - 19:30", stage: "Underground Club", day: "Sunday" }
    ]
  }
];