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
  width?: number | string;
}

const StyledButton2 = (
props: props) => {
  const styles = StyleSheet.create({
    button: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-around",
      borderRadius: 10,
      width: (props.width = 90),
      backgroundColor: (props.background = "#3399ff"),
    },
    buttonText: {
      padding: 15,
      color: (props.color = "white"),
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  return (
    <TouchableOpacity style={styles.button} onPress={props.handlePress}>
      <Text style={styles.buttonText}>{props.title}</Text>
      {props.icon}
    </TouchableOpacity>
  );
};

export default StyledButton2;
