import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../firebase/firebaseConfig";

// Komponent pre jednu položku v menu
const ProfileMenuItem = ({ icon, label, onPress, isDestructive = false, value = "" }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIconBox, isDestructive && styles.destructiveIconBox]}>
      <Ionicons name={icon} size={20} color={isDestructive ? "#FF3B30" : "#FFF"} />
    </View>
    <Text style={[styles.menuText, isDestructive && styles.destructiveText]}>{label}</Text>
    {value ? <Text style={styles.menuValue}>{value}</Text> : null}
    <Ionicons name="chevron-forward" size={20} color="#666" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("user@festibuddy.com");
  const [isBraceletPaired, setIsBraceletPaired] = useState(false);

  // Načítanie dát pri každom zobrazení
  useFocusEffect(
    useCallback(() => {
      const user = auth.currentUser;
      if (user?.email) setUserEmail(user.email);
      
      // Check či je náramok spárovaný (simulácia cez AsyncStorage)
      checkBraceletStatus();
    }, [])
  );

  const checkBraceletStatus = async () => {
      // Tu by sme reálne checkovali bluetooth status
      const paired = await AsyncStorage.getItem("isBraceletPaired"); 
      setIsBraceletPaired(paired === "true");
  };

  // ✅ OPRAVENÝ LOGOUT
  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth); // Odhlásenie z Firebase
            await AsyncStorage.clear(); // Vyčistenie lokálnych dát
            router.replace("/"); // Presmerovanie na Welcome Screen
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* HEADER */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Profile</Text>
            <TouchableOpacity onPress={() => router.push("/profile/settings")}>
                <Ionicons name="settings-outline" size={24} color="#FFF" />
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* USER CARD */}
            <View style={styles.userCard}>
                <View style={styles.avatarContainer}>
                    <Image 
                        source={require("../../assets/images/home_profile-removebg-preview.png")} 
                        style={styles.avatar} 
                    />
                    <View style={styles.editBadge}>
                        <Ionicons name="pencil" size={12} color="#000" />
                    </View>
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>Festival Fanatic</Text>
                    <Text style={styles.userEmail}>{userEmail}</Text>
                    <View style={styles.rankBadge}>
                        <Text style={styles.rankText}>VIP MEMBER</Text>
                    </View>
                </View>
            </View>

            {/* BRACELET STATUS WIDGET */}
            <View style={styles.widgetRow}>
                <TouchableOpacity 
                    style={[styles.statusWidget, isBraceletPaired ? styles.widgetActive : styles.widgetInactive]}
                    onPress={() => router.push("/profile/pair_bracelet")}
                >
                    <Ionicons name={isBraceletPaired ? "bluetooth" : "bluetooth-outline"} size={24} color="#FFF" />
                    <View>
                        <Text style={styles.widgetLabel}>Bracelet</Text>
                        <Text style={[styles.widgetValue, {color: isBraceletPaired ? '#7CFF00' : '#888'}]}>
                            {isBraceletPaired ? "Connected 🔋 84%" : "Not Paired"}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* SEKCIA 1: FESTIVAL TOOLS */}
            <Text style={styles.sectionTitle}>Festival Essentials</Text>
            <View style={styles.menuGroup}>
                <ProfileMenuItem 
                    icon="wallet-outline" 
                    label="Wallet & Top-up" 
                    value="€45.50"
                    onPress={() => router.push("/profile/wallet")} 
                />
                <ProfileMenuItem 
                    icon="key-outline" 
                    label="My Locker" 
                    onPress={() => router.push("/profile/locker")} 
                />
                <ProfileMenuItem 
                    icon="qr-code-outline" 
                    label="My Ticket" 
                    onPress={() => {}} // TODO: Add ticket screen
                />
            </View>

            {/* SEKCIA 2: SOCIAL */}
            <Text style={styles.sectionTitle}>Social & Friends</Text>
            <View style={styles.menuGroup}>
                <ProfileMenuItem 
                    icon="people-outline" 
                    label="Friends" 
                    value="12 online"
                    onPress={() => router.push("/profile/friends")} 
                />
                <ProfileMenuItem 
                    icon="share-outline" 
                    label="Share Location" 
                    value="Active"
                    onPress={() => router.push("/profile/share_location")} 
                />
                <ProfileMenuItem 
                    icon="chatbubbles-outline" 
                    label="Messages" 
                    onPress={() => router.push("/profile/message")} 
                />
            </View>

            {/* SEKCIA 3: APP SETTINGS */}
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.menuGroup}>
                <ProfileMenuItem 
                    icon="notifications-outline" 
                    label="Notifications" 
                    onPress={() => router.push("/profile/notifications")} 
                />
                <ProfileMenuItem 
                    icon="cloud-download-outline" 
                    label="Offline Content" 
                    onPress={() => router.push("/profile/offline-content")} 
                />
                <ProfileMenuItem 
                    icon="shield-checkmark-outline" 
                    label="Privacy & Security" 
                    onPress={() => router.push("/profile/privacy")} 
                />
                <ProfileMenuItem 
                    icon="help-circle-outline" 
                    label="Help & Support" 
                    onPress={() => router.push("/profile/help-support")} 
                />
            </View>

            {/* LOGOUT BUTTON */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>FestiBuddy v1.0.2 • Build 2026</Text>
            <View style={{height: 40}} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  safeArea: { flex: 1 },
  
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 10, marginBottom: 10,
  },
  backBtn: { padding: 4 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  scrollContent: { paddingHorizontal: 20 },

  // USER CARD
  userCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A',
    borderRadius: 24, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: '#333',
  },
  avatarContainer: { position: 'relative', marginRight: 16 },
  avatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: '#7CFF00' },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0, backgroundColor: '#7CFF00',
    width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#1A1A1A'
  },
  userInfo: { flex: 1 },
  userName: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  userEmail: { color: '#888', fontSize: 14, marginBottom: 8 },
  rankBadge: {
    backgroundColor: 'rgba(124, 255, 0, 0.1)', alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    borderWidth: 1, borderColor: 'rgba(124, 255, 0, 0.3)'
  },
  rankText: { color: '#7CFF00', fontSize: 10, fontWeight: 'bold' },

  // WIDGET
  widgetRow: { marginBottom: 30 },
  statusWidget: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A',
    padding: 16, borderRadius: 16, borderWidth: 1, gap: 12,
  },
  widgetActive: { borderColor: '#7CFF00' },
  widgetInactive: { borderColor: '#333' },
  widgetLabel: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  widgetValue: { fontSize: 14, marginTop: 2 },

  // MENUS
  sectionTitle: { color: '#666', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 10, marginLeft: 10 },
  menuGroup: {
    backgroundColor: '#1A1A1A', borderRadius: 16, overflow: 'hidden', marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    borderBottomWidth: 1, borderBottomColor: '#222',
  },
  menuIconBox: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#333',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  destructiveIconBox: { backgroundColor: 'rgba(255, 59, 48, 0.1)' },
  menuText: { flex: 1, color: '#FFF', fontSize: 16 },
  destructiveText: { color: '#FF3B30' },
  menuValue: { color: '#666', fontSize: 14, marginRight: 8 },

  // LOGOUT
  logoutButton: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#333',
    backgroundColor: 'rgba(255, 59, 48, 0.05)', marginBottom: 20, gap: 8,
  },
  logoutText: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold' },
  
  versionText: { color: '#444', textAlign: 'center', fontSize: 12, marginBottom: 20 },
});