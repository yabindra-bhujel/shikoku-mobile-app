import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { Text } from "react-native-paper";
import UserAvatar from "../../UserAvatar";
import { CheckBox } from "react-native-elements";
import { UserData } from "@/src/api/UserServices";
import { useUser } from "@/src/hooks/UserContext";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import GroupServices from "@/src/api/GroupServices";
import axiosInstance from "@/src/config/Api";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";


const AddMemberModal = ({
  visible,
  onClose,
  groupInfo,
  onMemberAdded,
}: {
  visible: boolean;
  onClose: () => void;
  groupInfo: any;
  onMemberAdded: (newMembers: any) => void;
}) => {
  const { loggedInUserId } = useUser();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMoreUsers, setHasMoreUsers] = useState<boolean>(true);
  const isDark = useColorScheme() === "dark";
  const {t} = useTranslation();

  useEffect(() => {
    const fetchUsers = async (pageNumber: number) => {
      try {
        const response = await axiosInstance.get(
          `/user_profile/group_create?page=${pageNumber}&page_size=50&size=50`
        );
        const data = response.data;
        if (data && Array.isArray(data.items)) {
          // 既存のユーザーIDセットを作成
          const existingUserIds = new Set(users.map(user => user.user_id));

          // 新しいユーザーリストを作成し、重複を除外
          const newUsers = data.items.filter(user => !existingUserIds.has(user.user_id));

          // 新しいユーザーを追加
          setUsers((prevUsers) => [...prevUsers, ...newUsers]);

          if (newUsers.length < 50) {
            setHasMoreUsers(false);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        Alert.alert("Error fetching users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers(page);
  }, [page]);

  const handleLoadMore = () => {
    if (!loading && hasMoreUsers) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const isUserInGroup = (userId: number) => {
    return groupInfo.group_members.some((member: any) => member.id === userId);
  };

  const filteredUsers =
    users?.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        user.user_id !== loggedInUserId &&
        !isUserInGroup(user.user_id)
    ) || [];

  const clearSearch = () => {
    setSearchQuery("");
  };

  const addMember = async () => {
    const data = {
      user_list: selectedUsers,
    };
    try {
      const response = await GroupServices.addMember(groupInfo.id, data);
      if (response.status === 200) {
        Alert.alert("Member added successfully!");
        const newMembers = [
          ...groupInfo.group_members,
          ...selectedUsers.map((user_id) => ({ id: user_id })),
        ];
        onMemberAdded(newMembers);
        onClose();
      } else {
        Alert.alert("Error", "Failed to add member. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add member. Please try again.");
    }
  };

  const styles = StyleSheet.create({
    modalView: {
      flex: 1,
      backgroundColor: isDark ? "#222" : "#eee",
    },
    centeredView: {
      borderRadius: 10,
    },
    headerText: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#f5f5f5" : "#333",
    },
    headerModal: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDark ? '#333' : '#f8f8f8',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      shadowColor: isDark ? '#000' : '#ccc',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    headerLeft: {
      flex: 1,
    },
    headerRightText: {
      color: isDark ? "#ffffff" : "#007bff",
      fontSize: 18, 
      fontWeight: "700",
      textAlign: 'center',
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 25,
      backgroundColor: isDark ? "#0056b3" : "#e0f7fa",
      textTransform: 'uppercase',
      elevation: 2,
    },

    headerLeftText: {
      color: isDark ? "#ffffff" : "#ffffff",
      fontSize: 18, 
      fontWeight: "700",
      textAlign: 'center',
      paddingVertical: 8,
      paddingHorizontal: 14, 
      borderRadius: 25, 
      backgroundColor: isDark ? "#ff3b30" : "#ff3b30", 
      textTransform: 'uppercase',
      elevation: 2,
    },
    headerCenter: {
      flex: 2,
      alignItems: "center",
    },
    headerRight: {
      flex: 1,
      alignItems: "flex-end",
    },
    modalBody: {
      flex: 1,
      padding: 20,
      alignItems: "center",
      backgroundColor: isDark ? "#222" : "#eee",
      borderRadius: 20,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark ? "#333" : "#fff",
      borderRadius: 10,
      margin: 10,
      paddingHorizontal: 10,
      height: 50,
      elevation: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: isDark ? "white" : "black",
    },
    userListContainer: {
      flex: 1,
      width: "100%",
      padding: 20,
      backgroundColor: isDark ? "#666" : "#fff",
      borderRadius: 10,
    },
    userItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    userName: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDark ? "white" : "black",
      marginLeft: 10,
    },
    noUsersText: {
      fontSize: 16,
      color: isDark ? "white" : "gray",
      textAlign: "center",
      marginTop: 20,
    },
    loader: {
      marginTop: 20,
    },
  });

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <SafeAreaView style={styles.modalView}>
        <View style={styles.centeredView}>
          <View style={styles.headerModal}>
            <TouchableOpacity style={styles.headerLeft} onPress={onClose}>
              <Text style={styles.headerLeftText}>{t("close")}</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerText}>{t("groupchat.addmember")}</Text>
            </View>
            <View style={styles.headerRight}>
              {selectedUsers.length > 0 && (
                <TouchableOpacity onPress={addMember}>
                  <Text style={styles.headerRightText}>{t("add")}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={styles.modalBody}>
          <View style={styles.searchBar}>
            <MaterialIcons
              name="search"
              size={24}
              color={isDark ? "gray" : "#444"}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={t("groupchat.userSearch")}
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
            />
            {searchQuery.length > 0 && (
              <Feather
                name="delete"
                size={24}
                color={isDark ? "white" : "#444"}
                onPress={clearSearch}
              />
            )}
          </View>
          <ScrollView
            style={styles.userListContainer}
            onScroll={({ nativeEvent }) => {
              const { layoutMeasurement, contentOffset, contentSize } =
                nativeEvent;
              if (
                layoutMeasurement.height + contentOffset.y >=
                contentSize.height - 20
              ) {
                handleLoadMore();
              }
            }}
            scrollEventThrottle={400}
          >
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TouchableOpacity
                  key={user.user_id.toString()} // Ensure unique key
                  onPress={() => toggleUserSelection(user.user_id)}
                  style={styles.userItem}
                >
                  <View style={styles.userInfo}>
                    <UserAvatar url={user.user_image} width={30} height={30} />
                    <Text style={styles.userName}>{user.username}</Text>
                  </View>
                  <CheckBox
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    iconType="material-community"
                    checkedColor="#0099ff"
                    checked={selectedUsers.includes(user.user_id)}
                    onPress={() => toggleUserSelection(user.user_id)}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noUsersText}>
                {t("groupchat.nouserAvailable")}
              </Text>
            )}
            {loading && (
              <ActivityIndicator
                size="large"
                color="#6200ee"
                style={styles.loader}
              />
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AddMemberModal;
