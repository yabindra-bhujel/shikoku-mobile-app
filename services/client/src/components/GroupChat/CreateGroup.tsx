import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import UserAvatar from "../UserAvatar";
import { CheckBox } from "react-native-elements";
import GroupServices from "@/src/api/GroupServices";
import UserServices, { UserData } from "@/src/api/UserServices";

interface CreateGroupProps {
  toggleCloseModal: () => void;
}

const CreateGroup: React.FC<CreateGroupProps> = ({ toggleCloseModal }) => {
  const [groupName, setGroupName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers: UserData[] = await UserServices.GetAllUser();
        setUsers(allUsers);
      } catch (error) {
        Alert.alert("Error fetching users. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName) {
      Alert.alert("Please fill the group name");
      return;
    }
    try {
      const data = {
        name: groupName,
        description,
        group_type: "private",
        members: selectedUsers,
      };
      console.log(data, "group data");
      await GroupServices.createGroup(data);
      toggleCloseModal();
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

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Group</Text>
          <TouchableOpacity onPress={toggleCloseModal}>
            <Ionicons name="close-sharp" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <TextInput
          label="Group Name"
          mode="outlined"
          value={groupName}
          onChangeText={setGroupName}
          style={styles.input}
        />
        <TextInput
          label="Description"
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          multiline
          style={[styles.input, styles.description]}
        />
        <TextInput
          label="Search Users"
          mode="outlined"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
        />
        <ScrollView style={styles.userListContainer}>
          {filteredUsers.map((user) => (
            <View key={user.user_id} style={styles.userItem}>
              <View style={styles.userInfo}>
                <UserAvatar url={user.user_image} width={30} height={30} />
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
            </View>
          ))}
        </ScrollView>
        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleCreateGroup}
            style={styles.createButton}
          >
            Create
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    height: "92%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
  },
  input: {
    marginBottom: 20,
  },
  description: {
    height: 100,
  },
  userListContainer: {
    maxHeight: "40%", // Adjust as necessary
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
  footer: {},
  createButton: {
    marginTop: 10,
  },
});

export default CreateGroup;
