import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo, or replace with your icon library

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, onBackPress, rightComponent }) => {
  const isDark = useColorScheme() === "dark";
  return (
    <View style={[styles.headerContainer, {
      backgroundColor: isDark ? "#333" : "#fff",
    }]}>
      {onBackPress && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={
            isDark ? "#fff" : "#333"
          } />
        </TouchableOpacity>
      )}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, {
          color: isDark ? "#fff" : "#333",
        }]}>{title}</Text>
      </View>
      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    paddingHorizontal: 10,
  },
  backButton: {
    width: 50, // Adjust to fit the icon
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rightContainer: {
    width: 50, // Adjust to fit the custom component
    justifyContent: "center",
    alignItems: "center",
  },
});
