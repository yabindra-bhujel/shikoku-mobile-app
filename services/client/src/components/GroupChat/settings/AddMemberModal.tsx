import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "react-native-paper";
import UserAvatar from "../../UserAvatar";
import { CheckBox } from "react-native-elements";
import UserServices, { UserData } from "@/src/api/UserServices";
import { useUser } from "@/src/hooks/UserContext";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import GroupServices from "@/src/api/GroupServices";
import axiosInstance from "@/src/config/Api";

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

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          // const allUsers: UserData[] = await UserServices.GetAllUser();
          const get = await axiosInstance.get("/user_profile/group_create?page=1&page_size=50&size=50")
          setUsers(get.data.items);
        } catch (error) {
          Alert.alert("Error fetching users. Please try again.");
        }
      };

      fetchUsers();
    }, []);

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

    const filteredUsers = users?.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        user.user_id !== loggedInUserId && // Exclude logged-in user
        !isUserInGroup(user.user_id) // Exclude users already in the group
    ) || [];

    const clearSearch = () => {
      setSearchQuery("");
    };

    const addMember = async () => {
      console.log(groupInfo);
      const data = {
        user_list: selectedUsers,
      };
      console.log(data);
      try {
        const response = await GroupServices.addMember(groupInfo.id, data);
        if (response.status === 200) {
          Alert.alert("Member added successfully!");
          setSelectedUsers([]);
          const newMembers = [...groupInfo.group_members, ...selectedUsers.map(user_id => ({ id: user_id }))];
          onMemberAdded(newMembers);
          onClose();
        } else {
          Alert.alert("Error adding member. Please try again.");
        }
      } catch (error) {
        Alert.alert("Error adding member. Please try again.");
      }
    };

    return (
      <Modal visible={visible} transparent={true} animationType="slide">
        <SafeAreaView style={styles.ModalView}>
          <View style={styles.CenteredView}>
            <View style={styles.headerModal}>
              <TouchableOpacity style={styles.headerLeft} onPress={onClose}>
                <Text>閉じる</Text>
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.ModalText}>Add Member</Text>
              </View>
              <View style={styles.headerRight}>
                {selectedUsers.length > 0 ? (
                  <TouchableOpacity onPress={addMember}>
                    <Text>Done</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
          <View style={styles.ModalBody}>
            <View style={styles.searchBar}>
              <MaterialIcons name="search" size={24} color="#444" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                onChangeText={(text) => setSearchQuery(text)}
                value={searchQuery}
              />
              {searchQuery.length > 0 ? (
                <Feather
                  name="delete"
                  size={24}
                  color="#444"
                  onPress={clearSearch}
                />
              ) : null}
            </View>
            <ScrollView style={styles.userListContainer}>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TouchableOpacity key={user.user_id} onPress={() => toggleUserSelection(user.user_id)} style={styles.userItem}>
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
                <Text style={styles.noUsersText}>No users available</Text>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

export default AddMemberModal;

const styles = StyleSheet.create({
  ModalView: {
    flex: 1,
    backgroundColor: "#eee",
  },
  CenteredView: {
    borderRadius: 10,
  },
  ModalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  headerModal: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ddd",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: "center",
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  ModalBody: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#eee",
  },
  searchBar: {
    width: "100%",
    height: 50,
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  userListContainer: {
    flex: 1,
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
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
    color: "black",
    marginLeft: 10,
  },
  noUsersText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
});
