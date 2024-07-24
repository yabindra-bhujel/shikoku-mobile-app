import React, { useState, useCallback } from "react";
import { StyleSheet, View, ScrollView, RefreshControl, Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";


const Notification = () => {
    const theme = useColorScheme();
    const router = useRouter();
  
    const goBack = () => {
      router.back();
    };
  

  
    const styles = StyleSheet.create({
      container: {},
      communityHomeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        backgroundColor: theme === "dark" ? "#333" : "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "lightgray",
      },
    });
  
    return (
      <View style={styles.container}>
        <View
          style={{
            height: 54,
            backgroundColor: theme === "dark" ? "#333" : "#fff",
          }}
        />
        <View style={styles.communityHomeHeader}>

        <TouchableOpacity
            onPress={goBack}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons
              name="chevron-back-sharp"
              size={24}
              color={theme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: theme === "dark" ? "#fff" : "#000",
              }}
            >
                Notifications
            </Text>
          </View>
  
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});

export default Notification;
