import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { eventList } from "../constants/eventList";

export default function ModalEvent() {
  const { eventId } = useLocalSearchParams();
  const router = useRouter();

  const event = eventList.find((e) => e.id === Number(eventId)) || eventList[0];
  const [likedPerformances, setLikedPerformances] = useState<number[]>([]);

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    const stored = await AsyncStorage.getItem("likedPerformances");
    if (stored) setLikedPerformances(JSON.parse(stored));
  };

  const toggleLike = async (id: number) => {
    let newLikes = [...likedPerformances];
    if (newLikes.includes(id)) newLikes = newLikes.filter(l => l !== id);
    else newLikes.push(id);
    
    setLikedPerformances(newLikes);
    await AsyncStorage.setItem("likedPerformances", JSON.stringify(newLikes));
  };

  // Zoskupenie performance podľa stage
  const groupedPerformances = event.stages.reduce((acc, stage) => {
    acc[stage] = event.performances.filter(p => p.stage === stage);
    return acc;
  }, {} as Record<string, typeof event.performances>);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="chevron-down" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Guide</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* IMAGE & TITLE */}
        <View style={styles.imageContainer}>
           <Image source={event.image} style={styles.image} />
           <View style={styles.imageOverlay} />
           <View style={styles.titleContainer}>
              <Text style={styles.title}>{event.title}</Text>
              <View style={styles.locationRow}>
                 <Ionicons name="location" size={16} color="#7CFF00" />
                 <Text style={styles.subtitle}>{event.location}</Text>
              </View>
           </View>
        </View>
        
        <View style={styles.content}>
          {/* USEFUL INFO GRID */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={24} color="#7CFF00" />
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{event.date}</Text>
            </View>
            {event.usefulInfo.map((info, index) => (
                <View key={index} style={styles.infoItem}>
                    {/* @ts-ignore - dynamic icon name */}
                    <Ionicons name={info.icon} size={24} color="#7CFF00" />
                    <Text style={styles.infoLabel}>{info.label}</Text>
                    <Text style={styles.infoValue}>{info.value}</Text>
                </View>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Lineup & Schedule</Text>
          
          {event.stages.map((stage) => (
             <View key={stage} style={styles.stageSection}>
                <Text style={styles.stageHeader}>{stage}</Text>
                {groupedPerformances[stage]?.length > 0 ? (
                    groupedPerformances[stage].map((perf) => {
                        const isLiked = likedPerformances.includes(perf.id);
                        return (
                            <View key={perf.id} style={styles.performanceRow}>
                                <View style={styles.timeCol}>
                                    <Text style={styles.timeText}>{perf.time.split(' - ')[0]}</Text>
                                    <Text style={styles.timeEnd}>{perf.time.split(' - ')[1]}</Text>
                                </View>
                                <View style={styles.artistCol}>
                                    <Text style={styles.artistName}>{perf.artistName}</Text>
                                </View>
                                <TouchableOpacity onPress={() => toggleLike(perf.id)}>
                                    <Ionicons 
                                        name={isLiked ? "heart" : "heart-outline"} 
                                        size={24} 
                                        color={isLiked ? "#7CFF00" : "#666"} 
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    })
                ) : (
                    <Text style={styles.noDataText}>No artists announced yet.</Text>
                )}
             </View>
          ))}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Get Tickets</Text>
          <Ionicons name="ticket-outline" size={20} color="#000" style={{marginLeft: 8}}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20, 
    paddingBottom: 10,
    backgroundColor: "#000",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
  },
  title: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  subtitle: {
    color: "#DDD",
    fontSize: 16,
    fontWeight: "500",
  },
  content: {
    paddingHorizontal: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  infoItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    width: '48%', // 2 stlpce
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#333',
  },
  infoLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 2,
  },
  infoValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: "#222",
    marginVertical: 24,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  stageSection: {
    marginBottom: 24,
  },
  stageHeader: {
    color: '#7CFF00',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  performanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#222',
  },
  timeCol: {
    width: 60,
    marginRight: 12,
  },
  timeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  timeEnd: {
    color: '#666',
    fontSize: 12,
  },
  artistCol: {
    flex: 1,
  },
  artistName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noDataText: {
    color: '#666',
    fontStyle: 'italic',
  },
  description: {
    color: "#AAA",
    fontSize: 16,
    lineHeight: 26,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: "rgba(0,0,0,0.95)",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  actionButton: {
    backgroundColor: "#7CFF00",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});