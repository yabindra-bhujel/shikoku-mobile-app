import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { FontAwesome } from "@expo/vector-icons";
import SysModal from "@/src/constants/sys_modal";

const CalendarScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#72AAFF",
          padding: 13,
        }}
      >
        <View style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>Month</Text>
        </View>
        <View style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>Year</Text>
        </View>
        <View style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>Day</Text>
        </View>
      </View>
      <Calendar />
      <FontAwesome
        name="plus-circle"
        size={70}
        color="#40AAFF"
        style={styles.addBtn}
      />
    </SafeAreaView>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  headerBtn: {
    padding: 6,
    borderWidth: 1,
    borderRadius: 10,
    width: 70,
    borderColor: "transparent",
    alignItems: "center",
    backgroundColor: "#E8E8E8",
  },
  headerBtnText: {
    fontWeight: "bold",
    fontSize: 15,
  },
  addBtn: {
    position: "absolute",
    bottom: 20,
    right: 10,
  },
});
