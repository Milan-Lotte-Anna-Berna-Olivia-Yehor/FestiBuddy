import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { SosButton } from '@/components/SOSButton.native'; // <-- adjust if your path/name differs

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.root}>
        <Stack>
          <Stack.Screen name="auth/Login" options={{ headerShown: false }} />
          {/* other screens are still handled by the router */}
        </Stack>

        {/* ✅ GLOBAL SOS BUTTON OVERLAY */}
        <View pointerEvents="box-none" style={styles.overlay}>
          <View pointerEvents="auto" style={styles.sosFloat}>
            <SosButton />
          </View>
        </View>

        <StatusBar style="auto" />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999, // Android
  },

  sosFloat: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    zIndex: 10000,
    elevation: 10000,
  },
});
