export const Events = [
    {
        id: 0,
        title: "Dreamwave",
        date: new Date("2026-07-15"),
        place: "Leiden, Van der Werfpark, Van der Werfstraat 5, 2311 DA Leiden, Netherlands",
        picture: require("@/assets/images/event_dreamwave.png"),
        description: "Dreamwave celebrates the melancholic and ethereal side of 90s alternative rock. Nostalgic melodies and iconic voices await fans.",
        artists: [
            { id: 0, start_time: "20:00", end_time: "21:15" }, // Mazzy Star
            { id: 1, start_time: "18:30", end_time: "19:45" }, // The Cranberries
            { id: 2, start_time: "17:00", end_time: "18:15" }, // Jeff Buckley
            { id: 3, start_time: "15:30", end_time: "16:45" }, // The Smiths
            { id: 4, start_time: "14:00", end_time: "15:15" }, // R.E.M.
        ]
    },
    {
        id: 1,
        title: "Britrock Legends",
        date: new Date("2026-08-01"),
        place: "Amsterdam, Westerpark, Westerstraat 123, 1015 MA Amsterdam, Netherlands",
        picture: require("@/assets/images/event_britrock.png"),
        description: "A tribute to the golden era of Britpop and alternative rock, with big riffs, singalong choruses, and festival nostalgia.",
        artists: [
            { id: 5, start_time: "21:00", end_time: "22:15" },  // Radiohead
            { id: 6, start_time: "19:30", end_time: "20:45" },  // Oasis
            { id: 7, start_time: "18:00", end_time: "19:15" },  // Green Day
            { id: 8, start_time: "16:30", end_time: "17:45" },  // The Strokes
            { id: 9, start_time: "15:00", end_time: "16:15" },  // Weezer
            { id: 10, start_time: "13:30", end_time: "14:30" }  // Blur
        ]
    },
    {
        id: 2,
        title: "Istanbul Vibes Festival",
        date: new Date("2026-09-12"),
        place: "Rotterdam, Kralingse Bos, Kralingse Plaslaan 11, 3062 EE Rotterdam, Netherlands",
        picture: require("@/assets/images/event_istanbulwaves.png"),
        description: "Bringing Istanbul’s indie and alternative scene to the Netherlands. Discover modern Turkish bands and eclectic sounds from east to west.",
        artists: [
            { id: 11, start_time: "20:00", end_time: "21:15" }, // Mor ve Ötesi
            { id: 12, start_time: "18:30", end_time: "19:45" }, // Vega
            { id: 13, start_time: "17:00", end_time: "18:15" }, // Büyük Ev Ablukada
            { id: 14, start_time: "15:30", end_time: "16:45" }, // Sakin
            { id: 15, start_time: "14:00", end_time: "15:15" }, // Adamlar
        ]
    },
    {
        id: 3,
        title: "Grunge & Alt Rock Festival",
        date: new Date("2026-08-20"),
        place: "Eindhoven, Stadswandelpark, Parklaan 21, 5611 EA Eindhoven, Netherlands",
        picture: require("@/assets/images/event_grunge.png"),
        description: "Celebrate the raw power of 90s and 2000s rock. From grunge to alternative to nu-metal, this festival is made for headbanging and heavy guitars.",
        artists: [
            { id: 17, start_time: "21:00", end_time: "22:15" }, // Linkin Park
            { id: 18, start_time: "19:30", end_time: "20:45" }, // Nirvana
            { id: 19, start_time: "18:00", end_time: "19:15" }, // Red Hot Chili Peppers
            { id: 20, start_time: "16:30", end_time: "17:45" }, // Pearl Jam
            { id: 21, start_time: "15:00", end_time: "16:15" }, // Soundgarden
            { id: 22, start_time: "22:30", end_time: "23:15" }  // Foo Fighters
        ]
    },
    {
        id: 4,
        title: "Modern Indie & Soul Festival",
        date: new Date("2026-07-05"),
        place: "The Hague, Zuiderpark, Zuiderparkweg 60, 2565 LA Den Haag, Netherlands",
        picture: require("@/assets/images/event_modernindie.jpg"),
        description: "Blending soul, indie, and modern alternative rock. Atmospheric performances, rising stars, and big indie names from around the world.",
        artists: [
            { id: 23, start_time: "20:00", end_time: "21:15" }, // Tamino
            { id: 24, start_time: "18:30", end_time: "19:45" }, // Sade
            { id: 25, start_time: "17:00", end_time: "18:15" }, // Palace
            { id: 26, start_time: "15:30", end_time: "16:45" }, // Arctic Monkeys
            { id: 27, start_time: "14:00", end_time: "15:15" }, // Florence + The Machine
            { id: 28, start_time: "21:30", end_time: "22:30" }  // Tame Impala
        ]
    }
];
