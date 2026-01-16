import { ReactNativeZoomableView } from '@dudigital/react-native-zoomable-view';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const MARKERS: { id: string; title: string; x: number; y: number; icon: IconName; color: string }[] = [
  { id: '1', title: 'Main Stage', x: 45, y: 30, icon: 'musical-notes', color: '#FF5733' },
  { id: '2', title: 'Electro Tent', x: 70, y: 50, icon: 'flash', color: '#33FF57' },
  { id: '3', title: 'WC Zone', x: 20, y: 60, icon: 'water', color: '#3399FF' },
  { id: '4', title: 'Food Court', x: 80, y: 20, icon: 'fast-food', color: '#FFC300' },
];

const USER_POS = { x: 50, y: 55 };

export default function MapScreen() {
  const [activeTarget, setActiveTarget] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ReactNativeZoomableView
        maxZoom={4}
        minZoom={0.5}
        initialZoom={1}
        bindToBorders={true}
        style={styles.zoomContainer}
      >
        <View style={styles.mapCanvas}>
           
           {/* FIX: Wrapped Image in a View to handle pointerEvents */}
           <View style={styles.mapImageContainer} pointerEvents="none">
             <Image
                source={require('../../assets/images/festival-map.png')}
                style={styles.mapImage}
                resizeMode="cover"
             />
           </View>

           {/* Markers */}
           {MARKERS.map((marker) => (
               <TouchableOpacity
                 key={marker.id}
                 style={[styles.marker, { left: `${marker.x}%`, top: `${marker.y}%`, borderColor: marker.color }]}
                 onPress={() => setActiveTarget(marker.id)}
               >
                  <Ionicons name={marker.icon} size={18} color={marker.color} />
               </TouchableOpacity>
           ))}

           {/* User Position */}
           <View style={[styles.userDot, { left: `${USER_POS.x}%`, top: `${USER_POS.y}%` }]}>
              <View style={styles.userDotPulse} />
           </View>
        </View>
      </ReactNativeZoomableView>

      {/* Navigation UI */}
      {activeTarget && (
          <View style={styles.navPanel}>
              <View>
                <Text style={styles.navLabel}>NAVIGATING TO:</Text>
                <Text style={styles.navTitle}>{MARKERS.find(m => m.id === activeTarget)?.title}</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveTarget(null)} style={styles.closeBtn}>
                  <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
          </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  zoomContainer: { flex: 1 },
  mapCanvas: { width: screenWidth, height: screenHeight, position: 'relative' },
  mapImageContainer: { width: '100%', height: '100%', position: 'absolute' }, // Added
  mapImage: { width: '100%', height: '100%' },
  marker: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(30,30,30,0.95)',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -18,
    marginTop: -18,
    zIndex: 10,
  },
  userDot: { position: 'absolute', width: 20, height: 20, backgroundColor: '#4285F4', borderRadius: 10, borderWidth: 2, borderColor: 'white', marginLeft: -10, marginTop: -10, zIndex: 5 },
  userDotPulse: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#4285F4', opacity: 0.4, transform: [{ scale: 1.8 }] },
  navPanel: { position: 'absolute', bottom: 40, left: 20, right: 20, backgroundColor: 'rgba(20, 20, 20, 0.95)', padding: 15, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeftWidth: 5, borderLeftColor: '#03DAC6' },
  navLabel: { color: '#aaa', fontSize: 10, fontWeight: 'bold' },
  navTitle: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  closeBtn: { backgroundColor: '#333', padding: 8, borderRadius: 20 },
});