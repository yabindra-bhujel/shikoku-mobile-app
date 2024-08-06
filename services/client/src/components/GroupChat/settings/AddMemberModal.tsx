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
} from "react-native";
import { Text } from "react-native-paper";
import UserAvatar from "../../UserAvatar";
import { CheckBox } from "react-native-elements";
import { UserData } from "@/src/api/UserServices";
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
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMoreUsers, setHasMoreUsers] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async (pageNumber: number) => {
      try {
        const response = await axiosInstance.get(
          `/user_profile/group_create?page=${pageNumber}&page_size=50&size=50`
        );
        const data = response.data;
        if (data && Array.isArray(data.items)) {
          setUsers((prevUsers) => [...prevUsers, ...data.items]);
          if (data.items.length < 50) {
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
    console.log(data);
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

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <SafeAreaView style={styles.modalView}>
        <View style={styles.centeredView}>
          <View style={styles.headerModal}>
            <TouchableOpacity style={styles.headerLeft} onPress={onClose}>
              <Text>Close</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.modalText}>Add Members</Text>
            </View>
            <View style={styles.headerRight}>
              {selectedUsers.length > 0 && (
                <TouchableOpacity onPress={addMember}>
                  <Text>Add</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={styles.modalBody}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={24} color="#444" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users"
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
            />
            {searchQuery.length > 0 && (
              <Feather
                name="delete"
                size={24}
                color="#444"
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
              <Text style={styles.noUsersText}>No users available for adding.</Text>
            )}
            {loading && (
              <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AddMemberModal;

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: "#eee",
  },
  centeredView: {
    borderRadius: 10,
  },
  modalText: {
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
  modalBody: {
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
  loader: {
    marginTop: 20,
  },
});
