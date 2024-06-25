import { StyleSheet, Text, View, useColorScheme } from "react-native";
import React from "react";

const Profile = () => {

  const theme = useColorScheme();

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
