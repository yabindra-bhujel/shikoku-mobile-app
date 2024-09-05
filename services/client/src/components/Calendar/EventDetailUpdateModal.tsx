import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import CalenderService from "@/src/api/CalenderService";
import CustomDatePicker from "./CustomDatePicker";
import CustomTimePicker from "./CustomTimePicker";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import moment from 'moment-timezone';

const EventModal = ({
  visible,
  event,
  onClose,
  onDelete,
  isDark,
  onUpdate,
}) => {
  const today = new Date();

  // Function to create a date object with a specific time
  const setSpecificTime = (date, timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(seconds || 0);
    newDate.setMilliseconds(0);
    return newDate;
  };

  // Initial state values
  const initialStartTime = setSpecificTime(today, "09:00:00");
  const initialEndTime = setSpecificTime(today, "18:00:00");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setDescription(event.description || "");

      const parsedStartDate = event.start ? new Date(event.start) : today;
      const parsedEndDate = event.end ? new Date(event.end) : today;
      setStartDate(isNaN(parsedStartDate.getTime()) ? today : parsedStartDate);
      setEndDate(isNaN(parsedEndDate.getTime()) ? today : parsedEndDate);

      // Extract and set the start and end times from the event
      const parsedStartTime = event.startTime ? setSpecificTime(today, event.startTime) : initialStartTime;
      const parsedEndTime = event.endTime ? setSpecificTime(today, event.endTime) : initialEndTime;
      setStartTime(isNaN(parsedStartTime.getTime()) ? initialStartTime : parsedStartTime);
      setEndTime(isNaN(parsedEndTime.getTime()) ? initialEndTime : parsedEndTime);
    } else {
      setStartTime(initialStartTime);
      setEndTime(initialEndTime);
    }
  }, [event]);

  const handleSave = async () => {
    if (!title) {
      Alert.alert("Please enter title");
      return;
    }

    // Validate dates and times
    if (startDate > endDate) {
      Alert.alert("Error", "Start date cannot be later than end date.");
      return;
    }
    if (startDate.getTime() === endDate.getTime() && startTime > endTime) {
      Alert.alert("Error", "Start time cannot be later than end time on the same date.");
      return;
    }

    let start =
      startDate.toISOString().split("T")[0] +
      "T" +
      moment(startTime).format("HH:mm:ss"); 
    let end =
      endDate.toISOString().split("T")[0] + "T" + moment(endTime).format("HH:mm:ss"); 

    const eventData = {
      title,
      description,
      start,
      end,
    };
    
    try {
      const res = await CalenderService.updateEvent(event.id, eventData);
      if (res) {
        onClose();
        onUpdate();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update event");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await CalenderService.deleteEvent(event.id);
      if (res) {
        onDelete(event);
        onClose();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete event");
    }
  };

  if (!event) {
    return null;
  }

  const handleSelectStartTime = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setStartTime(selectedDate || startTime);
  };

  const handleSelectEndTime = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setEndTime(selectedDate || endTime);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View
          style={[
            styles.container,
            { backgroundColor: isDark ? "#333" : "#ddd" },
          ]}
        >
          <View
            style={[
              styles.headerContainer,
              { backgroundColor: isDark ? "#333" : "#0073e6" },
            ]}
          >
            <Text style={styles.headerText}>Edit event</Text>
          </View>
          <ScrollView style={styles.bodyContainer}>
            <Text
              style={[
                styles.label,
                {
                  color: isDark ? "#ddd" : "#333",
                },
              ]}
            >
              Title
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? "#111" : "#fff",
                  color: isDark ? "#fff" : "#000",
                },
              ]}
              value={title}
              onChangeText={setTitle}
            />
            <Text
              style={[
                styles.label,
                {
                  color: isDark ? "#ddd" : "#000",
                },
              ]}
            >
              Description
            </Text>
            <TextInput
              editable
              multiline
              style={[
                styles.descriptionInput,
                {
                  backgroundColor: isDark ? "#111" : "#fff",
                  color: isDark ? "#fff" : "#000",
                },
              ]}
              numberOfLines={5}
              maxLength={200}
              value={description}
              onChangeText={(text) => setDescription(text)}
              placeholder="Enter event description"
              placeholderTextColor={"gray"}
            />
            <CustomDatePicker
              title="Start Date"
              show={showStartDatePicker}
              setShow={() => setShowStartDatePicker(!showStartDatePicker)}
              value={startDate}
              customHandle={(event, selectedDate) => {
                const currentDate = selectedDate || startDate;
                setShowStartDatePicker(false);
                setStartDate(currentDate);
              }}
              isDark={isDark}
            />
            <CustomDatePicker
              title="End Date"
              show={showEndDatePicker}
              setShow={() => setShowEndDatePicker(!showEndDatePicker)}
              value={endDate}
              customHandle={(event, selectedDate) => {
                const currentDate = selectedDate || endDate;
                setShowEndDatePicker(false);
                setEndDate(currentDate);
              }}
              isDark={isDark}
            />
            <View style={styles.timesContainer}>
              <CustomTimePicker
                title="Start Time"
                value={startTime}
                setValue={handleSelectStartTime}
                isDark={isDark}
              />
              <CustomTimePicker
                title="End Time"
                value={endTime}
                setValue={handleSelectEndTime}
                isDark={isDark}
              />
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    width: "90%",
    borderRadius: 10,
  },
  headerContainer: {
    padding: 25,
    borderRadius: 10,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  bodyContainer: {
    marginTop: 10,
    padding: 15,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#40AAFF",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  descriptionInput: {
    height: 150,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  timesContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EventModal;
