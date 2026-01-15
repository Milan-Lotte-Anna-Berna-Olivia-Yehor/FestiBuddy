import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, LinkTrigger } from 'expo-router';
import { Image, ScrollView, StyleSheet } from 'react-native';
import { Events } from '@/constants/eventList'
import { useThemeColor } from '@/hooks/use-theme-color';
import { Alert } from 'react-native';

export default function HomeScreen() {

  return (
    <ScrollView contentContainerStyle={styles.eventListContainer}>
      {Events.map(event =>{
        return(
          <Link style={styles.link} href={{
            pathname: "/modalEvent",
            params: {
              id: event.id
            }
          }}>
            <LinkTrigger>
              <ThemedView style={styles.view}>
                <Image source={event.picture} style={styles.eventPicture}/>
                <ThemedText type='title'>{event.title}</ThemedText>
                <ThemedText>
                  {event.start_date.toDateString()} {event.start_date != event.end_date && event.end_date.toDateString()}
                </ThemedText>
                <ThemedText>{event.place}</ThemedText>
              </ThemedView>
            </LinkTrigger>
          </Link>
        );
      })}
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  eventListContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 40,
    gap: 30
  },
  link: {
    padding: 10,
    minHeight: 300,
    maxHeight: 400,
    borderRadius: 15,
    borderWidth: 6,
    borderColor: "#2ba84a",
    backgroundColor: "#181d27",
    overflow: "hidden",
  },
  eventPicture: {
    marginBottom: 10,
    maxHeight: 180,
    maxWidth: 380,
    resizeMode: "cover",
    borderRadius: 10,
    backgroundColor: "#181d27"
  },
  view: {
    width: "100%",
    flexDirection: "column",
    justifyContent:"center",
    backgroundColor: "#1b1d2b"
  }
})
