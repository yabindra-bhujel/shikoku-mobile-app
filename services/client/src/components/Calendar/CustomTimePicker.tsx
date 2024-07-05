import { StyleSheet, Text, View } from "react-native";
import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";


interface TimePickerTypes {
    title: string;
    value: Date;
    setValue: any;
    isDark: boolean;
}

const CustomTimePicker: React.FC<TimePickerTypes> = ({title, value, setValue, isDark}) => {
  const styles = StyleSheet.create({
    setTimeField: {
        flexDirection: "row",
        marginTop: 15,
        borderRadius: 10,
        padding: 10,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: isDark ? "#222" : "#fafafa",
        width: "90%",
      },
      label: {
        fontSize: 16,
        color: isDark ? "white" : "black",
      },
      flexrow: {
        flexDirection: "row",
      },
});
  return (
    <View style={styles.setTimeField}>
      <Text style={styles.label}>{title}:</Text>
      <View style={styles.flexrow}>
        <DateTimePicker
          value={value}
          mode="time"
          display="default"
          onChange={setValue}
        />
      </View>
    </View>
  );
};

export default CustomTimePicker;