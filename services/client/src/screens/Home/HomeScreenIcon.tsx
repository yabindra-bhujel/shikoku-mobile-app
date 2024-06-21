import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";

const HomeScreenIcon = () => {
  return (
    <View>
      <View style={styles.iconLineContainer}>
        <TouchableOpacity style={[styles.iconContainer, styles.redBackground]}>
          <View style={styles.iconItSelt}>
            <FontAwesome5 name="home" size={40} color="white" />
          </View>
          <Text style={styles.iconTitle}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconContainer, styles.blueBackground]}
          onPress={() => router.push("/calendar")}
        >
          <View style={styles.iconItSelt}>
            <FontAwesome5 name="home" size={40} color="white" />
          </View>
          <Text style={styles.iconTitle}>Calendar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconLineContainer}>
        <TouchableOpacity
          style={[styles.iconContainer, styles.greenBackground]}
          onPress={() => router.push("/chatbot")}
        >
          <View style={styles.iconItSelt}>
            <FontAwesome5 name="robot" size={40} color="white" />
          </View>
          <Text style={styles.iconTitle}>ChatBot</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconContainer, styles.orangeBackground]}>
          <View style={styles.iconItSelt}>
            <FontAwesome5 name="home" size={40} color="white" />
          </View>
          <Text style={styles.iconTitle}>Home</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconLineContainer}>
        <TouchableOpacity style={[styles.iconContainer, styles.purpleBackground]}>
          <View style={styles.iconItSelt}>
            <FontAwesome5 name="home" size={40} color="white" />
          </View>
          <Text style={styles.iconTitle}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconContainer, styles.yellowBackground]}
          onPress={() => router.push("/setting")}
        >
          <View style={styles.iconItSelt}>
            <AntDesign name="setting" size={40} color="white" />
          </View>
          <Text style={styles.iconTitle}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreenIcon;

const styles = StyleSheet.create({
  iconLineContainer: {
    marginHorizontal: 50,
    marginBottom: 50,
    marginTop: 50,
    gap: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconContainer: {
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconItSelt: {
    height: 100,
    width: 100,
    borderRadius: 20,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CA7DF9",
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
    color: "white"
  },
  redBackground: {
    backgroundColor: "red",
  },
  blueBackground: {
    backgroundColor: "blue",
  },
  greenBackground: {
    backgroundColor: "green",
  },
  orangeBackground: {
    backgroundColor: "orange",
  },
  purpleBackground: {
    backgroundColor: "purple",
  },
  yellowBackground: {
    backgroundColor: "#724cf9",
  },
});
