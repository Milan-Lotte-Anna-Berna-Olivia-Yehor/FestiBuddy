import { ReactNativeZoomableView } from '@dudigital/react-native-zoomable-view';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Line } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const MARKERS = [
  // --- BUILDINGS ---
  { id: 'R3', title: 'Building R3', x: 21.6, y: 56.0, icon: 'business', color: '#4285F4' },
  { id: 'R4', title: 'Building R4', x: 24.0, y: 34.5, icon: 'business', color: '#4285F4' },
  { id: 'R5', title: 'Building R5', x: 38.7, y: 33.0, icon: 'business', color: '#4285F4' },
  { id: 'R10', title: 'Building R10', x: 32.6, y: 58.5, icon: 'business', color: '#4285F4' },
  { id: 'R11', title: 'Building R11', x: 48.6, y: 58.2, icon: 'business', color: '#4285F4' },
  { id: 'R12', title: 'Building R12', x: 51.3, y: 36.9, icon: 'business', color: '#4285F4' },
  { id: 'R13', title: 'Building R13', x: 65.1, y: 43.5, icon: 'business', color: '#4285F4' },
  { id: 'R9', title: 'Building R9', x: 59.2, y: 62.5, icon: '1A73E8' },
  { id: 'RP', title: 'Parking', x: 63.6, y: 62.5, icon: 'car', color: '#1A73E8' },

  // --- ENTRANCES ---
  { id: 'E1', title: 'Entrance 1', x: 44.7, y: 68.0, icon: 'enter-outline', color: '#333' },
  { id: 'E1a', title: 'Entrance 1a', x: 28.6, y: 66.0, icon: 'enter-outline', color: '#333' },
  { id: 'E1b', title: 'Entrance 1b', x: 25.0, y: 65.0, icon: 'enter-outline', color: '#333' },
  { id: 'E2', title: 'Entrance 2', x: 16.5, y: 54.1, icon: 'enter-outline', color: '#333' },
  { id: 'E3', title: 'Entrance 3', x: 34.1, y: 22.7, icon: 'enter-outline', color: '#333' },
  { id: 'E4', title: 'Entrance 4', x: 47.7, y: 25.5, icon: 'enter-outline', color: '#333' },
  { id: 'E5', title: 'Entrance 5', x: 65.7, y: 25.6, icon: 'enter-outline', color: '#333' },
  { id: 'E6', title: 'Entrance 6', x: 76.1, y: 46.0, icon: 'enter-outline', color: '#333' },
  { id: 'E6a', title: 'Entrance 6a', x: 74.7, y: 51.2, icon: 'enter-outline', color: '#333' },
  { id: 'E7', title: 'Entrance 7', x: 52.5, y: 69.1, icon: 'enter-outline', color: '#333' },
  { id: 'E8', title: 'Entrance 8', x: 49.9, y: 67.7, icon: 'enter-outline', color: '#333' },

  // --- BICYCLE PARKING ---
  { id: 'B0', title: 'Motor Park West', x: 18.0, y: 58.4, icon: 'bicycle', color: '#E67E22' },
  { id: 'B1', title: 'Bike Park West', x: 19.0, y: 46.4, icon: 'bicycle', color: '#E67E22' },
  { id: 'B2', title: 'Bike Park North', x: 44.7, y: 32.5, icon: 'bicycle', color: '#E67E22' },
  { id: 'B3', title: 'Bike Park South', x: 48.7, y: 64.5, icon: 'bicycle', color: '#E67E22' },
  { id: 'B4', title: 'Bike Park R9', x: 63.6, y: 57.1, icon: 'bicycle', color: '#E67E22' },
];

const USER_POS = { x: 28.5, y: 58.5 };

