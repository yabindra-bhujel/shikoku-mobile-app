import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import useTheme from "@/src/hooks/CustomTheme";

const Profile = () => {

  const { theme } = useTheme();

  return (
        <View style={{
          flex: 1,
          backgroundColor: theme === "dark" ? "black" : "white",
        }}>
          <Text style={{
            color: theme === "dark" ? "white" : "black",
          }}>Profile </Text>
        </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
