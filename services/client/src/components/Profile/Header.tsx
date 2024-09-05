import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface HeaderProps {
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBackPress }) => {
  return (
    <View>
      <LinearGradient
        colors={["rgba(181,217,211,1)", "rgba(148,187,233,1)"]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContainer}></View>
      </LinearGradient>

      <LinearGradient
        colors={["rgba(181,217,211,1)", "rgba(148,187,233,1)"]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}

      >
        <View style={styles.backButton}>
          <TouchableOpacity onPress={onBackPress}>
            <Ionicons name="chevron-back-sharp" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

    </View>

  );
};

export default Header;

const styles = StyleSheet.create({
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
