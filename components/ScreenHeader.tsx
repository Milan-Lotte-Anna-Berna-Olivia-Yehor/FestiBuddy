import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  title: string;
  onRightPress?: () => void;
  rightIcon?: string;
}

export const ScreenHeader = ({ title, onRightPress, rightIcon }: Props) => {
  const router = useRouter();
  
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.button}>
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>{title}</Text>
      
      {/* Pravé tlačidlo (voliteľné) alebo prázdny priestor pre zarovnanie */}
      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.button}>
           {/* @ts-ignore */}
           <Ionicons name={rightIcon} size={24} color="#FFF" />
        </TouchableOpacity>
      ) : (
        <View style={styles.button} /> // Placeholder aby bol nadpis v strede
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});