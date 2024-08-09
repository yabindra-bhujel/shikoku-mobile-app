import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  useColorScheme,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store'; 
import axiosInstance from "@/src/config/Api";

const Otp = () => {
  const router = useRouter();
  const theme = useColorScheme();
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [timer, setTimer] = useState(300);
  const inputRefs = useRef<Array<TextInput | null>>(Array(4).fill(null));
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const storedUsername = await SecureStore.getItemAsync('username');
        const storedPassword = await SecureStore.getItemAsync('password');
        setUsername(storedUsername);
        setPassword(storedPassword);
      } catch (error) {
        Alert.alert("Error", "Failed to get user info");
      }
    };
    getUserInfo();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.length > 0 && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && otp[index].length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 4) {
      Alert.alert("Invalid OTP", "Please enter a valid 4-digit OTP.");
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/otp_verification", {
        username: username,
        password: password,
        otp: otpString,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const refreshToken = response.data.refresh_token;
      if (!refreshToken) {
        throw new Error("No refresh token received");
      }
      await SecureStore.setItemAsync("refreshToken", refreshToken);
      router.push("/home");

    } catch (error) {
      Alert.alert("Error", "OTP verification failed. Please Input correct code.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#121212" : "#f5f5f5",
      padding: 20,
    },
    description: {
      fontSize: 15,
      fontFamily: "Roboto",
      fontWeight: "400",
      color: theme === "dark" ? "#ddd" : "#555",
      textAlign: "center",
      marginBottom: 20,
    },
    otpContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    otpInput: {
      fontSize: 24,
      textAlign: "center",
      color: theme === "dark" ? "#fff" : "#000",
      borderBottomWidth: 2,
      borderBottomColor: theme === "dark" ? "#888" : "#ccc",
      width: 40,
      height: 40,
      marginHorizontal: 10,
    },
    timerContainer: {
      marginBottom: 20,
    },
    timerText: {
      fontSize: 16,
      color: theme === "dark" ? "#888" : "#555",
    },
    submitButton: {
      backgroundColor: theme === "dark" ? "#00AEEF" : "#007AFF",
      paddingVertical: 15,
      paddingHorizontal: 80,
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    submitButtonText: {
      fontSize: 18,
      color: "#fff",
      fontWeight: "bold",
    },
    backButton: {
      alignItems: "center",
      marginTop: 10,
    },
    backButtonText: {
      fontSize: 16,
      color: theme === "dark" ? "#00AEEF" : "#007AFF",
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme === "dark" ? "#121212" : "#f5f5f5",
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    loadingText: {
      fontSize: 18,
      color: theme === "dark" ? "#fff" : "#000",
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color={theme === "dark" ? "#fff" : "#000"} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.description}>
          An OTP has been sent to your registered email. Please enter the 4-digit OTP below to verify your account. The OTP will expire in 5 minutes.
        </Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              value={value}
              onChangeText={(text) => handleOtpChange(text, index)}
              keyboardType="numeric"
              maxLength={1}
              ref={(ref) => (inputRefs.current[index] = ref)}
              returnKeyType="next"
              onKeyPress={(e) => handleKeyPress(e, index)}
              onSubmitEditing={() => {
                if (index < otp.length - 1) {
                  inputRefs.current[index + 1]?.focus();
                }
              }}
              onFocus={() => {
                if (index !== otp.findIndex((val) => val === "")) {
                  inputRefs.current[index]?.blur();
                }
              }}
            />
          ))}
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            OTP expires in{" "}
            <Text style={{ color: timer < 60 ? "red" : "inherit" }}>
              {formatTime(timer)}
            </Text>
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleOtpSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Otp;
