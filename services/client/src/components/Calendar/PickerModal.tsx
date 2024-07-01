import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";

const PickerModal = () => {
  const [date, setDate] = React.useState(new Date(1598051730000));
  const [mode, setMode] = React.useState("date");
  const [show, setShow] = React.useState(false);
  const [show2, setShow2] = React.useState(false);
  const [show3, setShow3] = React.useState(false);

  const onChange = (value: any) => {
    setShow(value);
  };
  return (
    <Modal>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <LinearGradient
            colors={["#2F6982", "#0A171C"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{
              width: "100%",
              padding: 25,
              alignItems: "center",
            }}
          >
            <Text style={styles.titleText}>Create an Event</Text>
          </LinearGradient>
          <ScrollView style={styles.top20}>
            <View style={styles.crollViewContainer}>
              <Text
                style={{
                  color: "#2F6982",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Event Name:
              </Text>
              <TextInput
                style={styles.eventInputField}
                placeholder="title ..."
                placeholderTextColor={"gray"}
              />
            </View>
            <View style={styles.top20}>
              <Text>Event Description</Text>
              <TextInput
                style={styles.descriptionInputField}
                numberOfLines={4}
                multiline={true}
                maxLength={40}
                placeholder="description here ..."
                placeholderTextColor={"gray"}
              />
            </View>
            <View style={styles.top20}>
              <View style={styles.pickerContainer}>
                <Text
                  style={{
                    color: "#2F6982",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Event Start:
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <DateTimePicker
                    mode="date"
                    value={date}
                    onChange={onChange}
                  />
                  <DateTimePicker
                    mode="time"
                    value={date}
                    onChange={onChange}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#fefefe",
                  padding: 5,
                }}
              >
                <Text
                  style={{
                    color: "#2F6982",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Event End:
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <DateTimePicker
                    mode="date"
                    value={date}
                    onChange={onChange}
                  />
                  <DateTimePicker
                    mode="time"
                    value={date}
                    onChange={onChange}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={styles.btnContainer}>
            <View style={styles.buttonStyle}>
              <Text style={styles.btnTitle}>Save</Text>
            </View>
            <View
              style={[
                styles.buttonStyle,
                {
                  backgroundColor: "#ff1a1a",
                },
              ]}
            >
              <Text style={styles.btnTitle}>Delete</Text>
            </View>
            <View style={styles.buttonStyle}>
              <Text style={styles.btnTitle}>Cancle</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PickerModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    backgroundColor: "#efefef",
    width: "90%",
    height: "60%",
  },
  crollViewContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  titleText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  top20: {
    marginTop: 20,
  },
  eventInputField: {
    borderBottomColor: "#2F6982",
    borderBottomWidth: 1,
    padding: 10,
    width: "100%",
    color: "#2F6982",
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#fff",
  },
  descriptionInputField: {
    borderBottomColor: "#2F6982",
    borderBottomWidth: 1,
    padding: 10,
    height: 100,
    width: "100%",
    color: "#2F6982",
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#fff",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fefefe",
    padding: 5,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 15,
  },
  buttonStyle: {
    backgroundColor: "#3399ff",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "29%",
    borderRadius: 5,
  },
  btnTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
