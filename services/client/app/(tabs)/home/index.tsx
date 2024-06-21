import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
  Platform,
  Appearance,
  useColorScheme,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import AuthServices from "@/src/api/AuthServices";
import { User } from "@/assets/interfaces/userInterface";
import SimpleScreen from "@/src/screens/Home/SimpleScreen";
import { useThemeColor } from "@/src/hooks/useThemeColor";
import { MyColor1 } from "@/src/constants/mycolor";


const HomeScreen = () => {
  const colorScheme = useColorScheme();

  const [user, setUser] = useState<User | null>(null);

  const backgroundColorStyle = colorScheme === "dark" ? styles.darBgColor : "black";


  useEffect(() => {
    const getUser = async () => {
      const user = await AuthServices.getCurrentUser();
      setUser(user.data);
    };
    getUser();
  }, []);

  const handleLogout = () => {
    SecureStore.deleteItemAsync("refreshToken");
    router.push("/login");
  };

  const handleProfile = () => {
    router.push("/modal");
  };

  return (
    <View style={{ flex: 1, marginTop: Platform.OS === "ios" ? 45 : 0, }}>
      <View style={styles.headerView}>
        <View>
          <Text style={styles.headerText}>四国大学</Text>
          <Text style={styles.username}>{user?.username}</Text>
        </View>
        <TouchableOpacity style={styles.headerActions}>
            <FontAwesome
              name="user-circle"
              size={24}
              color="black"
              onPress={()=>router.push("/profile")}
            />
          <Button title="Logout" onPress={handleLogout} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.bodyContainer}>
        <SimpleScreen />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 55,
    paddingLeft: 28,
    paddingRight: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  bodyContainer: {
    flex: 1,
    borderRadius: 5,
    borderTopWidth: 1,
    padding: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  darBgColor: {
    backgroundColor: "grey",
  }
});

export default HomeScreen;
