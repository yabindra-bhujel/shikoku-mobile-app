import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import GroupServices from "@/src/api/GroupServices";

export default function Members() {
  const { group_members, admin_id, logged_in_user_id, group_id } =
    useLocalSearchParams<{
      group_members: string;
      admin_id: string;
      logged_in_user_id: string;
      group_id: string;
    }>();

  // Ensure group_id is a string
  const groupId = group_id || "0";

  const [members, setMembers] = useState(group_members ? JSON.parse(group_members) : []);
  const router = useRouter();

  const handleRemoveMember = async (memberId: number) => {
    const numericGroupId = Number(groupId);

    if (isNaN(numericGroupId) || numericGroupId === 0) {
      Alert.alert("Error", "Invalid group ID.");
      return;
    }

    Alert.alert(
      "Remove Member",
      "Are you sure you want to remove this member?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: async () => {
            try {
              await GroupServices.removeMemberFromGroup(
                numericGroupId,
                memberId
              );
              Alert.alert("Success", "Member removed successfully.");
              // Update the local state to remove the member from the list
              setMembers(members.filter((member) => member.id !== memberId));
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to remove member. Please try again later."
              );
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  useEffect(() => {
    const updateMembers = async () => {
      try {
        const response = await GroupServices.getGroupById(groupId);
        setMembers(response.data.group_members);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch updated members. Please try again later.");
      }
    };

    updateMembers();
  }, [groupId]);

  if (members.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No members found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={members}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.memberItem}>
          <Text>{item.profile?.fullname || "No name available"}</Text>
          {logged_in_user_id === admin_id &&
            item.id !== admin_id &&
            item.id !== Number(logged_in_user_id) && (
              <TouchableOpacity
                onPress={() => handleRemoveMember(item.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            )}
        </View>
      )}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  memberItem: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  removeButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
  },
});
