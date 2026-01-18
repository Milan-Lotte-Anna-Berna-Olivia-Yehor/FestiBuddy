import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { eventList } from "../../constants/eventList";

export default function HomeScreen() {
  const router = useRouter();
  const featuredEvent = eventList[0]; 
  const upcomingEvents = eventList.slice(1);
  const [likedPerformances, setLikedPerformances] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadLikes();
    }, [])
  );

  const loadLikes = async () => {
    try {
      const stored = await AsyncStorage.getItem("likedPerformances");
      if (stored) setLikedPerformances(JSON.parse(stored));
    } catch (e) { console.error(e); }
  };

  const toggleLike = async (id: number) => {
    let newLikes = [...likedPerformances];
    if (newLikes.includes(id)) newLikes = newLikes.filter(l => l !== id);
    else newLikes.push(id);
    setLikedPerformances(newLikes);
    await AsyncStorage.setItem("likedPerformances", JSON.stringify(newLikes));
  };

  const openEventDetail = (id: number) => {
    router.push({ pathname: "/modalEvent", params: { eventId: id } });
  };

  // Zoberieme z každého stage jeden performance pre ukážku "Live Stages"
  const distinctStagePerformances = featuredEvent.stages.map(stage => 
    featuredEvent.performances.find(p => p.stage === stage)
  ).filter(Boolean); // Odstranime undefined ak na stagy prave nikto nehra

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true} 
      >
        <TouchableOpacity 
          activeOpacity={0.98} 
          onPress={() => openEventDetail(featuredEvent.id)}
        >
          <ImageBackground
            source={featuredEvent.image}
            style={styles.heroImage}
            imageStyle={{ opacity: 0.85 }} 
          >
            {/* Zmenšený Scrim (Clona) */}
            <View style={styles.headerScrim} />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
              
              {/* HEADER: Väčšie Logo a Profil */}
              <View style={styles.headerRow}>
                <Image 
                  source={require("../../assets/images/app_logo_home-removebg-preview.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <TouchableOpacity onPress={() => router.push("/profile")}>
                  <View style={styles.profileContainer}>
                    <Image 
                      source={require("../../assets/images/home_profile-removebg-preview.png")}
                      style={styles.profileIcon}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {/* HERO CONTENT - Posunutý nižšie pre lepší vzhľad */}
              <View style={styles.heroContent}>
                <View style={styles.statusRow}>
                  <View style={styles.liveTag}>
                    <View style={styles.redDot} />
                    <Text style={styles.liveText}>LIVE NOW</Text>
                  </View>
                  <Text style={styles.heroTitle}>{featuredEvent.title}</Text>
                  <View style={styles.locationTag}>
                     <Ionicons name="location-outline" size={14} color="#CCC" />
                     <Text style={styles.locationText}>{featuredEvent.location}</Text>
                  </View>
                </View>

                {/* LIVE STAGES CARDS */}
                <Text style={styles.stagesLabel}>CURRENTLY ON STAGES</Text>
                
                <View style={styles.stagesContainer}>
                   {distinctStagePerformances.slice(0, 3).map((perf: any) => {
                     const isLiked = likedPerformances.includes(perf.id);
                     return (
                       <View key={perf.id} style={styles.stageCard}>
                          <View style={styles.stageIndicator} />
                          <View style={styles.stageInfo}>
                             <Text style={styles.stageName}>{perf.stage}</Text>
                             <Text style={styles.artistName} numberOfLines={1}>{perf.artistName}</Text>
                             <Text style={styles.timeText}>{perf.time}</Text>
                          </View>
                          
                          <TouchableOpacity 
                            style={styles.likeButton} 
                            onPress={() => toggleLike(perf.id)}
                          >
                             <Ionicons 
                               name={isLiked ? "heart" : "heart-outline"} 
                               size={26} 
                               color={isLiked ? "#7CFF00" : "#FFF"} 
                             />
                          </TouchableOpacity>
                       </View>
                     );
                   })}
                </View>
              </View>
            </SafeAreaView>
          </ImageBackground>
        </TouchableOpacity>

        {/* UPCOMING EVENTS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Festivals</Text>
          {upcomingEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              activeOpacity={0.9}
              onPress={() => openEventDetail(event.id)}
            >
              <Image source={event.image} style={styles.eventCardImage} />
              <View style={styles.eventCardOverlay}>
                <View style={styles.eventInfoCol}>
                  <Text style={styles.eventCardTitle}>{event.title}</Text>
                  <Text style={styles.eventCardDate}>{event.date}</Text>
                  <Text style={styles.eventCardDesc} numberOfLines={2}>
                    {event.description}
                  </Text>
                </View>
                <View style={styles.arrowButton}>
                   <Ionicons name="arrow-forward" size={24} color="#000" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scrollView: { flex: 1, backgroundColor: "#000" },
  scrollContent: { paddingBottom: 20 },
  safeArea: { flex: 1, justifyContent: "space-between" },
  
  heroImage: { width: "100%", height: 720, justifyContent: "space-between" }, // Trochu vyšší hero
  
  // Scrim upravený podľa požiadavky
  headerScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140, // Zmenšené z 180
    backgroundColor: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)', // Fallback rgba
    // Note: React Native defaultne nepodporuje linear-gradient bez kniznice, 
    // takze pouzijeme solidnu polopriesvitnu farbu pre istotu alebo expo-linear-gradient ak je instalovany.
    backgroundColor: 'rgba(0,0,0,0.4)', 
  },
  
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 0,
  },
  logo: {
    width: 250, // Zväčšené
    height: 100, // Zväčšené
    marginLeft: -60,
    resizeMode: "contain",
  },
  profileContainer: {
    padding: 0,
  },
  profileIcon: {
    width: 65, // Zväčšené
    height: 65,
  },
  
  heroContent: {
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  statusRow: { marginBottom: 24 },
  liveTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF0000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  redDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: "#FFF", marginRight: 6,
  },
  liveText: { color: "#FFF", fontWeight: "800", fontSize: 12 },
  
  heroTitle: {
    color: "#FFF",
    fontSize: 48, // Mega title
    fontWeight: "900",
    textTransform: "uppercase",
    lineHeight: 48,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 10,
  },
  locationTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { color: "#DDD", fontSize: 14, fontWeight: '500' },

  stagesLabel: {
    color: "#7CFF00",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  stagesContainer: { gap: 12 },
  stageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(20, 20, 20, 0.85)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  stageIndicator: {
    width: 4, height: '100%', backgroundColor: '#7CFF00', borderRadius: 2, marginRight: 16,
  },
  stageInfo: { flex: 1 },
  stageName: { color: '#888', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 },
  artistName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  timeText: { color: '#CCC', fontSize: 13, marginTop: 2 },
  likeButton: { padding: 4 },

  section: { paddingHorizontal: 20, marginTop: 40 },
  sectionTitle: { color: "#FFF", fontSize: 26, fontWeight: "700", marginBottom: 20 },
  eventCard: {
    height: 240, // Vyššia karta pre viac info
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: "#1A1A1A",
  },
  eventCardImage: { width: "100%", height: "100%", position: "absolute", opacity: 0.5 },
  eventCardOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 24,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: 'space-between'
  },
  eventInfoCol: { flex: 1, marginRight: 10 },
  eventCardTitle: { color: "#FFF", fontSize: 28, fontWeight: "bold", marginBottom: 4 },
  eventCardDate: { color: "#7CFF00", fontSize: 14, fontWeight: "bold", marginBottom: 8 },
  eventCardDesc: { color: "#CCC", fontSize: 14, lineHeight: 20 },
  arrowButton: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: "#7CFF00",
    justifyContent: "center", alignItems: "center",
  },
});