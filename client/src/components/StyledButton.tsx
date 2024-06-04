import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import React from "react";

const StyledButton: React.FC<any> = ({ handlePress, title, icon, otherstyle }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={handlePress} >
      <Text style={styles.buttonText}>{title}</Text>
      {icon}
    </TouchableOpacity>
  );
};

export default StyledButton;

const styles = StyleSheet.create({
  textInputField: {
    height: 53,
    width: "100%",
  },
  button: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    height: 53,
    marginVertical: 20,
    marginHorizontal: 36,
    borderRadius: 5,
    backgroundColor: "#4785FC",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