export default function MapScreen() {
  const [activeTargetId, setActiveTargetId] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const zoomableViewRef = useRef<any>(null);

  const activeMarker = useMemo(() =>
    MARKERS.find((m) => m.id === activeTargetId),
  [activeTargetId]);

  const navData = useMemo(() => {
    if (!activeMarker) return { angle: 0, dist: 0 };
    const dx = activeMarker.x - USER_POS.x;
    const dy = activeMarker.y - USER_POS.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const dist = Math.sqrt(dx * dx + dy * dy);
    return { angle, dist: Math.round(dist * 8) };
  }, [activeMarker]);

  const handleCenterUser = () => {
    if (zoomableViewRef.current) {
      zoomableViewRef.current.zoomTo(isWeb ? 1.5 : 2);
      
      const targetY = isWeb 
        ? (USER_POS.y * (screenWidth / 1.5 / 100)) 
        : (USER_POS.y * (screenHeight / 100));

      zoomableViewRef.current.moveTo(
        USER_POS.x * (screenWidth / 100),
        targetY
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style={isWeb ? "light" : "dark"} />

      <ReactNativeZoomableView
        ref={zoomableViewRef}
        maxZoom={5}
        minZoom={0.5}
        initialZoom={isWeb ? 1 : 1.5}
        bindToBorders={isWeb} // Keep constraints on web, free pan on mobile
        style={styles.zoomContainer}
      >
        <View style={isWeb ? styles.mapCanvasWeb : styles.mapCanvasMobile}>
          <View style={styles.mapImageContainer} pointerEvents="none">
            <Image
              source={require('../../assets/images/festival-map.png')}
              style={styles.mapImage}
              resizeMode={isWeb ? 'contain' : 'cover'}
            />
          </View>

          {isNavigating && activeMarker && (
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <Line
                  x1={USER_POS.x}
                  y1={USER_POS.y}
                  x2={activeMarker.x}
                  y2={activeMarker.y}
                  stroke="#4285F4"
                  strokeWidth="0.5"
                  strokeDasharray="1.5, 1"
                />
              </Svg>
            </View>
          )}

          {MARKERS.map((marker) => (
            <TouchableOpacity
              key={marker.id}
              style={[
                styles.marker,
                { left: `${marker.x}%`, top: `${marker.y}%`, borderColor: marker.color }
              ]}
              onPress={() => {
                setActiveTargetId(marker.id);
                setIsNavigating(false);
              }}
            >
              <Ionicons name={marker.icon as any} size={14} color={marker.color} />
            </TouchableOpacity>
          ))}

          <View style={[styles.userDotContainer, { left: `${USER_POS.x}%`, top: `${USER_POS.y}%` }]}>
            <View style={styles.userDotPulse} />
            <View style={styles.userDot} />
            {isNavigating && (
              <View style={[styles.arrowWrapper, { transform: [{ rotate: `${navData.angle + 90}deg` }] }]}>
                <Ionicons name="caret-up" size={20} color="#4285F4" />
              </View>
            )}
          </View>
        </View>
      </ReactNativeZoomableView>

      <TouchableOpacity style={styles.reCenterBtn} onPress={handleCenterUser}>
        <Ionicons name="locate" size={24} color="#4285F4" />
      </TouchableOpacity>

      {activeMarker && (
        <View style={styles.navPanel}>
          <View style={styles.navTextContainer}>
            <Text style={styles.navLabel}>{isNavigating ? "NAVIGATING" : "SELECTED"}</Text>
            <Text style={styles.navTitle}>{activeMarker.title}</Text>
            <Text style={styles.navDistance}>{navData.dist}m away</Text>
          </View>

          {!isNavigating ? (
            <TouchableOpacity style={styles.startBtn} onPress={() => setIsNavigating(true)}>
              <Ionicons name="navigate" size={18} color="white" />
              <Text style={styles.startBtnText}>Start</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.stopBtn}
              onPress={() => {
                setIsNavigating(false);
                setActiveTargetId(null);
              }}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const MARKER_SIZE = 26;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: isWeb ? '#f0f0f0' : '#ffffff' },
  zoomContainer: { flex: 1 },
  // WEB VERSION: Fixed Aspect Ratio
  mapCanvasWeb: {
    width: screenWidth,
    aspectRatio: 1.45,
    position: 'relative',
    alignSelf: 'center',
  },
  // MOBILE VERSION: Full Screen
  mapCanvasMobile: {
    width: screenWidth,
    height: screenHeight,
    position: 'relative',
  },
  mapImageContainer: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0 
  },
  mapImage: { 
    width: '100%', 
    height: '100%'
  },
  marker: {
    position: 'absolute',
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    backgroundColor: 'white',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -(MARKER_SIZE / 2),
    marginTop: -(MARKER_SIZE / 2),
    zIndex: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
      android: { elevation: 4 },
      web: { boxShadow: '0px 2px 5px rgba(0,0,0,0.2)' }
    }),
  },
  userDotContainer: { position: 'absolute', justifyContent: 'center', alignItems: 'center', zIndex: 20 },
  userDot: { width: 14, height: 14, backgroundColor: '#4285F4', borderRadius: 7, borderWidth: 2, borderColor: 'white' },
  userDotPulse: { position: 'absolute', width: 30, height: 30, borderRadius: 15, backgroundColor: '#4285F4', opacity: 0.2 },
  arrowWrapper: { position: 'absolute', top: -22 },
  reCenterBtn: {
    position: 'absolute',
    right: 20,
    bottom: isWeb ? 120 : 130,
    backgroundColor: 'white',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    boxShadow: '0px 2px 5px rgba(0,0,0,0.2)'
  },
  navPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 10,
    boxShadow: '0px 4px 15px rgba(0,0,0,0.1)'
  },
  navTextContainer: { flex: 1 },
  navLabel: { color: '#4285F4', fontSize: 10, fontWeight: '900', marginBottom: 2 },
  navTitle: { color: '#1a1a1a', fontWeight: 'bold', fontSize: 18 },
  navDistance: { color: '#888', fontSize: 12 },
  startBtn: { backgroundColor: '#4285F4', flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, alignItems: 'center' },
  startBtnText: { color: 'white', fontWeight: 'bold', marginLeft: 6 },
  stopBtn: { backgroundColor: '#333', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
});