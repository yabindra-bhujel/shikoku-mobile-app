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
import axios  from "axios";
import { user_login } from "@/src/api/user_api";
import AsyncStorage from '@react-native-async-storage/async-storage';



const Login = ({ navigation }: { navigation: any }) => {
  
  const [username, setUserName] = useState("");
  const [password, setPassWord] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  })


  const submit = async () => {
    if (form.username === "" || form.password === "") {
      Alert.alert("Please fill all the fields");
    }
    
    {
      setIsLoading(true);
      const res = await user_login(form); 
      console.log(res);
      if (res.status === 200) {
        setIsLoading(false);
        Alert.alert("Login Successful");
        await AsyncStorage.setItem('token', res.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
        router.push("/home");
  }}}





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
            value={form.username}
            autoCorrect={false} 
            onChangeText={(e) => setForm({...form, 
              username: e
            })}
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
            value={form.password}
            onChangeText={(e) => setForm({...form, 
              password: e
            })}

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
        <TouchableOpacity style={styles.button}
        onPress={submit}>
          <Text style={styles.buttonText}
          >Login</Text>
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
    marginTop: 50,
  },
});

export default Login;
