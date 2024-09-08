import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { Group } from "@/src/screens/Chat/GroupChat";

interface UserIconAndUsernameProps {
  groups: Group[];
  isDark: boolean;
}

const UserIconAndUsername: React.FC<UserIconAndUsernameProps> = ({
  groups = [],
  isDark,
}) => {
  const navigationToChatDetail = (groupId: number) => {
    router.push(`chat/${groupId}`);
  };

  const styles = StyleSheet.create({
    GroupListContainer: {
      flex: 1,
      padding: 10,
    },
    groupItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      borderBottomWidth: 1,
      backgroundColor: isDark ? "#333" : "#fff",
      borderBottomColor: "lightgray",
    },
    groupImageContainer: {
      height: 50,
      width: 50,
      borderRadius: 50,
      backgroundColor: "lightgray",
      justifyContent: "center",
      alignItems: "center",
    },
    groupImage: {
      height: 50,
      width: 50,
      borderRadius: 50,
    },
    groupInitial: {
      fontSize: 20,
      fontWeight: "bold",
    },
    groupName: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "white" : "black",
    },
  });

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.GroupListContainer}
    >
      {groups.map((group: Group) => (
        <TouchableOpacity
          key={group.id}
          onPress={() => navigationToChatDetail(group.id)}
        >
          <View style={styles.groupItem}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.groupImageContainer}>
                {group.group_image ? (
                  <Image
                    source={{ uri: group.group_image }}
                    style={styles.groupImage}
                  />
                ) : (
                  <Text style={styles.groupInitial}>
                    {group?.name?.trim().replace(/\s+/g, '').charAt(0).toUpperCase()}


                  </Text>
                )}
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.groupName}>
                  {group?.name?.trim()}
                </Text>
              </View>
            </View>

            <TouchableOpacity>
              <AntDesign name="right" size={22} color="green" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default UserIconAndUsername;
