import { ReactNativeZoomableView } from "@dudigital/react-native-zoomable-view";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Line } from "react-native-svg";

const { width, height } = Dimensions.get("window");

// Map dimensions - the actual PNG image size
const MAP_WIDTH = width * 0.9;
const MAP_HEIGHT = height * 0.7;

// POIs relative to map (0-1 coordinates, easier to manage)
const POIs = [
  { id: 1, title: "Main Stage", type: "stage", x: 0.5, y: 0.25, icon: "musical-notes", desc: "Headliners Area" },
  { id: 2, title: "Techno Dome", type: "stage", x: 0.2, y: 0.45, icon: "flash", desc: "Hard Style" },
  { id: 3, title: "Chill Garden", type: "chill", x: 0.8, y: 0.5, icon: "leaf", desc: "Relax Zone" },
  { id: 4, title: "Lockers", type: "service", x: 0.85, y: 0.85, icon: "key", desc: "Safe Storage" },
  { id: 5, title: "Toilets", type: "service", x: 0.15, y: 0.8, icon: "water", desc: "Restrooms" },
];

const USER_START = { x: 0.5, y: 0.9 }; // Center bottom

export default function MapScreen() {
  const zoomRef = useRef<ReactNativeZoomableView | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<typeof POIs[0] | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleZoom = (amount: number) => zoomRef.current?.zoomBy(amount);

  const startNavigation = () => {
    setIsNavigating(true);
    // Center on the route
    if (selectedPoi) {
      const centerX = (USER_START.x + selectedPoi.x) / 2;
      const centerY = (USER_START.y + selectedPoi.y) / 2;
      zoomRef.current?.moveTo(
        -centerX * MAP_WIDTH + width / 2,
        -centerY * MAP_HEIGHT + height / 2
      );
    }
  };

  const cancelNavigation = () => {
    setIsNavigating(false);
    setSelectedPoi(null);
  };

  const resetView = () => {
    zoomRef.current?.zoomTo(1.0);
    zoomRef.current?.moveTo(0, 0);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerPill}>
          <Text style={styles.headerText}>Festival Map</Text>
        </View>
      </SafeAreaView>

      <View style={styles.container}>
        <ReactNativeZoomableView
          ref={zoomRef}
          maxZoom={3.0}
          minZoom={0.5}
          initialZoom={1.0}
          initialOffsetX={0}
          initialOffsetY={0}
          bindToBorders={true}
          contentWidth={MAP_WIDTH}
          contentHeight={MAP_HEIGHT}
          style={styles.zoomView}
        >
          <View style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}>
            
            {/* MAP IMAGE */}
            <View style={styles.mapBorder}>
              <Image
                source={require("../../assets/images/festival-map.png")}
                style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
                resizeMode="contain"
              />
            </View>

            {/* NAVIGATION LINE */}
            {isNavigating && selectedPoi && (
              <Svg height={MAP_HEIGHT} width={MAP_WIDTH} style={StyleSheet.absoluteFill}>
                <Line
                  x1={USER_START.x * MAP_WIDTH}
                  y1={USER_START.y * MAP_HEIGHT}
                  x2={selectedPoi.x * MAP_WIDTH}
                  y2={selectedPoi.y * MAP_HEIGHT}
                  stroke="#7CFF00"
                  strokeWidth="4"
                  strokeDasharray="10, 8"
                />
                {/* Destination marker */}
                <Line
                  x1={selectedPoi.x * MAP_WIDTH}
                  y1={selectedPoi.y * MAP_HEIGHT}
                  x2={selectedPoi.x * MAP_WIDTH}
                  y2={selectedPoi.y * MAP_HEIGHT}
                  stroke="#FF0000"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </Svg>
            )}

            {/* MARKERS */}
            {POIs.map((poi) => (
              <TouchableOpacity
                key={poi.id}
                style={[
                  styles.marker,
                  {
                    left: poi.x * MAP_WIDTH - 20,
                    top: poi.y * MAP_HEIGHT - 44
                  }
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedPoi(poi);
                  setIsNavigating(false);
                }}
              >
                <View style={[
                  styles.pin,
                  { backgroundColor: poi.type === 'stage' ? '#FF0000' : '#222' }
                ]}>
                  {/* @ts-ignore */}
                  <Ionicons name={poi.icon} size={18} color="#FFF" />
                </View>
                <View style={styles.pinArrow} />
              </TouchableOpacity>
            ))}

            {/* USER DOT */}
            <View style={[
              styles.userDot,
              {
                left: USER_START.x * MAP_WIDTH - 12,
                top: USER_START.y * MAP_HEIGHT - 12
              }
            ]}>
              <View style={styles.pulse} />
              <View style={styles.dotCore} />
            </View>
          </View>
        </ReactNativeZoomableView>
      </View>

      {/* ZOOM CONTROLS */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={() => handleZoom(0.3)}>
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.btn} onPress={() => handleZoom(-0.3)}>
          <Ionicons name="remove" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.btn} onPress={resetView}>
          <Ionicons name="contract" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* INFO CARD */}
      {selectedPoi && (
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={[
              styles.cardIcon,
              { backgroundColor: selectedPoi.type === 'stage' ? '#FF0000' : '#333' }
            ]}>
              {/* @ts-ignore */}
              <Ionicons name={selectedPoi.icon} size={24} color="#FFF" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{selectedPoi.title}</Text>
              <Text style={styles.cardDesc}>{selectedPoi.desc}</Text>
            </View>
            <TouchableOpacity
              style={[styles.goBtn, isNavigating && { backgroundColor: '#FF3B30' }]}
              onPress={isNavigating ? cancelNavigation : startNavigation}
            >
              <Text style={styles.goText}>{isNavigating ? "STOP" : "GO"}</Text>
              {!isNavigating && <Ionicons name="arrow-forward" size={16} color="#000" />}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#121212" },
  
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
    pointerEvents: 'none'
  },
  headerPill: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  headerText: { color: '#FFF', fontWeight: 'bold' },
  
  container: { flex: 1 },
  zoomView: {
    backgroundColor: '#121212',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  mapBorder: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: '#000',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  
  marker: {
    position: 'absolute',
    width: 40,
    height: 44,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 20
  },
  pin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    zIndex: 2
  },
  pinArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFF',
    marginTop: -2
  },
  
  userDot: {
    position: 'absolute',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  dotCore: {
    width: 14,
    height: 14,
    backgroundColor: '#007AFF',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFF'
  },
  pulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: 'rgba(0, 122, 255, 0.4)',
    borderRadius: 12
  },
  
  controls: {
    position: 'absolute',
    right: 20,
    top: '40%',
    backgroundColor: '#222',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  btn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222'
  },
  divider: { height: 1, backgroundColor: '#333', width: '100%' },
  
  card: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  cardText: { flex: 1 },
  cardTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  cardDesc: { color: '#AAA', fontSize: 13 },
  goBtn: {
    backgroundColor: '#7CFF00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  goText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
});