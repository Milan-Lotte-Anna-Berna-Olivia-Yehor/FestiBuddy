import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSearchParams } from 'expo-router/build/hooks';

export default function ModalScreen() {

  const params = useSearchParams();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">id: {params.get("id")}</ThemedText>
      <ThemedText type="title">title: {params.get("title")}</ThemedText>
      <ThemedText type="title">date: {params.get("date")}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
