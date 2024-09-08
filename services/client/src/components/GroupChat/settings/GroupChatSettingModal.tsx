import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView,Text,StyleSheet,ActivityIndicator,Alert,useColorScheme,} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import GroupServices from "@/src/api/GroupServices";
import { GroupData } from "../GroupHeader";
import { useUser } from "@/src/hooks/UserContext";
import AddMemberModal from "./AddMemberModal";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import GroupSettingHeader from "./GroupSettingHeader";
import { SettingMenu } from "./SettingMenu";

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
  const isDark = useColorScheme() === "dark";
  const { loggedInUserId } = useUser();
  const {t} = useTranslation();

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
    setGroupInfo((prev) =>prev? {
      ...prev,group_members: newMembers}: null);
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
      t("groupchat.deleteConTitle"),
      t("groupchat.deleteConfirm"),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("delete"),
          style: "destructive",
          onPress: deleteGroup,
        },
      ]
    );
  };

  const leaveGroup = async () => {
    const numericGroupId = Number(groupId);
    Alert.alert(
      t("groupchat.leaveConfirm"),
      t("groupchat.leaveConfirmText"),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("leave"),
          onPress: async () => {
            try {
              const res = await GroupServices.leaveGroup(numericGroupId);
              Alert.alert(t("success"), t("groupchat.leaveSuccess"));
              router.dismiss(3);
            } catch (error) {
              Alert.alert(
                t("error"),
                t("groupchat.leaveProblem")
              );
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const navigateToMembers = () => {
    router.push({
      pathname: `/chat/members`,
      params: {
        group_members: JSON.stringify(groupInfo?.group_members),
        admin_id: groupInfo?.admin_id,
        logged_in_user_id: loggedInUserId,
        group_id: groupInfo?.id,
      },
    });
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
      padding: 10,
    },
    groupInfo: {
      padding: 10,
      borderRadius: 10,
      marginTop: 10,
      marginBottom: 5,
      backgroundColor: isDark ? "#777" : "#fff",
    },
  });

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
        <Text style={styles.errorText}>{t("groupchat.notfoundGroup")}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#333" : "#eee" }}>
      <ScrollView>
        <View style={styles.groupInfoContainer}>
          <GroupSettingHeader
            groupInfo={groupInfo}
            groupImage={groupImage}
            pickImage={pickImage}
            handleShowNameChange={handleShowNameChange}
            handleShowAddMember={handleShowAddMember}
            isDark={isDark}
            refresDetaiScreen={handleRefreshGroupDetail}
          />
         
          <View style={styles.groupInfo}>
            <SettingMenu
              groupInfo={groupInfo}
              loggedInUserId={loggedInUserId}
              isDark={isDark}
              navigateToMembers={navigateToMembers}
              handleLeaveGroup={leaveGroup}
              handleDeleteGroup={confirmDeleteGroup}
             handleShowAddMember={handleShowAddMember}
             />
          </View>
        </View>
      </ScrollView>
 
      <AddMemberModal
        visible={showAddMember}
        onClose={handleShowAddMember}
        groupInfo={groupInfo}
        onMemberAdded={(newMembers) => updateGroupMembers(newMembers)}
      />
    </View>
  );
}
