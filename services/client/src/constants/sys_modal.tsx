import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import StyledButton2 from "../components/StyledButton2";
import { AntDesign } from "@expo/vector-icons";

const SysModal = ({
  visible,
  onHide,
  onCreateEvent,
}: {
  visible: any;
  onHide: any;
  onCreateEvent: any;
}) => {
  const today = new Date();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [startTime, setStartTime] = useState(today);
  const [endTime, setEndTime] = useState(today);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleCreateEvent = () => {
    if (title.trim() === "") {
      alert("Please fill in the event title");
      return;
    }
    if (endDate < startDate) {
      alert("End date cannot be before start date");
      return;
    }
    if (endTime < startTime) {
      alert("End time cannot be before start time");
      return;
    }
    onCreateEvent(
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0],
      title,
      description,
      startTime,
      endTime
    );
    setTitle("");
  };

  const handleStartDateChange = (event, date) => {
    const currentDate = date || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event, date) => {
    const currentDate = date || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.container}>
        <View style={styles.modal}>
          <LinearGradient
            colors={["#2F6982", "#0A171C"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.headerContainer}
          >
            <Text style={styles.headerText}>Create an Event</Text>
          </LinearGradient>
          <ScrollView style={{ backgroundColor: "#ddd" }}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Event Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter event title"
                value={title}
                onChangeText={(text) => setTitle(text)}
                placeholderTextColor={"gray"}
              />
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <TextInput
                editable
                multiline
                style={styles.descriptionInput}
                numberOfLines={4}
                maxLength={40}
                value={description}
                onChangeText={(text) => setDescription(text)}
                placeholder="Enter event description"
                placeholderTextColor={"gray"}
              />
            </View>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePicker}>
                <Text style={styles.selectedDate}>
                  Start Date: {startDate.toISOString().split("T")[0]}
                </Text>
                <AntDesign
                  name="calendar"
                  size={35}
                  color="blue"
                  onPress={() => setShowStartDatePicker(true)}
                />
              </View>
              <Modal visible={showStartDatePicker} transparent animationType="slide">
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <DateTimePicker
                      testID="startDatePicker"
                      value={startDate}
                      mode="date"
                      display="inline"
                      onChange={handleStartDateChange}
                      style={styles.datePickerButton}
                    />
                    <TouchableOpacity style={{ padding: 12 }}>
                      <Text
                        onPress={() => setShowStartDatePicker(false)}
                        style={{ color: "#fff", padding: 20, fontSize: 18 }}
                      >
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePicker}>
                <Text style={styles.selectedDate}>
                  End Date: {endDate.toISOString().split("T")[0]}
                </Text>
                <AntDesign
                  name="calendar"
                  size={35}
                  color="blue"
                  onPress={() => setShowEndDatePicker(true)}
                />
              </View>
              <Modal visible={showEndDatePicker} transparent animationType="slide">
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <DateTimePicker
                      testID="endDatePicker"
                      value={endDate}
                      mode="date"
                      display="inline"
                      onChange={handleEndDateChange}
                      style={styles.datePickerButton}
                    />
                    <TouchableOpacity style={{ padding: 12 }}>
                      <Text
                        onPress={() => setShowEndDatePicker(false)}
                        style={{ color: "#fff", padding: 20, fontSize: 18 }}
                      >
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            <View style={styles.timeFieldContainer}>
              <View style={styles.setTimeField}>
                <Text style={styles.label}>Start Time:</Text>
                <View style={styles.flexrow}>
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="default"
                    onChange={(event, selectedDate) =>
                      setStartTime(selectedDate || startTime)
                    }
                  />
                </View>
              </View>
              <View style={styles.setTimeField}>
                <Text style={styles.label}>End Time:</Text>
                <View>
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="default"
                    onChange={(event, selectedDate) =>
                      setEndTime(selectedDate || endTime)
                    }
                    textColor={"red"}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={styles.btnContainer}>
            <StyledButton2
              title={"Cancel"}
              handlePress={onHide}
              background={"red"}
            />
            <StyledButton2 title={"Save"} handlePress={handleCreateEvent} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SysModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    width: "90%",
    height: 750,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  headerContainer: {
    padding: 25,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    alignItems: "center",
  },
  inputContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    padding: 10,
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionContainer: {
    marginHorizontal: 20,
  },
  descriptionTitle: {
    marginTop: 10,
    fontSize: 16,
  },
  descriptionInput: {
    height: 150,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  datePickerContainer: {
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  selectedDate: {
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "90%",
    margin: 20,
    height: 400,
    backgroundColor: "#222",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  timeFieldContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ccc",
    width: "100%",
    padding: 20,
  },
  btn: {
    padding: 16,
    backgroundColor: "blue",
    borderRadius: 10,
  },
  btnTitle: {
    color: "white",
  },
  label: {
    fontSize: 16,
  },
  setTimeField: {
    flexDirection: "row",
    marginTop: 15,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
    width: "90%",
  },
  datePickerButton: {
    width: "90%",
    flex: 1,
  },
  flexrow: {
    flexDirection: "row",
  },
});
