import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  Image,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export interface GroupData {
  id: string;
  name: string;
  admin_id: number;
  description: string;
  group_image?: string;
  member_count?: number;
  group_members?: {
    id: number;
    profile: {
      fullname: string;
    };
  }[];
}

const GroupHeader = ({ groupData }: { groupData: GroupData }) => {
  const isDark = useColorScheme() === 'dark';
  const { t } = useTranslation();

  const goBack = () => {
    router.back();
  };

  const styles = StyleSheet.create({
    groupChatHeader: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: isDark ? "#222" : "#f8f8f8",
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#555" : "#ddd",
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    groupInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
    },
    groupImageContainer: {
      height: 50,
      width: 50,
      borderRadius: 25,
      backgroundColor: isDark ? "#444" : "#ddd",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 6,
    },
    groupImage: {
      height: 50,
      width: 50,
      borderRadius: 25,
    },
    groupInitials: {
      fontSize: 22,
      fontWeight: "bold",
      color: isDark ? "#fff" : "#333",
    },
    groupDetails: {
      flexDirection: "column",
    },
    groupName: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#fff" : "#222",
      width: 200,
    },
    groupMemberCount: {
      fontSize: 14,
      color: isDark ? "#ddd" : "#666",
    },
    backButton: {
      // padding: 10,
      // backgroundColor: isDark ? "#333" : "#f1f1f1",
      // borderRadius: 50,
      // justifyContent: "center",
      // alignItems: "center",
      // shadowColor: "#000",
      // shadowOpacity: 0.2,
      // shadowRadius: 6,
      // elevation: 4,
    },
    settingsButton: {
      padding: 10,
      backgroundColor: isDark ? "#333" : "#f1f1f1",
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
    },
  });

  return (
    <View style={styles.groupChatHeader}>
      <View style={styles.groupInfoContainer}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons
            name="chevron-back-sharp"
            size={24}
            color={isDark ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        <View style={styles.groupInfoContainer}>
          {groupData.group_image ? (
            <Image
              source={{ uri: groupData.group_image }}
              style={styles.groupImage}
            />
          ) : (
            <View style={styles.groupImageContainer}>
              <Text style={styles.groupInitials}>
                {groupData?.name?.trim().replace(/\s+/g, '').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View style={styles.groupDetails}>
            <Text style={styles.groupName}>
              {groupData?.name?.trim()}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          if (groupData.id) {
            router.push(`/chat/settings?groupId=${groupData.id}`);
          } else {
            Alert.alert("Error", "Failed to retrieve group ID.");
          }
        }}
        style={styles.settingsButton}
      >
        <Ionicons name="settings" size={24} color={isDark ? "#fff" : "#000"} />
      </TouchableOpacity>
    </View>
  );
};

export default GroupHeader;
