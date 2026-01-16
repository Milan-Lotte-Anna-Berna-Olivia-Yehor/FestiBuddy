import { Link, LinkTrigger } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { usePathname, useSearchParams } from 'expo-router/build/hooks';
import { Events } from '@/constants/eventList'
import { Image } from 'react-native';
import { ScrollView } from 'react-native';
import { db } from '@/firebase/firebaseConfig';
import { collection, getDocs } from "firebase/firestore";

async function testFirestore() {
  const usersCol = collection(db, "sers");
  const usersSnapshot = await getDocs(usersCol);
  const usersList = usersSnapshot.docs.map(doc => doc.data())
  console.log(usersList);
}

export default function ModalScreen() {

  const params = useSearchParams();
  let event = Events.find(ev => ev.id.toString() === params.get("id"))
  testFirestore()

  return (
    <ScrollView contentContainerStyle = {styles.scrollView}>
      <ThemedView style={styles.container}>
        <Image source={event?.picture} style={styles.image}/>
        <ThemedText type="title" style={styles.title}>{event?.title}</ThemedText>
        <ThemedText>{event?.date.toDateString()} at {event?.date.toLocaleTimeString()}</ThemedText>
        <ThemedText>📍 {event?.place}</ThemedText>
        <Link href={{
          pathname: '/(tabs)/schedule',
          params: {
            id: event?.id
          }
        }}>
          <LinkTrigger>
            <ThemedText type='link'>See schedule with artists for this event...</ThemedText>
          </LinkTrigger>
        </Link>
        <ThemedText type='subtitle' style={styles.description}>Description:</ThemedText>
        <ThemedText>{event?.description}</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"

  },
  image: {
    width: "100%",
    maxHeight: 400,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 30
  },
  title: {
    fontSize: 50,
    marginBottom: 20
  },
  description: {
    marginTop: 15
  }
});


