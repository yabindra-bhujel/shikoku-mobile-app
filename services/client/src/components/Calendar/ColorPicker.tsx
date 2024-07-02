import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";

const ColorPicker = ({color, setColor}: {color: string, setColor: any}) => {
  return (
    <View style={{
      width: "90%",
      backgroundColor: '#fff',
      marginTop: 10,
      borderRadius: 10,
      padding: 10,
    }}>
      <Text style={{
        fontSize: 16,
      }}>Choose dot Color : </Text>
      <Picker
        selectedValue={color}
        onValueChange={(itemValue, itemIndex) => setColor(itemValue)}
        style={{
          width: "100%",
          color: "#fff",
        }}
      >
        <Picker.Item label="Red" value="red" />
        <Picker.Item label="Pink" value="pink" />
        <Picker.Item label="Blue" value="blue" />
        <Picker.Item label="Green" value="green" />
      </Picker>
    </View>
  );
};

export default ColorPicker;

const styles = StyleSheet.create({});
