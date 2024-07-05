import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";

interface DatePickerType {
  title: string;
  show: boolean;
  setShow: any;
  value: Date;
  customHandle: any;
  isDark : boolean;
}

const CustomDatePicker: React.FC<DatePickerType> = ({
  title,
  show,
  setShow,
  value,
  customHandle,
  isDark,
}) => {

  const styles = StyleSheet.create({
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
      backgroundColor: isDark ? "#222" : "white",
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
    datePickerButton: {
      width: "90%",
      flex: 1,
      backgroundColor: isDark ? "#222" : "#fff",
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
      backgroundColor: isDark ? "#222" : "#fff",
      borderRadius: 10,
      padding: 10,
    },
    selectedDate: {
      fontSize: 16,
      color: isDark ? "white" : "black",
    },
  });
  return (
    <>
      <View style={styles.datePickerContainer}>
        <View style={styles.datePicker}>
          <Text style={styles.selectedDate}>
            {title}: {value.toLocaleDateString()}
          </Text>
          <AntDesign
            name="calendar"
            size={35}
            color={isDark ? "white" : "blue"}
            onPress={setShow}
          />
        </View>
        <Modal visible={show} transparent animationType="slide">
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <DateTimePicker
                testID="startDatePicker"
                value={value}
                mode="date"
                display="inline"
                onChange={customHandle}
                style={styles.datePickerButton}
                timeZoneName={"Asia/Tokyo"}
                locale="ja-JP"
              />
              <TouchableOpacity style={{ padding: 12 }}>
                <Text
                  onPress={setShow}
                  style={{ padding: 20, fontSize: 18, 
                    color: isDark ? "white" : "black" 
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default CustomDatePicker;
