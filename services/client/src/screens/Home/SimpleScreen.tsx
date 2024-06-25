import { Text, View, TouchableOpacity, useColorScheme } from "react-native";
import { FontAwesome5, FontAwesome, AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScaledSheet } from "react-native-size-matters";
import * as SecureStore from "expo-secure-store";

interface ButtonData {
  route: string;
  icon: JSX.Element;
  title: string;
}

const SimpleScreen = () => {
  const theme = useColorScheme();

  const handleLogout = () => {
    SecureStore.deleteItemAsync("refreshToken");
    router.push("/login");
  };

  const buttonData: ButtonData[] = [
    { route: "/community", icon: <FontAwesome6 name="people-roof" size={45} color="#ff6666" />, title: "Community" },
    { route: "/calendar", icon: <FontAwesome5 name="calendar" size={45} color="blue" />, title: "Calendar" },
    { route: "/chatbot", icon: <FontAwesome5 name="robot" size={45} color="green" />, title: "ChatBot" },
    { route: "/chat", icon: <FontAwesome name="wechat" size={45} color="#00A5CF" />, title: "Chat" },
    { route: "/frequen", icon: <FontAwesome5 name="question" size={45} color="red" />, title: "A&Q" },
    { route: "/setting", icon: <AntDesign name="setting" size={45} color="#CA3C25" />, title: "Settings" },
    { route: "/login", icon: <AntDesign name="logout" size={45} color="#CA3C25"  onPress={handleLogout}/>, title: "Logout" },
    { route: "/profile", icon: <AntDesign name="user" size={45} color="#CA3C25"/>, title: "Profile" },
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

  const styles = ScaledSheet.create({
    homeContainer: {
      flex: 1,
      marginTop: "20@s"

    },
    iconLineContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: "20@s",
    },
    iconContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    iconItSelt: {
      borderRadius: 20,
      borderWidth: 1,
      width: "145@s",
      height: "110@s",
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
      fontSize: "14@s",
      fontWeight: "bold",
      textAlign: "center",
      marginTop: "20@s",
      color: theme === "dark" ? "#fff" : "#00f",
    },
  });

  return (
    <View style={styles.homeContainer}>
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
