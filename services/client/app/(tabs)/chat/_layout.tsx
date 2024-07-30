import React, { useState } from "react";
import { router, Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import AddMemberModal from "@/src/components/GroupChat/settings/AddMemberModal";

const StackLayout = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [groupInfo, setGroupInfo] = useState({ group_members: [], id: 1 }); // Replace with actual group info
  
  const handleMemberAdded = (newMembers) => {
    setGroupInfo((prevGroupInfo) => ({
      ...prevGroupInfo,
      group_members: newMembers,
    }));
  };
 
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AntDesign name="left" size={24} color="black" />
              </TouchableOpacity>
            ),
            headerTitle: "グループチャット"
          }}
        />

        <Stack.Screen
          name="[groupId]"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
          }}
        />

        <Stack.Screen
          name="settings"
          options={{
            title: "グループの設定",
            headerBackTitle: "戻る",
          }}
        />

        <Stack.Screen
          name="members"
          options={{
            title: "メンバーリスト",
            headerRight: () => {
              return (
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <AntDesign name="plus" size={24} color="black" />
                </TouchableOpacity>)
            }
          }}
        />
      </Stack>

      <AddMemberModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        groupInfo={groupInfo}
        onMemberAdded={handleMemberAdded}
      />
    </>
  );
};

export default StackLayout;
