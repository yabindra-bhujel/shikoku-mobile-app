import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";

const ColorPicker = ({color, setColor, isDark}: {color: string, setColor: any, isDark: boolean}) => {
  return (
    <View style={{
      width: "90%",
      backgroundColor: isDark? "#aaa" : '#fff',
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
        }}
      >
        <Picker.Item label="Red" value="red"/>
        <Picker.Item label="Pink" value="pink" />
        <Picker.Item label="Blue" value="blue" />
        <Picker.Item label="Green" value="green" />
      </Picker>
    </View>
  );
};

export default ColorPicker;