import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text as PaperText } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import GroupServices from "@/src/api/GroupServices";
import { GroupData } from "../GroupHeader";
import { useUser } from "@/src/hooks/UserContext";
import ChangeNameModal from "./ChangeNameModal";
import {
  FontAwesome6,
  MaterialIcons,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import AddMemberModal from "./AddMemberModal";
import * as ImagePicker from "expo-image-picker";

export default function SettingModal() {
  const { groupId = "0" } = useLocalSearchParams<{
    groupId?: string;
  }>();
  const [groupInfo, setGroupInfo] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [showNameChange, setShowNameChange] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [groupImage, setGroupImage] = useState<string[] | undefined>();


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

  useFocusEffect(
    useCallback(() => {
      fetchGroupInfo();
    }, [])
  );
  useEffect(() => {
    if (groupInfo?.group_image) {
      setGroupImage([groupInfo?.group_image]);
    }
  }, [groupInfo?.group_image]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = [result.assets[0].uri];
      const index = 0;

      const formData: any = new FormData();
      const uriParts = selectedImages[0].split(".");
      const fileType = uriParts[uriParts.length - 1];

      formData.append("icon", {
        uri: selectedImages[0],
        name: `image${index}.${fileType}`,
        type: `image/${fileType}`,
      });

      try {
        await GroupServices.changeGroupImage(groupId, formData);
        setGroupImage(selectedImages);
      } catch (err) {
        Alert.alert(
          "Error",
          "Failed to update group image. Please try again later."
        );
      }
    }
  };

  const handleRefreshGroupDetail = () => {
    fetchGroupInfo();
  };

  const handleShowNameChange = () => {
    setShowNameChange(!showNameChange);
  };
  const handleShowAddMember = () => {
    setShowAddMember(!showAddMember);
  };

  const updateGroupMembers = (newMembers) => {
    setGroupInfo((prev) =>
      prev
        ? {
            ...prev,
            group_members: newMembers,
          }
        : null
    );
  };

  const deleteGroup = async () => {
    try {
      await GroupServices.deleteGroup(parseInt(groupId, 10));
      router.dismiss(3);
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
    setGroupInfo((prev) =>
      prev
        ? {
            ...prev,
            name: data.name,
            description: data.description,
          }
        : null
    );
  };

  const leaveGroup = async () => {
    const numericGroupId = Number(groupId);
    Alert.alert(
      "グループの退出",
      "グループを退出します?\n退出したあと、グループのメンバーとしては扱われません。",
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "退出",
          onPress: async () => {
            try {
              const res = await GroupServices.leaveGroup(numericGroupId);
              Alert.alert("成功", "グループを退出しました。");
              router.dismiss(3);
            } catch (error) {
              Alert.alert(
                "エラー",
                "退出際に問題が発生しました。もう一度試してみてください。"
              );
            }
          },
          style: "destructive",
        },
      ]
    );
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
            {groupImage ? (
              <Image
                source={{ uri: groupImage[groupImage.length - 1] }}
                style={{ height: 150, width: 150, borderRadius: 50 }}
              />
            ) : (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                {groupInfo?.name?.charAt(0).toUpperCase()}
              </Text>
            )}
            <Text style={styles.groupName}>{groupInfo.name}</Text>
            <TouchableOpacity onPress={handleShowNameChange}>
              <PaperText style={styles.changeName}>名前と説明の変更</PaperText>
            </TouchableOpacity>
            <View style={styles.rowgap10}>
            <TouchableOpacity
              style={styles.addMember}
              onPress={handleShowAddMember}
            >
              <Ionicons name="person-add" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.addMember}
            onPress={pickImage}>
            <Entypo name="image" size={24} color="black" />
            </TouchableOpacity>
            </View>
          </View>
          <View style={styles.groupInfo}>
            <View style={styles.rowgap10}>
              <Entypo name="info-with-circle" size={24} color="black" />
              <Text style={styles.groupDescription}>グループの説明:</Text>
            </View>
            <View style={styles.descriptionTextContainer}>
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
                <FontAwesome6 name="people-group" size={22} color="black" />
                <Text style={styles.memberList}>メンバーリスト</Text>
              </View>
              <AntDesign name="right" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {groupInfo.admin_id === loggedInUserId ? (
            <TouchableOpacity
              onPress={confirmDeleteGroup}
              style={[styles.leaveGroup, styles.rowBetween]}
            >
              <View style={[styles.rowgap10]}>
                <MaterialIcons name="delete" size={24} color="black" />
                <PaperText style={[styles.leaveGroupTitle, styles.margin10]}>
                  グループの削除
                </PaperText>
              </View>

              <AntDesign name="right" size={24} color="black" />
            </TouchableOpacity>
          ) : null}
          <View style={styles.leaveGroup}>
            <TouchableOpacity style={styles.rowgap10} onPress={leaveGroup}>
              <SimpleLineIcons name="logout" size={21} color="red" />
              <PaperText
                style={[
                  styles.leaveGroupTitle,
                  styles.margin10,
                  { color: "red" },
                ]}
              >
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
      <AddMemberModal
        visible={showAddMember}
        onClose={handleShowAddMember}
        groupInfo={groupInfo}
        onMemberAdded={(newMembers) => updateGroupMembers(newMembers)}
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
  addMember: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  rowgap10: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  margin10: {
    marginTop: 10,
    marginBottom: 10,
  },
  rowBetween: {
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  groupName: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  changeName: {
    fontSize: 16,
    color: "blue",
  },
  groupInfo: {
    padding: 10,
    borderRadius: 10,
    marginTop: 60,
    marginBottom: 5,
    backgroundColor: "#fff",
  },
  TopLineContainer: {
    borderTopColor: "gray",
    borderTopWidth: 1,
  },
  groupDescription: {
    fontSize: 18,
  },
  descriptionTextContainer: {
    padding: 10,
  },
  memberList: {
    fontSize: 18,
  },
  leaveGroup: {
    gap: 10,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  leaveGroupTitle: {
    fontSize: 18,
  },
});
