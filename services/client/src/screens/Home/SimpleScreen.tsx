import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";

const SimpleScreen = () => {
  return (
    <View style={{
      flex: 1,
      marginTop: 15,
    }}>
      <View style={styles.iconLineContainer}>
        <TouchableOpacity style={styles.iconContainer}>
          <View style={styles.iconItSelt}>
            <MaterialIcons name="feed" size={40} color="#ff6666" />
            <Text style={styles.iconTitle}>Tweet</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => router.push("/calendar")}
        >
          <View style={styles.iconItSelt}>
            <FontAwesome5 name="home" size={40} color="blue" />
            <Text style={styles.iconTitle}>Calendar</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.iconLineContainer}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => router.push("/chatbot")}
        >
          <View style={styles.iconItSelt}>
            <FontAwesome5 name="robot" size={40} color="green" />
            <Text style={styles.iconTitle}>ChatBot</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={() => router.push("/chat")}>
          <View style={styles.iconItSelt}>
            <FontAwesome name="wechat" size={40} color="#00A5CF" />
            <Text style={styles.iconTitle}>Chat</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.iconLineContainer}>
        <TouchableOpacity style={styles.iconContainer} onPress={()=>router.push("/frequen")}>
          <View style={styles.iconItSelt}>
            <FontAwesome5 name="question" size={40} color="red" />
            <Text style={styles.iconTitle}>A&Q</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => router.push("/setting")}
        >
          <View style={styles.iconItSelt}>
            <AntDesign name="setting" size={40} color="#CA3C25" />
            <Text style={styles.iconTitle}>Settings</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SimpleScreen;

const styles = StyleSheet.create({
  iconLineContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconContainer: {
    marginHorizontal: 10,
    marginBottom: 25,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconItSelt: {
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    width: 180,
    height: 200,
    borderColor: "white",
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  iconTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 25,
  },
});
