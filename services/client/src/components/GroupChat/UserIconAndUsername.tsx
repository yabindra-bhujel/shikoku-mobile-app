import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";

const UserIconAndUsername = () => {
  const router = useRouter();

  const navigationToChatDetail = () => {
    router.navigate("chat/1");
  };

  return (
    <TouchableOpacity onPress={navigationToChatDetail}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "lightgray",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              height: 50,
              width: 50,
              borderRadius: 50,
              backgroundColor: "lightgray",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>A</Text>
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Aman</Text>
            <Text style={{ fontSize: 14, color: "gray" }}>Active Now</Text>
          </View>
        </View>
        
        <TouchableOpacity>
          <Feather name="more-horizontal" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default UserIconAndUsername;
