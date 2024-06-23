import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
  Platform,
  StatusBar,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import AuthServices from "@/src/api/AuthServices";
import { User } from "@/assets/interfaces/userInterface";
import SimpleScreen from "@/src/screens/Home/SimpleScreen";
import { ThemeContext } from "@/src/hooks/ThemeContext";
import useTheme from "@/src/hooks/CustomTheme";


const HomeScreen = () => {

  const { theme } = useTheme();

  const [user, setUser] = useState<User | null>(null);

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

  return (
    <View style={{ flex: 1 }}>
      <View style={{flex: 0,
        height: Platform.OS === "ios" ? 45 : 0 ,
        backgroundColor: theme === "dark" ? "#333" : "#fff"
      }}/>
      <StatusBar 
      barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      backgroundColor={theme === 'dark' ? '#333' : '#fff'}/>
      <View style={[styles.headerView, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
        <View>
          <Text style={[
            styles.headerText,
            { color: theme === 'dark' ? '#fff' : '#000' }
          ]}>四国大学</Text>
          <Text style={[
            styles.username,
            { color: theme === 'dark' ? '#aaa' : '#333' }
          ]}>{user?.username}</Text>
        </View>
        <Pressable style={styles.headerActions}>
            <FontAwesome
              name="user-circle"
              size={24}
              color={theme === 'dark' ? '#fff' : '#000'}
              onPress={()=>router.push("/profile")}
            />
          <Button title="Logout" onPress={handleLogout} />
        </Pressable>
      </View>
      <ScrollView style={[styles.bodyContainer, {
        backgroundColor: theme === "dark" ? "#333" : "white",
      }]}>
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
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  bodyContainer: {
    flex: 1,
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
