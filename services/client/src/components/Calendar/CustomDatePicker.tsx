import React from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import moment from 'moment';

interface DatePickerType {
  title: string;
  show: boolean;
  setShow: any;
  value: Date;
  customHandle: any;
  isDark: boolean;
  contentWidth?: any;
}

const CustomDatePicker: React.FC<DatePickerType> = ({
  title,
  show,
  setShow,
  value,
  customHandle,
  isDark,
  contentWidth = "90%",
}) => {
  const { t } = useTranslation();
  const formatDate = (date: Date) => moment(date).format('YYYY/MM/DD'); // Use your desired format


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
      width: contentWidth,
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
            {title}: {formatDate(value)}
          </Text>
          <AntDesign
            name="calendar"
            size={35}
            color={isDark ? "white" : "blue"}
            onPress={() => setShow(true)}
          />
        </View>

        {show && Platform.OS === "ios" && (
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
                    onPress={() => setShow(false)} 
                    style={{
                      padding: 20,
                      fontSize: 18,
                      color: isDark ? "white" : "black",
                    }}
                  >
                    {t("close")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* Render picker inline only when triggered on Android */}
        {show && Platform.OS === "android" && (
          <DateTimePicker
            testID="startDatePicker"
            value={value}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShow(false);  
              customHandle(event, selectedDate);
            }}
            timeZoneName={"Asia/Tokyo"}
            locale="ja-JP"
          />
        )}
      </View>
    </>
  );
};

export default CustomDatePicker;
