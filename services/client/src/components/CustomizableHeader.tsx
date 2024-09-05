import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import SafeAreaView from 'react-native-safe-area-view';

interface HeaderProps {
  onBackPress?: () => void;
  isDark?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onBackPress, isDark = false }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["rgba(181,217,211,1)", "rgba(148,187,233,1)"]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerContainer}
      >
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 10,
  },
  backButton: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
