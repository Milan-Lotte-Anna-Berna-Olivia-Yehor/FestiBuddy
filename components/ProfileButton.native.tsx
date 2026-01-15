import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet } from 'react-native';

export function ProfileButton() {
  return (
    <Link href="/profile" asChild>
      <Pressable style={styles.button} accessibilityLabel="Profile">
        <Image
          source={require('@/assets/images/home_profile-removebg-preview.png')}
          style={styles.avatar}
        />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 18,
  },
});

export default ProfileButton;
