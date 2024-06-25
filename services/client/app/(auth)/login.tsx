import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  useColorScheme,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import StyledTextInput from "@/src/components/StyledTextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import AuthServices from "@/src/api/AuthServices";
import * as SecureStore from 'expo-secure-store';

const Login = () => {

  const theme = useColorScheme();

  const [username, setUserName] = useState<string>("");
  const [password, setPassWord] = useState<string>("");

  const submit = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const response = await AuthServices.login(username, password);

      if (response.status === 200) {
        const refreshToken = response.data.refresh_token;
        if (!refreshToken) {
          throw new Error("No refresh token received");
        }

        await SecureStore.setItemAsync('refreshToken', refreshToken);

        router.push("/home");

      } else {
        Alert.alert("Error", response.data.message);
      }

    } catch (error) {
      Alert.alert("Error", "Invalid username or password");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: "100%",
      backgroundColor: theme === "dark" ? "#333": "white",
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
      color: theme === "dark" ? "white": "black",
    },
    text2: {
      fontSize: 40,
      fontWeight: "bold",
      color: theme === "dark" ? "white": "black",
    },
    welback: {
      fontSize: 30,
      marginTop: 34,
      marginBottom: 57,
      color: theme === "dark" ? "white": "black",
      textAlign: "center",
    },
    forgetfield: {
      flexDirection: "row",
      justifyContent: "center",
      marginHorizontal: 36,
      marginVertical: 10,
    },
    inputContainer: {
      backgroundColor: theme === "dark" ? "black": "#FCF5F5",
      flexDirection: "row",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme === "dark" ? "white" : "black",
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
      color: theme === "dark" ? "white": "#F84A4A",
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      height: 53,
      marginVertical: 20,
      marginHorizontal: 36,
      borderRadius: 5,
      backgroundColor: theme === "dark" ? "purple": "#4785FC",
    },
    buttonText: {
      color: theme === "dark" ? "white": "#FCF5F5",
      fontSize: 20,
      fontWeight: "bold",
    },
    privacyText: {
      color: theme === "dark" ? "white": "#4785FC",
      textAlign: "center",
      fontSize: 13,
      marginTop: 50,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View style={styles.headerLogo}>
              <Image
                source={require("@/assets/images/64px-shikoku-logo.png")}
              />
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
                  color={theme === "dark" ? "white" : "black"}
                  style={styles.inputIcon}
                />
                <StyledTextInput
                  placeholder="username"
                  placeholderTextColor={theme === "dark" ? "lightblue" : "black"}
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
                  color={theme === "dark" ? "white" : "black"}
                  style={styles.inputIcon}
                />
                <StyledTextInput
                  placeholder="password"
                  placeholderTextColor={theme === "dark" ? "lightblue" : "black"}
                  textContentType="password"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={password}
                  onChangeText={setPassWord}
                />
              </View>

              <View style={styles.forgetfield}>
                <TouchableOpacity>
                  <Link style={styles.forgetText} href="/forgetpass">
                    Forgot Password?
                  </Link>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.button} onPress={submit}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Text style={styles.privacyText}>
        Terms of service and privacy policy
      </Text>
    </SafeAreaView>
  );
};

export default Login;
