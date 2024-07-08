import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import CalenderService from "@/src/api/CalenderService";
import ColorPicker from "./ColorPicker";
import StyledButton2 from "../StyledButton2";
import CustomDatePicker from "./CustomDatePicker";
import moment from "moment-timezone";
import CustomTimePicker from "./CustomTimePicker";
import CustomRepeatPicker from "./CustomRepeatPicker";
import { CalendarEvent } from "../CalendarEventTypes";

interface CreateModalProps {
  visible: boolean;
  onHide: () => void | boolean;
  userId: number | any;
  onEventCreated: () => void;
  isDark: boolean;
}

const CreateModal: React.FC<CreateModalProps> = ({
  visible,
  onHide,
  userId,
  onEventCreated,
  isDark,
}) => {
  const today = moment().tz("Asia/Tokyo").toDate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [startTime, setStartTime] = useState(today);
  const [endTime, setEndTime] = useState(today);
  const [color, setColor] = useState("red");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [repeatInterval, setRepeatInterval] = useState<
    "none" | "daily" | "weekly" | "monthly" | "yearly"
  >("none");

  const handleCreateEvent = async () => {
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

    let start =
      startDate.toISOString().split("T")[0] +
      "T" +
      moment(startTime).tz("Asia/Tokyo").format("HH:mm:ss") +
      "Z";
    let end =
      endDate.toISOString().split("T")[0] +
      "T" +
      moment(endTime).tz("Asia/Tokyo").format("HH:mm:ss") +
      "Z";

    const events: CalendarEvent[] = [];
    const eventTemplate: Omit<CalendarEvent, "start" | "end"> = {
      title,
      description,
      color,
      user_id: userId,
    };

    // Add the first event
    events.push({ ...eventTemplate, start, end });

    // Generate repeating events
    let nextStartDate = moment(startDate);
    let nextEndDate = moment(endDate);

    while (repeatInterval !== "none") {
      switch (repeatInterval) {
        case "daily":
          nextStartDate.add(1, "day");
          nextEndDate.add(1, "day");
          break;
        case "weekly":
          nextStartDate.add(1, "week");
          nextEndDate.add(1, "week");
          break;
        case "monthly":
          nextStartDate.add(1, "month");
          nextEndDate.add(1, "month");
          break;
        case "yearly":
          nextStartDate.add(1, "year");
          nextEndDate.add(1, "year");
          break;
        default:
          break;
      }

      // Check if the next event is within a reasonable future date range
      if (nextStartDate.isAfter(moment().add(1, "year"))) {
        break;
      }
      const nextStart =
        nextStartDate.toISOString().split("T")[0] +
        "T" +
        moment(startTime).tz("Asia/Tokyo").format("HH:mm");
      const nextEnd =
        nextEndDate.toISOString().split("T")[0] +
        "T" +
        moment(endTime).tz("Asia/Tokyo").format("HH:mm");

      events.push({ ...eventTemplate, start: nextStart, end: nextEnd });
    }

    try {
      for (const event of events) {
        await CalenderService.submitCalendarData(event);
      }
      onEventCreated();
    } catch (error: any) {
      console.error("Error submitting calendar data:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
    setDescription("");
    setTitle("");
    setStartTime(startTime);
    setEndTime(endTime);
    setStartDate(startDate);
    setEndDate(endDate);
    setColor(color);
    onHide();
  };

  const handleStartDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowStartDatePicker(false);
    if (date) {
      setStartDate(moment(date).tz("Asia/Tokyo").toDate());
    }
  };

  const handleEndDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowEndDatePicker(false);
    if (date) {
      setEndDate(moment(date).tz("Asia/Tokyo").toDate());
    }
  };

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
      backgroundColor: isDark ? "#222" : "#fff",
      color: isDark ? "white" : "black",
      padding: 10,
    },
    inputTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
      color: isDark ? "#ddd" : "#fff",
    },
    descriptionContainer: {
      marginHorizontal: 20,
    },
    descriptionTitle: {
      marginTop: 10,
      fontSize: 16,
      color: isDark ? "#fff" : "#ddd",
    },
    descriptionInput: {
      height: 150,
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      backgroundColor: isDark ? "#222" : "#fff",
      color: isDark ? "white" : "black",
    },
    timeFieldContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    btnContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      backgroundColor: isDark ? "#333" : "#ccc",
      width: "100%",
      padding: 20,
    },
  });

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
          <ScrollView style={{ backgroundColor: isDark ? "#333" : "#ddd" }}>
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
            <CustomDatePicker
              title="Start Date"
              isDark={isDark}
              value={startDate}
              show={showStartDatePicker}
              setShow={() => setShowStartDatePicker(!showStartDatePicker)}
              customHandle={handleStartDateChange}
            />

            <CustomDatePicker
              title="End Date"
              isDark={isDark}
              value={endDate}
              show={showEndDatePicker}
              setShow={() => setShowEndDatePicker(!showEndDatePicker)}
              customHandle={handleEndDateChange}
            />
            <View style={styles.timeFieldContainer}>
              <CustomTimePicker
                title="Start Time"
                isDark={isDark}
                value={startTime}
                setValue={handleSelectStartTime}
              />
              <CustomTimePicker
                title="End Time"
                isDark={isDark}
                value={endTime}
                setValue={handleSelectEndTime}
              />
              <ColorPicker color={color} setColor={setColor} isDark={isDark} />
              <CustomRepeatPicker
                repeat={repeatInterval}
                setRepeat={setRepeatInterval}
              />
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

export default CreateModal;
