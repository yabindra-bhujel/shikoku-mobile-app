import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React from "react";

type props = {
  handlePress?: any;
  title?: string;
  icon?: any;
  background?: string;
  color?: string;
  width?: number;
}

const StyledButton2:React.FC<props> = (
{width = 120, background = "#3399ff", color = "white", handlePress, title, icon}) => {
  const styles = StyleSheet.create({
    button: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-around",
      borderRadius: 10,
      width: width,
      backgroundColor: background,
    },
    buttonText: {
      padding: 15,
      color: color,
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.buttonText}>{title}</Text>
      {icon}
    </TouchableOpacity>
  );
};

export default StyledButton2;
