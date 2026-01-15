import { ThemedView } from '@/components/themed-view';
import { ScrollView } from 'react-native';

export default function TabTwoScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flex: 1 }}></ScrollView>
    </ThemedView>
  );
}