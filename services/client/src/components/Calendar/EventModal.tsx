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
import moment from "moment-timezone";
import DateTimePicker from "@react-native-community/datetimepicker";

const EventModal = ({ visible, event, onClose, onDelete, isDark, onUpdate }) => {
  const today = moment().tz("Asia/Tokyo").toDate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDateTime, setStartDateTime] = useState(today);
  const [endDateTime, setEndDateTime] = useState(today);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setDescription(event.description || "");
      setStartDateTime(event.startTime ? new Date(event.startTime) : today);
      setEndDateTime(event.endTime ? new Date(event.endTime) : today);
    }
  }, [event]);

  const handleSave = async () => {
    if (!title) {
      Alert.alert("Please enter title");
      return;
    }

    const eventData = {
      title,
      description,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
    };

    // Try to save the event (pseudo-code, replace with actual API call)
    // try {
    //   const res = await CalenderService.updateEvent(event.id, eventData);
    //   if (res) {
    //     onClose();
    //     onUpdate();
    //   }
    // } catch (error) {
    //   Alert.alert("Error", "Failed to update event");
    // }
  };

  const handleDelete = async () => {
    // Try to delete the event (pseudo-code, replace with actual API call)
    // try {
    //   const res = await CalenderService.deleteEvent(event.id);
    //   if (res) {
    //     onDelete(event);
    //     onClose();
    //   }
    // } catch (error) {
    //   Alert.alert("Error", "Failed to delete event");
    // }
  };

  if (!event) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Edit event</Text>
          </View>
          <ScrollView style={styles.bodyContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
              <Text style={styles.label}>Start Date</Text>
              <Text style={styles.dateText}>
                {startDateTime.toISOString().split("T")[0]}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
              <Text style={styles.label}>End Date</Text>
              <Text style={styles.dateText}>
                {endDateTime.toISOString().split("T")[0]}
              </Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDateTime}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowStartDatePicker(false);
                  setStartDateTime(date || startDateTime);
                }}
              />
            )}
            {showEndDatePicker && (
              <DateTimePicker
                value={endDateTime}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowEndDatePicker(false);
                  setEndDateTime(date || endDateTime);
                }}
              />
            )}
            <DateTimePicker
              value={startDateTime}
              mode="time"
              display="default"
              onChange={(event, date) => {
                setStartDateTime(date || startDateTime);
              }}
            />
            <DateTimePicker
              value={endDateTime}
              mode="time"
              display="default"
              onChange={(event, date) => {
                setEndDateTime(date || endDateTime);
              }}
            />
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
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  headerContainer: {
    padding: 25,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
    backgroundColor: "#00bfff",
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
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
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
  dateText: {
    padding: 10,
    fontSize: 16,
  },
});

export default EventModal;
