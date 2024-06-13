import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import StyledTextInput from "@/src/components/StyledTextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Redirect, router } from "expo-router";
import axios from "axios";
import { user_login } from "@/src/api/user_api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }: { navigation: any }) => {
  const [username, setUserName] = useState("");
  const [password, setPassWord] = useState("");

  const submit = () => {
    router.push("/home");
  }

  // const submit = async () => {
  //   if (!username) {
  //     Alert.alert("Please fill user name !");
  //     return;
  //   }
  //   if (!password) {
  //     Alert.alert("Please fill password");
  //     return;
  //   }
  //   try{
  //   const baseUrl = "http://192.168.1.81:8000"
  //   const response = await axios.post(`${baseUrl}/auth/access_token/`, {
  //     username: username,
  //     password: password
  //   });

  //   if (response.status === 200) {
  //     // Assuming the token is in response.data.token
  //     router.push("/home");
  //   } else {
  //     Alert.alert("Login failed", "Invalid credentials or server error.");
  //   }
  // } catch (error: any) {
  //   if (error.response) {
  //     console.log("Server responded with a status:", error.response.status);
  //     console.log(error.response.data);
  //     Alert.alert("Login failed", "Invalid credentials or server error.");
  //   } else if (error.request) {
  //     console.log("No response was received:", error.request);
  //     Alert.alert("Login failed", "No response from server.");
  //   } else {
  //     console.log("Error setting up the request:", error.message);
  //     Alert.alert("Login failed", "An error occurred.");
  //   }
  // }
  // };

  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerLogo}>
        <Image source={require("@/assets/images/64px-shikoku-logo.png")} />
        <View style={styles.headertitle}>
          <Text style={styles.text1}>SHIKOKU UNIVERSITY</Text>
          <Text style={styles.text2}>四国大学</Text>
        </View>
      </View>
      <Text style={styles.welback}>Welcome Back</Text>
      <View>
        <View style={styles.inputContainer}>
          <FontAwesome5
            name="user-alt"
            size={24}
            color="black"
            style={styles.inputIcon}
          />
          <StyledTextInput
            placeholder="username"
            textContentType="username"
            autoCapitalize="none"
            value={username}
            autoCorrect={false}
            onChangeText={setUserName}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="lock"
            size={24}
            color="black"
            style={styles.inputIcon}
          />
          <StyledTextInput
            placeholder="password"
            textContentType="password"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassWord}
          />
        </View>

        <View style={styles.forgetfield}>
          <View>
            <Text>Remember me</Text>
          </View>
          <TouchableOpacity>
            <Link style={styles.forgetText} href="/forgetpass">
              Forgot Password
            </Link>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.privacyText}>
        Terms of service and privacy policy
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: "100%"
  },
  headerLogo: {
    marginTop: 105,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headertitle: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 7,
  },
  text1: {
    fontSize: 13,
    textDecorationLine: "underline",
    fontWeight: "bold",
    color: "#000000",
  },
  text2: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000000",
  },
  welback: {
    fontSize: 30,
    marginTop: 34,
    marginBottom: 57,
    color: "#000000",
    textAlign: "center",
  },
  forgetfield: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 36,
    marginVertical: 10,
  },
  inputContainer: {
    backgroundColor: "#FCF5F5",
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 36,
    marginVertical: 10,
    height: 53,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  forgetText: {
    fontSize: 13,
    color: "#F84A4A",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 53,
    marginVertical: 20,
    marginHorizontal: 36,
    borderRadius: 5,
    backgroundColor: "#4785FC",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  privacyText: {
    color: "#3F44D1",
    textAlign: "center",
    fontSize: 13,
    marginTop: 50
  },
});

export default Login;
