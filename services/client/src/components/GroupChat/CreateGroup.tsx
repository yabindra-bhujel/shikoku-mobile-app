import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput as NativeInput,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";
import UserAvatar from "../UserAvatar";
import { CheckBox } from "react-native-elements";
import GroupServices from "@/src/api/GroupServices";
import UserServices, { UserData } from "@/src/api/UserServices";
import { useUser } from "@/src/hooks/UserContext";
import axiosInstance from "@/src/config/Api";

interface CreateGroupProps {
  toggleCloseModal: () => void;
  refreshGroupList: () => void;
}

const CreateGroup: React.FC<CreateGroupProps> = ({
  toggleCloseModal,
  refreshGroupList,
}) => {
  const { loggedInUserId } = useUser();
  const [groupName, setGroupName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loggedInUserId !== null) {
      setSelectedUsers([loggedInUserId]);
    }
  }, [loggedInUserId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(
          "/user_profile/group_create?page=1&page_size=50&size=50"
        );
        const data = response.data;
        if (data && Array.isArray(data.items)) {
          setUsers(data.items);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        Alert.alert("Error fetching users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName) {
      Alert.alert("Please fill the group name");
      return;
    }
    if (!selectedUsers.length) {
      Alert.alert("Please select at least one user");
      return;
    }
    const data = {
      name: groupName,
      description,
      group_type: "private",
      member_list: selectedUsers,
    };
    try {
      const res = await GroupServices.createGroup(data);
      if (res) {
        refreshGroupList();
        toggleCloseModal();
      }
    } catch (error) {
      Alert.alert("Something went wrong. Please try again.");
    }
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      user.user_id !== loggedInUserId
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Group</Text>
            <TouchableOpacity onPress={toggleCloseModal}>
              <Ionicons name="close-sharp" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View>
            <TextInput
              label="Group Name"
              mode="outlined"
              value={groupName}
              onChangeText={setGroupName}
              style={styles.input}
              theme={{ colors: { primary: "#6200ee" } }}
            />
            <TextInput
              label="Description"
              mode="outlined"
              value={description}
              onChangeText={setDescription}
              multiline
              style={[styles.input, styles.description]}
              theme={{ colors: { primary: "#6200ee" } }}
            />
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color="gray"
                style={styles.searchIcon}
              />
              <NativeInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                placeholder="Search Users"
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Feather name="x-circle" size={24} color="black" />
                </TouchableOpacity>
              ) : null}
            </View>
            <ScrollView style={styles.userListContainer}>
              {loading ? (
                <ActivityIndicator
                  size="large"
                  color="#6200ee"
                  style={styles.loader}
                />
              ) : (
                filteredUsers.map((user) => (
                  <TouchableOpacity
                    key={user.user_id}
                    onPress={() => toggleUserSelection(user.user_id)}
                    style={styles.userItem}
                  >
                    <View style={styles.userInfo}>
                      <UserAvatar
                        url={user.user_image}
                        width={30}
                        height={30}
                      />
                      <Text style={styles.userName}>{user.username}</Text>
                    </View>
                    <CheckBox
                      checkedIcon="checkbox-marked"
                      uncheckedIcon="checkbox-blank-outline"
                      iconType="material-community"
                      checkedColor="green"
                      checked={selectedUsers.includes(user.user_id)}
                      onPress={() => toggleUserSelection(user.user_id)}
                    />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
          <View>
            <Button
              mode="contained"
              onPress={handleCreateGroup}
              style={styles.createButton}
              theme={{ colors: { primary: "#6200ee" } }}
            >
              Create
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 20,
    backgroundColor: "white",
  },
  description: {
    height: 100,
  },
  userListContainer: {
    height: "50%",
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
  footer: {
    justifyContent: "center",
  },
  createButton: {
    marginTop: 15,
    padding: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#aaa",
    backgroundColor: "#fff",
    width: "100%",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
  },
  loader: {
    marginTop: 20,
  },
});

export default CreateGroup;