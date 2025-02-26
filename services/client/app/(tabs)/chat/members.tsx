import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import GroupServices from "@/src/api/GroupServices";
import AddMemberModal from "@/src/components/GroupChat/settings/AddMemberModal";
import CustomHeader from "@/src/components/GroupChat/settings/MemberCustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

type Member = {
  id: number;
  profile: {
    fullname: string;
    profile_picture?: string;
  };
  added_by?: number;
};

type GroupInfo = {
  id: number;
  group_members: Member[];
};

export default function MembersScreen() {
  const { group_members, admin_id, logged_in_user_id, group_id } =
    useLocalSearchParams<{
      group_members: string;
      admin_id: string;
      logged_in_user_id: string;
      group_id: string;
    }>();
  const isDark = useColorScheme() === "dark";
  const groupId = group_id || "0";
  const [members, setMembers] = useState<Member[]>(
    group_members ? JSON.parse(group_members) : []
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [groupInfo, setGroupInfo] = useState<GroupInfo>({
    id: Number(groupId),
    group_members: members,
  });
  const {t} = useTranslation();

  useEffect(() => {
    const checkForDuplicateIds = () => {
      const ids = members.map((member) => member.id);
      const uniqueIds = new Set(ids);
      if (uniqueIds.size !== ids.length) {
        console.warn("Duplicate IDs found in members array");
      }
    };
    checkForDuplicateIds();
  }, [members]);

  const handleRemoveMember = async (memberId: number) => {
    const numericGroupId = Number(groupId);

    if (isNaN(numericGroupId) || numericGroupId === 0) {
      Alert.alert("Error", "Invalid group ID.");
      return;
    }

    Alert.alert(
      t("groupchat.removeMember"),
      t("groupchat.removeConfirm"),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("remove"),
          onPress: async () => {
            try {
              await GroupServices.removeMemberFromGroup(
                numericGroupId,
                memberId
              );
              Alert.alert(t("success"), t("groupchat.removeSuccess"));
              setMembers((prevMembers) =>
                prevMembers.filter((member) => member.id !== memberId)
              );
              setGroupInfo((prevInfo) => ({
                ...prevInfo,
                group_members: prevInfo.group_members.filter(
                  (member) => member.id !== memberId
                ),
              }));
            } catch (error) {
              Alert.alert(
                t("error"),
                t("groupchat.removeProblem")
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
        setGroupInfo((prevInfo) => ({
          ...prevInfo,
          group_members: response.data.group_members,
        }));
      } catch (error) {
        Alert.alert(
          t("error"),
          t("groupchat.updateProblem")
        );
      }
    };

    updateMembers();
  }, [groupId]);

  const handleAddMember = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

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
      backgroundColor: isDark ? "#333" : "#eee",
    },
    memberItem: {
      padding: 10,
      borderRadius: 10,
      marginBottom: 8,
      gap: 15,
      backgroundColor: isDark ? "#444" : "white",
      borderBottomWidth: 1,
      borderBottomColor: "lightgray",
      flexDirection: "row",
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
    leftSide: {
      flex: 1,
      gap: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    profileImage: {
      height: 50,
      width: 50,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "lightgray",
    },
    firstCharText: {
      fontSize: 18,
      color: isDark ? "white" : "black",
    },
    statusText: {
      fontSize: 12,
      color: isDark ? "white" : "gray",
    },
    noAvailableUserName: {
      fontSize: 18,
      color: isDark ? "white" : "black",
    },
  });

  const handleMemberAdded = async (newMembers: Member[]) => {
    try {
      const response = await GroupServices.getGroupById(groupId);
      setMembers(response.data.group_members);
      setGroupInfo((prevInfo) => ({
        ...prevInfo,
        group_members: response.data.group_members,
      }));
      setModalVisible(false);
    } catch (error) {
      Alert.alert(
        t("error"),
        t("groupchat.updateProblem")
      );
    }
  };

  if (members.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("groupchat.nomemberFound")}</Text>
      </View>
    );
  }

  const getMemberStatus = (member: Member) => {
    if (member.id === Number(admin_id)) {
      return "Group Creator";
    }
    if (member.added_by) {
      const addedBy = members.find((m) => m.id === member.added_by);
      return addedBy ? `Added by ${addedBy.profile?.fullname}` : "";
    }
    return "";
  };

  const memberItem = ({ item }: { item: Member }) => (
    <View style={styles.memberItem}>
      <View style={styles.leftSide}>
        {item.profile?.profile_picture ? (
          <Image
            source={{
              uri: item.profile.profile_picture,
            }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profileImage}>
            <Text style={styles.firstCharText}>
              {item.profile?.fullname
                ? item.profile?.fullname.charAt(0).toUpperCase()
                : ""}
            </Text>
          </View>
        )}
        <View>
          <Text style={styles.noAvailableUserName}>
            {item.profile?.fullname || t("groupchat.noavailableName")}
          </Text>
          <Text style={styles.statusText}>{getMemberStatus(item)}</Text>
        </View>
      </View>
      {logged_in_user_id === admin_id &&
        item.id !== Number(admin_id) &&
        item.id !== Number(logged_in_user_id) && (
          <TouchableOpacity
            onPress={() => handleRemoveMember(item.id)}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>{t("delete")}</Text>
          </TouchableOpacity>
        )}
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDark ? "#333" : "#f0f0f0" }}
    >
      <CustomHeader onAddMember={handleAddMember} />
      <FlatList
        data={members}
        scrollEnabled={true}
        keyExtractor={(item) => item.id.toString()}
        renderItem={memberItem}
        style={styles.container}
      />
      {modalVisible && (
        <AddMemberModal
          visible={modalVisible}
          onClose={handleModalClose}
          groupInfo={groupInfo}
          onMemberAdded={handleMemberAdded}
        />
      )}
    </SafeAreaView>
  );
}
