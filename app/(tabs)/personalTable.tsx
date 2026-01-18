import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Event, eventList, Performance } from "../../constants/eventList";

// Typ pre sekciu
interface PlanSection {
  title: string;
  event: Event;
  data: Performance[];
}

export default function PersonalTimetable() {
  const router = useRouter();
  const [sections, setSections] = useState<PlanSection[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadMyPlan();
    }, [])
  );

  const loadMyPlan = async () => {
    try {
      const storedLikes = await AsyncStorage.getItem("likedPerformances");
      const likedIds: number[] = storedLikes ? JSON.parse(storedLikes) : [];

      if (likedIds.length === 0) {
        setSections([]);
        return;
      }

      // Vytvoríme sekcie pre každý event, ktorý má liknutých umelcov
      const newSections: PlanSection[] = [];

      eventList.forEach(event => {
        const myPerformances = event.performances.filter(p => likedIds.includes(p.id));
        
        if (myPerformances.length > 0) {
          // Zoradíme podľa času
          myPerformances.sort((a, b) => a.time.localeCompare(b.time));
          
          newSections.push({
            title: event.title,
            event: event,
            data: myPerformances
          });
        }
      });

      // Zoradíme sekcie: Live event prvý
      newSections.sort((a, b) => (a.event.status === 'live' ? -1 : 1));
      
      setSections(newSections);
    } catch (e) { console.error(e); }
  };

  const openEventDetail = (id: number) => {
    router.push({ pathname: "/modalEvent", params: { eventId: id } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>My Festival Plan</Text>
      
      {sections.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-dislike-outline" size={60} color="#333" />
          <Text style={styles.emptyText}>Your plan is empty.</Text>
          <Text style={styles.emptySubText}>Like artists to see them here.</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: { event } }) => (
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => openEventDetail(event.id)}
              style={styles.sectionHeader}
            >
              <View style={styles.headerRow}>
                 <Text style={styles.eventTitle}>{event.title}</Text>
                 {event.status === 'live' && (
                   <View style={styles.liveBadge}>
                     <View style={styles.liveDot} />
                     <Text style={styles.liveText}>LIVE</Text>
                   </View>
                 )}
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#888" />
                <Text style={styles.eventLocation}>{event.location}</Text>
              </View>
            </TouchableOpacity>
          )}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{item.time.split(' - ')[0]}</Text>
                <Text style={styles.dayText}>{item.day.substring(0,3)}</Text>
              </View>
              
              <View style={styles.separator} />
              
              <View style={styles.infoContainer}>
                <Text style={styles.artistName}>{item.artistName}</Text>
                <Text style={styles.stageName}>{item.stage}</Text>
              </View>

              <Ionicons name="heart" size={20} color="#7CFF00" />
            </View>
          )}
          renderSectionFooter={() => <View style={{height: 20}} />} // Medzera medzi sekciami
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  screenTitle: { color: "#FFF", fontSize: 32, fontWeight: "bold", padding: 20, paddingBottom: 10 },
  
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#FFF", fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  emptySubText: { color: "#666", marginTop: 8 },

  sectionHeader: {
    backgroundColor: '#111',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 2,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF0000', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF', marginRight: 4 },
  liveText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  eventLocation: { color: '#888', fontSize: 14 },

  card: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12, // Ak je pod hlavickou
    alignItems: 'center',
  },
  timeContainer: { alignItems: 'center', width: 50 },
  timeText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  dayText: { color: '#666', fontSize: 12, textTransform: 'uppercase' },
  
  separator: { width: 1, height: '80%', backgroundColor: '#333', marginHorizontal: 16 },
  
  infoContainer: { flex: 1 },
  artistName: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  stageName: { color: '#7CFF00', fontSize: 12, marginTop: 4, textTransform: 'uppercase', fontWeight: 'bold' },
});