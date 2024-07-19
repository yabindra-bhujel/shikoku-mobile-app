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
import {
  FontAwesome6,
  MaterialIcons,
  SimpleLineIcons,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";

export default function SettingModal() {
  const { groupId = "0" } = useLocalSearchParams<{ groupId?: string }>();
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
  };

  const handleShowNameChange = () => {
    setShowNameChange(!showNameChange);
  };

  const deleteGroup = async () => {
    try {
      await GroupServices.deleteGroup(parseInt(groupId, 10));
      router.push("/groups");
    } catch (error) {
      Alert.alert("Error", "Failed to delete group. Please try again.");
    }
  };

  const confirmDeleteGroup = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this group?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteGroup,
        },
      ]
    );
  };

  const handleUpdateGroup = (data: { name: string; description: string }) => {
    setGroupInfo((prev) => ({
      ...prev!,
      name: data.name,
      description: data.description,
    }));
  };

  const leaveGroup = async () => {
    const numericGroupId = Number(groupId);
    Alert.alert(
      "グループの退出",
      "グループを退出します?\n退出したあと、グループのメンバーとしては扱われません。",
      [
        {
          text: "キャンセル",
          style: "cancel"
        },
        {
          text: "退出",
          onPress: async () => {
            try {
              const res = await GroupServices.leaveGroup(numericGroupId);
              Alert.alert("成功", "グループを退出しました。");
              router.push("/chat");
            } catch (error) {
              Alert.alert("エラー", "退出際に問題が発生しました。もう一度試してみてください。");
            }
          },
          style: "destructive"
        }
      ]
    );
  }

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
            <Text style={styles.groupName}>{groupInfo.name}</Text>
            <TouchableOpacity onPress={handleShowNameChange}>
              <PaperText style={styles.changeName}>名前と説明の変更</PaperText>
            </TouchableOpacity>
          </View>
          <View style={styles.groupInfo}>
            <View style={[styles.rowgap10, { marginBottom: 10 }]}>
              <Entypo name="info-with-circle" size={24} color="black" />
              <Text style={styles.groupDescription}>グループの説明:</Text>
            </View>
            <View style={styles.descriptionText}>
              <Text>{groupInfo.description}</Text>
            </View>
            <View style={styles.TopLineContainer} />
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
              style={[styles.rowBetween, { marginTop: 15 }]}
            >
              <View style={styles.rowgap10}>
                <FontAwesome6
                  name="people-group"
                  size={24}
                  color="black"
                  style={styles.memberList}
                />
                <Text style={styles.memberList}>メンバーリスト</Text>
              </View>
              <AntDesign name="right" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {groupInfo.admin_id === loggedInUserId ? (
            <View style={[styles.leaveGroup, styles.rowBetween]}>
              <View style={styles.rowgap10}>
                <MaterialIcons name="delete" size={24} color="black" />
                <TouchableOpacity onPress={confirmDeleteGroup}>
                  <PaperText style={styles.leaveGroupTitle}>
                    グループの削除
                  </PaperText>
                </TouchableOpacity>
              </View>
              <AntDesign name="right" size={24} color="black" />
            </View>
          ) : null}
          <View style={styles.leaveGroup}>
            <TouchableOpacity style={styles.rowgap10} onPress={leaveGroup}>
              <SimpleLineIcons name="logout" size={24} color="red" />
              <PaperText style={[styles.leaveGroupTitle, { color: "red" }]}>
                グループ退出
              </PaperText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <ChangeNameModal
        visible={showNameChange}
        onClose={handleShowNameChange}
        currentGroupId={parseInt(groupId, 10)}
        groupInfo={groupInfo}
        refresDetaiScreen={handleRefreshGroupDetail}
        onUpdateGroup={handleUpdateGroup}
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
    justifyContent: "center",
    alignItems: "center",
  },
  rowgap10: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  groupName: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  changeName: {
    fontSize: 16,
    marginBottom: 10,
    color: "blue",
  },
  groupInfo: {
    padding: 10,
    borderRadius: 10,
    marginTop: 80,
    marginBottom: 20,
    borderTopWidth: 10,
    borderTopColor: "#4da6ff",
    backgroundColor: "#fff",
  },
  TopLineContainer: {
    borderTopColor: "gray",
    borderTopWidth: 1,
  },
  groupDescription: {
    fontSize: 18,
  },
  descriptionText: {
    marginBottom: 10,
    padding: 10,
    borderLeftWidth: 1,
    borderLeftColor: "red",
  },
  memberList: {
    fontSize: 18,
  },
  leaveGroup: {
    gap: 10,
    padding: 10,
    borderRadius: 10,
    borderTopWidth: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopColor: "#4da6ff",
  },
  leaveGroupTitle: {
    fontSize: 18,
  },
});
