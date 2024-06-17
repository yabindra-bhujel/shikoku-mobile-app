import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import StyledButton from "@/src/components/StyledButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import SplashScreen from "@/src/screens/Splash/SplashScreen";

export default function StartScreen() {
  const handlePress = () => {
    console.log("pressed");
  };
  return (
    <SplashScreen/>
  );
}

