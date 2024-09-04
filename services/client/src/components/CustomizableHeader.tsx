import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaView from 'react-native-safe-area-view';

interface HeaderProps {
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBackPress }) => {
  return (
    <View style={styles.headerContainer}>
      {onBackPress && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      )}
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
    backgroundColor: "orange",
    
  },
  backButton: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },


});
