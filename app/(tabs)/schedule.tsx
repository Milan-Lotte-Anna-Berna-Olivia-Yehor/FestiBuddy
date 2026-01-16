import { Artists } from "@/constants/artistList";
import { Events } from "@/constants/eventList";
import { useSearchParams } from "expo-router/build/hooks";
import { Scroll } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native";

type LineupItem = {
  id: string;
  start: string;
  end: string;
  name: string;
  liked: boolean;
};

type LineupByDate = {
  [date: string]: {
    event: string;
    artists: LineupItem[];
  };
};

/* ---------------- LINEUP DATA ---------------- */
// const LINEUP_BY_DATE: LineupByDate = {
//   "2025-07-11": {
//     event: "Awakenings",
//     artists: [
//       { id: "1", start: "13:00", end: "14:00", name: "Artist 1", liked: false },
//       { id: "2", start: "14:00", end: "15:00", name: "Artist 2", liked: true },
//     ],
//   },
//   "2025-07-12": {
//     event: "Awakenings",
//     artists: [
//       { id: "3", start: "15:00", end: "16:00", name: "Artist 3", liked: false },
//       { id: "4", start: "16:00", end: "17:00", name: "Artist 4", liked: false },
//     ],
//   },
//   "2025-08-07": {
//     event: "Lowlands",
//     artists: [
//       { id: "5", start: "18:00", end: "19:00", name: "Artist 5", liked: true },
//     ],
//   },
//   "2025-08-08": {
//     event: "Lowlands",
//     artists: [
//       { id: "6", start: "19:00", end: "20:00", name: "Artist 6", liked: false },
//     ],
//   },
// };

/* ---------------- HELPERS ---------------- */
// const getDatesForEvent = (eventName: string, lineup: LineupByDate) =>
//   Object.entries(lineup)
//     .filter(([_, data]) => data.event === eventName)
//     .map(([date]) => new Date(date))
//     .sort((a, b) => a.getTime() - b.getTime());

