import React from "react";
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
  const { group_members, admin_id, logged_in_user_id, group_id } = useLocalSearchParams<{
    group_members: string;
    admin_id: string;
    logged_in_user_id: string;
    group_id: string;
  }>();

  const members = group_members ? JSON.parse(group_members) : [];
  const router = useRouter();

  const handleRemoveMember = async (memberId: number) => {
    const numericGroupId = Number(group_id);

    if (isNaN(numericGroupId)) {
      Alert.alert("Error", "Invalid group ID.");
      return;
    }

    Alert.alert(
      "Remove Member",
      "Are you sure you want to remove this member?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          onPress: async () => {
            try {
              await GroupServices.removeMemberFromGroup(numericGroupId, memberId);
              Alert.alert("Success", "Member removed successfully.");
              router.push({
                pathname: `/chat/members`,
                params: {
                  group_members: JSON.stringify(members.filter(member => member.id !== memberId)),
                  admin_id,
                  logged_in_user_id,
                  group_id
                }
              });
            } catch (error) {
              Alert.alert("Error", "Failed to remove member. Please try again later.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

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
          <Text>{item.profile.fullname}</Text>
          {(logged_in_user_id === admin_id && item.id !== admin_id && item.id !== Number(logged_in_user_id)) && (
            <TouchableOpacity
              onPress={() => handleRemoveMember(item.id)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
  memberItem: {
    padding: 10,
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
