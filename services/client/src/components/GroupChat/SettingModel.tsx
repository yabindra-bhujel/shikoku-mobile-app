import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Text as PaperText } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import GroupServices from "@/src/api/GroupServices";
import { GroupData } from "./GroupHeader";
import { useUser } from "@/src/hooks/UserContext";
import ChangeNameModal from "./settings/ChangeNameModal";

export default function SettingModal() {
  const { groupId = "0" } = useLocalSearchParams<{ groupId?: string }>(); // Default value for groupId
  const [groupInfo, setGroupInfo] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [showNameChange, setShowNameChange] = useState(false);

  const { loggedInUserId } = useUser();

  const fetchGroupInfo = async () => {
    if (!groupId) return;

    try {
      const response = await GroupServices.getGroupById(groupId);
      setGroupInfo(response.data);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to fetch group information. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupInfo();
  }, [groupId]);

  const handleRefreshGroupDetail = () => {
    fetchGroupInfo();
  }

  const handleShowNameChange = () => {
    setShowNameChange(!showNameChange);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!groupInfo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Group not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.groupInfoContainer}>
          <View style={styles.headerContainer}>
            <Text>Image</Text>
            <Text style={styles.groupName}>グループ名: {groupInfo.name}</Text>
            <TouchableOpacity onPress={handleShowNameChange}>
              <PaperText style={styles.changeName}>名前と説明の変更</PaperText>
            </TouchableOpacity>
          </View>
          <View style={styles.groupInfo}>
            <Text style={styles.groupDescription}>
              グループの説明: {groupInfo.description}
            </Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: `/chat/members`,
                  params: {
                    group_members: JSON.stringify(groupInfo.group_members),
                    admin_id: groupInfo.admin_id,
                    logged_in_user_id: loggedInUserId,
                    group_id: groupInfo.id,
                  },
                })
              }
            >
              <Text style={styles.groupMemberCount}>メンバーリスト</Text>
            </TouchableOpacity>
          </View>
          <View>
            <PaperText>グループ退出</PaperText>
          </View>
        </View>
      </ScrollView>
      <ChangeNameModal
        visible={showNameChange}
        onClose={handleShowNameChange}
        currentGroupId={parseInt(groupId, 10)} // Convert groupId to number
        groupInfo={groupInfo}
        refresDetaiScreen={handleRefreshGroupDetail}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  groupInfoContainer: {
    padding: 20,
  },
  headerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  groupName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  changeName: {
    fontSize: 16,
    marginBottom: 10,
    color: "blue",
  },
  groupInfo: {
    marginTop: 10,
  },
  groupDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  groupMemberCount: {
    fontSize: 16,
    marginBottom: 10,
    color: "blue",
  },
});
