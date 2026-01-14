import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSearchParams } from 'expo-router/build/hooks';
import { Events } from '@/constants/eventList'
import { Image } from 'react-native';
import { ScrollView } from 'react-native';

export default function ModalScreen() {

  const params = useSearchParams();
  let event = Events.find(ev => ev.id.toString() === params.get("id"))
  
  return (
    <ScrollView contentContainerStyle = {styles.scrollView}>
      <ThemedView style={styles.container}>
        <Image source={event?.picture ?? require("@/assets/images/icon.png")}/>
        <ThemedText type="title">title: {params.get("title")}</ThemedText>
        <ThemedText type="title">date: {params.get("date")}</ThemedText>
      </ThemedView>
    </ScrollView>
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
  scrollView: {
    flex: 1,
    flexDirection: "column",
    
  }
});
