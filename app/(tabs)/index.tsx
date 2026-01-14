import { Image } from 'react-native';
import { ScrollView, StyleSheet } from 'react-native';
import { Link, LinkTrigger } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';


type EventItem = {
  id: number;
  title: string;
  date: string;
  place: string;
  picture: any;
};

export default function HomeScreen() {
  const event: EventItem = { id: 0, title: '', date: '', place: '', picture: null };

  const Events: EventItem[] = [
    {
      ...event,
      id: 1,
      title: 'Cocomelon',
      date: '1969',
      place: 'Birmingham',
      picture: require('@/assets/images/widebinkydog.png'),
    },
    {
      ...event,
      id: 2,
      title: 'Pisdrink',
      date: '909900',
      place: 'KKK',
      picture: require('@/assets/images/firebase.png'),
    },
    {
      ...event,
      id: 3,
      title: 'hi',
      date: 'im',
      place: 'dave',
      picture: require('@/assets/images/favicon.png'),
    },
  ];

  return (
    <>
      <ScrollView contentContainerStyle={styles.eventListContainer}>
        {Events.map((event) => (
          <Link
            key={event.id}
            style={styles.link}
            href={{
              pathname: '/modalEvent',
              params: {
                id: event.id,
                title: event.title,
                date: event.date,
              },
            }}
          >
            <LinkTrigger>
              <ThemedView style={styles.view}>
                <Image source={event.picture} style={styles.eventPicture} />
                <ThemedText type="title">{event.title}</ThemedText>
                <ThemedText>{event.date}</ThemedText>
                <ThemedText>{event.place}</ThemedText>
              </ThemedView>
            </LinkTrigger>
          </Link>
        ))}
      </ScrollView>

      {/* Optional floating SOS button (uncomment if needed)
      <ThemedView pointerEvents="box-none" style={styles.overlay}>
        <ThemedView pointerEvents="box-none" style={styles.sosFloat}>
          <SosButton />
        </ThemedView>
      </ThemedView>
      */}
    </>
  );
}

const styles = StyleSheet.create({
  eventListContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 40,
    gap: 30,
  },
  link: {
    padding: 10,
    minHeight: 300,
    maxHeight: 400,
    borderRadius: 15,
    borderWidth: 6,
    borderColor: '#2ba84a',
    backgroundColor: '#181d27',
    overflow: 'hidden',
  },
  eventPicture: {
    maxHeight: 180,
    maxWidth: 380,
    resizeMode: 'cover',
    borderRadius: 10,
    backgroundColor: '#181d27',
  },
  view: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#181d27',
    gap: 6,
  },

  // Full-screen overlay above everything (for floating button etc.)
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  sosFloat: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    zIndex: 10000,
    elevation: 10000,
  },
});
