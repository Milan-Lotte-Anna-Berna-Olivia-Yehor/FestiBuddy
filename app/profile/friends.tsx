import { Stack, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Friends() {
  const router = useRouter();

   return (
     <>
       <Stack.Screen options={{ headerShown: true, title: '', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', headerTitleStyle: { color: '#fff' }, headerShadowVisible: false}} />
       <View style={styles.container}>
       {/* Page title */}
       <Text style={styles.title}>Friends</Text>

       <View style={styles.thinLine} />

       <View style={styles.searchBar}>
         <TouchableOpacity>
           <Image source={require('../../assets/images/friends_search-removebg-preview.png')} style={styles.searchIcon} />
         </TouchableOpacity>
         <TextInput style={styles.searchInput} placeholder="Search users" placeholderTextColor="#666" />
       </View>

       <View style={{ height: 20 }} /> {/* space */}

       {/* Friends list */}
       <View style={styles.friendContainer}>
         <View style={styles.profilePic}></View>
         <View style={styles.friendDetails}>
           <Text style={styles.username}>John Doe</Text>
           <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/profile/message', params: { friendName: 'John Doe' } })}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <Image source={require('../../assets/images/friends_message-removebg-preview.png')} style={styles.buttonIcon} />
               <Text style={styles.buttonText}>Message</Text>
             </View>
           </TouchableOpacity>
           <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/profile/share_location', params: { friendName: 'John Doe' } })}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <Image source={require('../../assets/images/friends_location-removebg-preview.png')} style={styles.buttonIcon} />
               <Text style={[styles.buttonText, { color: '#ff66c4' }]}>Share Location</Text>
             </View>
           </TouchableOpacity>
         </View>
         <TouchableOpacity style={styles.removeButton} onPress={() => alert('Delete John Doe')}>
           <Image source={require('../../assets/images/friends_remove-removebg-preview.png')} style={styles.removeIcon} />
         </TouchableOpacity>
       </View>

       <View style={styles.thinLine} />

       <View style={styles.friendContainer}>
         <View style={styles.profilePic}></View>
         <View style={styles.friendDetails}>
           <Text style={styles.username}>Jane Smith</Text>
           <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/profile/message', params: { friendName: 'Jane Smith' } })}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <Image source={require('../../assets/images/friends_message-removebg-preview.png')} style={styles.buttonIcon} />
               <Text style={styles.buttonText}>Message</Text>
             </View>
           </TouchableOpacity>
           <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/profile/share_location', params: { friendName: 'Jane Smith' } })}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <Image source={require('../../assets/images/friends_location-removebg-preview.png')} style={styles.buttonIcon} />
               <Text style={[styles.buttonText, { color: '#ff66c4' }]}>Share Location</Text>
             </View>
           </TouchableOpacity>
         </View>
         <TouchableOpacity style={styles.removeButton} onPress={() => alert('Delete Jane Smith')}>
           <Image source={require('../../assets/images/friends_remove-removebg-preview.png')} style={styles.removeIcon} />
         </TouchableOpacity>
       </View>

       <View style={styles.thinLine} />

       <View style={styles.friendContainer}>
         <View style={styles.profilePic}></View>
         <View style={styles.friendDetails}>
           <Text style={styles.username}>Emily Johnson</Text>
           <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/profile/message', params: { friendName: 'Emily Johnson' } })}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <Image source={require('../../assets/images/friends_message-removebg-preview.png')} style={styles.buttonIcon} />
               <Text style={styles.buttonText}>Message</Text>
             </View>
           </TouchableOpacity>
           <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '/profile/share_location', params: { friendName: 'Emily Johnson' } })}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <Image source={require('../../assets/images/friends_location-removebg-preview.png')} style={styles.buttonIcon} />
               <Text style={[styles.buttonText, { color: '#ff66c4' }]}>Share Location</Text>
             </View>
           </TouchableOpacity>
         </View>
         <TouchableOpacity style={styles.removeButton} onPress={() => alert('Delete Emily Johnson')}>
           <Image source={require('../../assets/images/friends_remove-removebg-preview.png')} style={styles.removeIcon} />
         </TouchableOpacity>
       </View>

       <View style={styles.thinLine} />

    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#000' },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 10, color: '#fff' },
  thinLine: { height: 1, backgroundColor: '#fff', width: '100%', marginVertical: 5 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2e2e2e', height: 40, borderRadius: 20, paddingHorizontal: 10, width: '100%', marginVertical: 10 },
  searchInput: { flex: 1, color: '#fff' },
  searchIcon: { width: 20, height: 20, marginRight: 10 },
  friendContainer: { flexDirection: 'row', alignItems: 'flex-start', width: '100%', paddingVertical: 10 },
  profilePic: { width: 70, height: 70, backgroundColor: '#87ceeb', borderRadius: 10, marginRight: 10 },
  friendDetails: { flex: 1 },
  username: { fontSize: 18, color: '#fff', marginBottom: 10 },
  button: { backgroundColor: '#2e2e2e', borderRadius: 15, paddingVertical: 5, paddingHorizontal: 10, marginVertical: 2, alignSelf: 'flex-start' },
  buttonText: { color: '#b0ff4b', fontSize: 14 },
  buttonIcon: { width: 16, height: 16, marginRight: 5 },
  removeButton: { alignSelf: 'flex-start', marginTop: 10 },
  removeIcon: { width: 24, height: 24 },
});
