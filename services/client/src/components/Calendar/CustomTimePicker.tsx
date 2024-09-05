import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

interface TimePickerTypes {
  title: string;
  currentTime?: string;
  value: Date;
  setValue: any;
  isDark: boolean;
}

const CustomTimePicker: React.FC<TimePickerTypes> = ({
  title,
  value,
  currentTime,
  setValue,
  isDark,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Toggle the visibility of the time picker for Android
  const handleShowPicker = () => {
    setShowPicker(true);
  };

  // Handle time change and hide picker after selection
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false); // Close the picker after selection on Android
    }
    if (selectedTime) {
      setValue(selectedTime); // Update the parent component with the selected time
    }
  };

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
      <Text style={styles.label}>
        {title}: {currentTime ? currentTime : moment(value).format("HH:mm")}
      </Text>
      {Platform.OS === "ios" ? (
        // iOS DateTimePicker displayed inline
        <View style={styles.flexrow}>
          <DateTimePicker
            value={value}
            mode="time"
            display="default"
            onChange={handleTimeChange}
            style={{ width: 100 }}
          />
        </View>
      ) : (
        // Android DateTimePicker shown on button press
        <View style={styles.flexrow}>
          <Button title="Set Time" onPress={handleShowPicker} />
          {showPicker && (
            <DateTimePicker
              value={value}
              mode="time"
              display="default"
              is24Hour={true}
              onChange={handleTimeChange}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default CustomTimePicker;