// const formatKey = (date: Date) => date.toISOString().split("T")[0];
// const formatDayLabel = (date: Date) =>
//   date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/* ---------------- COMPONENT ---------------- */
export default function LineupScreen() {
  const [currentTab, setCurrentTab] = useState<"lineup" | "timetable">("lineup");
  // const [lineupByDate, setLineupByDate] = useState<LineupByDate>(LINEUP_BY_DATE);

  const params = useSearchParams();
  let event = Events.find(ev => ev.id.toString() === params.get("id"))

  // List of unique events
  // const eventsList = Array.from(new Set(Object.values(lineupByDate).map(d => d.event)));
  // const [selectedEvent, setSelectedEvent] = useState(eventsList[0]);

  // Get days for selected event
  // const eventDays = getDatesForEvent(selectedEvent, lineupByDate);
  // const [selectedDate, setSelectedDate] = useState(eventDays[0]);
  // const dateKey = formatKey(selectedDate);
  // const dayData = lineupByDate[dateKey]?.artists || [];

  // const toggleLike = (date: string, id: string) => {
  //   setLineupByDate(prev => ({
  //     ...prev,
  //     [date]: {
  //       ...prev[date],
  //       artists: prev[date].artists.map(a =>
  //         a.id === id ? { ...a, liked: !a.liked } : a
  //       ),
  //     },
  //   }));
  // };

  // Personal Timetable
  // const timetableData = Object.entries(lineupByDate)
  //   .map(([date, data]) => ({
  //     date,
  //     event: data.event,
  //     artists: data.artists.filter(a => a.liked),
  //   }))
  //   .filter(day => day.artists.length > 0)
  //   .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* Event name in center */}
        <Text style={styles.headerTitle}>{event?.title}</Text>

        {/* Event selector (only in Lineup tab) */}
        {/* {currentTab === "lineup" && (
          <View style={{ flexDirection: "row", position: "absolute", right: 16, top: 16 }}>
            {eventsList.map(event => (
              <TouchableOpacity
                key={event}
                onPress={() => {
                  setSelectedEvent(event);
                  const firstDay = getDatesForEvent(event, lineupByDate)[0];
                  setSelectedDate(firstDay);
                }}
                style={[
                  styles.eventButton,
                  selectedEvent === event && styles.eventButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.eventText,
                    selectedEvent === event && styles.eventTextActive,
                  ]}
                >
                  {event}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )} */}
      </View>

      {/* ---------------- LINEUP TAB ---------------- */}
      {currentTab === "lineup" && (
        <>
          {/* Day Tabs
          <View style={styles.tabs}>
            {eventDays.map(date => (
              <TouchableOpacity
                key={date.toISOString()}
                onPress={() => setSelectedDate(date)}
                style={[styles.tab, formatKey(date) === dateKey && styles.tabActive]}
              >
                <Text
                  style={[
                    styles.tabText,
                    formatKey(date) === dateKey && styles.tabTextActive,
                  ]}
                >
                  {formatDayLabel(date)}
                </Text>
              </TouchableOpacity>
            ))}
          </View> */}

          {/* Lineup List */}

          <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
            {event?.artists.map(ar => {
              let artist = Artists[ar.id]
              return(
                <View style={styles.row}>
                <Text style={styles.time}>
                  {ar.start_time} {"\n"} {ar.end_time}
                </Text>
                <Image
                  source={require("@/assets/images/widebinkydog.png")}
                  style={styles.avatar}
                />
                <Text style={styles.artist}>{artist.name}</Text>
                {/* <TouchableOpacity onPress={() => toggleLike(dateKey, ar.id)}>
                  <Text style={{ color: item.liked ? "#ff5fa2" : "#fff", fontSize: 18 }}>♥</Text>
                </TouchableOpacity> */}
              </View>
              );
            })}
          </ScrollView>

          {/* <FlatList
            data={event?.artists}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.time}>
                  {item.start_time} {"\n"} {item.end_time}
                </Text>
                <Image
                  source={{ uri: "https://via.placeholder.com/60" }}
                  style={styles.avatar}
                />
                <Text style={styles.artist}>{item.name}</Text>
                <TouchableOpacity onPress={() => toggleLike(dateKey, item.id)}>
                  <Text style={{ color: item.liked ? "#ff5fa2" : "#fff", fontSize: 18 }}>♥</Text>
                </TouchableOpacity>
              </View>
            )}
          /> */}
        </>
      )}

      {/* ---------------- PERSONAL TIMETABLE ---------------- */}
      {/* {currentTab === "timetable" && (

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
            {event?.artists.map(ar => {
              let artist = Artists[ar.id]
              return(
                <View style={{ marginBottom: 24 }}>
                  <Text style={styles.dateHeader}>
                    {ar.start_time}
                  </Text>
                  <Text style={styles.eventHeader}>{item.event}</Text>
                  {item.artists.map(artist => (
                    <View key={artist.id} style={styles.row}>
                      <Text style={styles.time}>{artist.start}</Text>
                      <Text style={styles.artist}>{artist.name}</Text>
                      <TouchableOpacity onPress={() => toggleLike(item.date, artist.id)}>
                        <Text style={{ color: artist.liked ? "#ff5fa2" : "#fff", fontSize: 18 }}>♥</Text>
                      </TouchableOpacity>
                </View>
              ))}
            </View>
              );
            })}
          </ScrollView>

        // <FlatList
        //   data={timetableData}
        //   keyExtractor={item => item.date}
        //   contentContainerStyle={{ paddingBottom: 120 }}
        //   renderItem={({ item }) => (
            // <View style={{ marginBottom: 24 }}>
            //   <Text style={styles.dateHeader}>
            //     {new Date(item.date).toLocaleDateString("en-GB", {
            //       day: "numeric",
            //       month: "short",
            //     })}
            //   </Text>
            //   <Text style={styles.eventHeader}>{item.event}</Text>
            //   {item.artists.map(artist => (
            //     <View key={artist.id} style={styles.row}>
            //       <Text style={styles.time}>{artist.start}</Text>
            //       <Text style={styles.artist}>{artist.name}</Text>
            //       <TouchableOpacity onPress={() => toggleLike(item.date, artist.id)}>
            //         <Text style={{ color: artist.liked ? "#ff5fa2" : "#fff", fontSize: 18 }}>♥</Text>
            //       </TouchableOpacity>
            //     </View>
            //   ))}
            // </View>
        //   )}
        // />
      )} */}

      {/* ---------------- BOTTOM BUTTONS ---------------- */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.button, styles.pink]}
          onPress={() => setCurrentTab("lineup")}
        >
          <Text style={styles.buttonText}>Lineup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.green]}
          onPress={() => setCurrentTab("timetable")}
        >
          <Text style={styles.buttonText}>Personal timetable</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: { color: "#ff5fa2", fontSize: 24, fontWeight: "700", textAlign: "center", flex: 1 },
  tabs: { flexDirection: "row", justifyContent: "space-around", marginBottom: 12 },
  tab: { paddingVertical: 8 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: "#a8ff2a" },
  tabText: { color: "#777" },
  tabTextActive: { color: "#a8ff2a", fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", padding: 14, borderBottomWidth: 1, borderBottomColor: "#222" },
  time: { color: "#aaa", width: 50, fontSize: 12 },
  avatar: { width: 48, height: 48, borderRadius: 6, marginHorizontal: 12 },
  artist: { flex: 1, color: "#fff", fontSize: 16 },
  bottom: { flexDirection: "row", padding: 12, backgroundColor: "#000" },
  button: { flex: 1, paddingVertical: 14, borderRadius: 20, alignItems: "center", marginHorizontal: 6 },
  pink: { backgroundColor: "#ff5fa2" },
  green: { backgroundColor: "#a8ff2a" },
  buttonText: { fontWeight: "600" },
  dateHeader: { color: "#a8ff2a", fontSize: 16, fontWeight: "600", marginBottom: 4 },
  eventHeader: { color: "#ff5fa2", fontSize: 18, fontWeight: "700", marginBottom: 8 },
  eventButton: { marginLeft: 8, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, borderWidth: 1, borderColor: "#777" },
  eventButtonActive: { borderColor: "#a8ff2a", backgroundColor: "#222" },
  eventText: { color: "#777", fontSize: 14 },
  eventTextActive: { color: "#a8ff2a", fontWeight: "600" },
});
