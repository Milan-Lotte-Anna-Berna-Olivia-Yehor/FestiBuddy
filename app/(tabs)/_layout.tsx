import { HapticTab } from '@/components/haptic-tab';
import ProfileButton from '@/components/ProfileButton.native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router'; // <--- MUST import Tabs
import { Image, Text, View } from 'react-native'; // <--- Must import these

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: { backgroundColor: '#000' },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          headerShown: true,
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../../assets/images/app_logo_music_note_-removebg-preview.png')}
                style={{ width: 50, height: 50, marginRight: 0.5 }}
              />
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                festibuddy
              </Text>
            </View>
          ),
          headerRight: () => <ProfileButton />,
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }: { color: string }) => (
            <Image
              source={require('../../assets/images/home_schedule-removebg-preview.png')}
              style={{ width: 28, height: 28 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }: { color: string }) => (
            <Image
              source={require('../../assets/images/home_map-removebg-preview.png')}
              style={{ width: 28, height: 28 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="sos"
        options={{
          title: "SOS",
          tabBarIcon: ({ color }: { color: string }) => (
            <Image
              source={require('../../assets/images/home_sos-removebg-preview.png')}
              style={{ width: 28, height: 28 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'AI Assistant',
          tabBarIcon: ({ color }: { color: string }) => (
            <Image
              source={require('../../assets/images/home_ai-removebg-preview.png')}
              style={{ width: 28, height: 28 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
