import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, LinkTrigger } from 'expo-router';
import { Image, ScrollView, StyleSheet } from 'react-native';

export default function HomeScreen() {
  
  const event = { id: 0, title:"", date: "", place: "", picture: ""}

  const Events =[
    {...event, id: 1, title: "Cocomelon", date: "1969", place: "Birmingham", picture: require('@/assets/images/widebinkydog.png')},
    {...event, id: 2, title: "Pisdrink", date: "909900", place: "KKK", picture: require('@/assets/images/firebase.png')},
    {...event, id: 3, title: "hi", date: "im", place: "dave", picture: require('@/assets/images/favicon.png')}
  ]

  return (
    <ScrollView contentContainerStyle={styles.eventListContainer}>
      {Events.map(event =>{
        const modalLink = `/modalEvent?id=${event.id}`

        return(
          <Link style={styles.link} href={{
            pathname: "/modalEvent",
            params: {
              id: event.id,
              title: event.title,
              date: event.date
            }
          }}>
            <LinkTrigger>
              <ThemedView style={styles.view}>
                <Image source={event.picture} style={styles.eventPicture}/>
                <ThemedText type='title'>{event.title}</ThemedText>
                <ThemedText>{event.date.toString()}</ThemedText>
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
    backgroundColor: "#181d27",
  }
})
