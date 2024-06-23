import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome5, FontAwesome, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import useTheme from "@/src/hooks/CustomTheme";

interface ButtonData {
  route: string;
  icon: JSX.Element;
  title: string;
}

const SimpleScreen = () => {
  const { theme } = useTheme();

  const buttonData: ButtonData[] = [
    { route: "/tweet", icon: <MaterialIcons name="feed" size={50} color="#ff6666" />, title: "Tweet" },
    { route: "/calendar", icon: <FontAwesome5 name="home" size={50} color="blue" />, title: "Calendar" },
    { route: "/chatbot", icon: <FontAwesome5 name="robot" size={50} color="green" />, title: "ChatBot" },
    { route: "/chat", icon: <FontAwesome name="wechat" size={50} color="#00A5CF" />, title: "Chat" },
    { route: "/frequen", icon: <FontAwesome5 name="question" size={50} color="red" />, title: "A&Q" },
    { route: "/setting", icon: <AntDesign name="setting" size={50} color="#CA3C25" />, title: "Settings" },
  ];

  // Function to group buttons into pairs
  const groupButtons = (data: ButtonData[], itemsPerRow: number): ButtonData[][] => {
    const groupedData: ButtonData[][] = [];
    for (let i = 0; i < data.length; i += itemsPerRow) {
      groupedData.push(data.slice(i, i + itemsPerRow));
    }
    return groupedData;
  };

  const groupedButtonData = groupButtons(buttonData, 2);

  const styles = StyleSheet.create({
    iconLineContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 25,
    },
    iconContainer: {
      flex: 1,
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
      backgroundColor: theme === "dark" ? "#111" : "#fff",
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
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 20,
      color: theme === "dark" ? "#fff" : "#00f",
    },
  });

  return (
    <View style={{ flex: 1, marginTop: 15 }}>
      {groupedButtonData.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.iconLineContainer}>
          {row.map((button, index) => (
            <TouchableOpacity key={index} style={styles.iconContainer} onPress={() => router.push(button.route)}>
              <View style={styles.iconItSelt}>
                {button.icon}
                <Text style={styles.iconTitle}>{button.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

export default SimpleScreen;
