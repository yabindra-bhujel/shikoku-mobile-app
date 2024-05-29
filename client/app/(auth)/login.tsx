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
import { Link, router } from "expo-router";

const Login = ({ navigation }: { navigation: any }) => {
  const onPressButton = () => {
    Alert.alert("Login with no account!");
    navigation.navigate("Main");
  };

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
          />
        </View>

        <View style={styles.forgetfield}>
          <View>
            <Text>Remember me</Text>
          </View>
          <TouchableOpacity>
            <Link style={styles.forgetText} href=
            '/forgetpass'>Forgot Password</Link>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={()=> 
          router.push('/login')}>
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
  Wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
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
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default Login;
