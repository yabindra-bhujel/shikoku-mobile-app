import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  useColorScheme,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Feather } from "@expo/vector-icons";
import UserIconAndUsername from "@/src/components/GroupChat/UserIconAndUsername";
import CreateGroup from "@/src/components/GroupChat/CreateGroup";
import GroupServices from "@/src/api/GroupServices";
import { useFocusEffect } from "@react-navigation/native";

export interface Group {
  id: number;
  name: string;
  description: string;
  group_image?: string;
}

const GroupChat = () => {
  const theme = useColorScheme();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState<string>("");
  const isDark = useColorScheme() === "dark";

  const fetchGroups = async () => {
    try {
      const response = await GroupServices.getGroups();
      setGroups(response.data.groups);
      setFilteredGroups(response.data.groups);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to fetch groups data from server. Please try again later."
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );
  const handleRefreshGroup = () => {
    fetchGroups();
  };

  const toggleOpenCloseModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    if (query) {
      const filtered = groups.filter((group) =>
        group.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredGroups(filtered);
    } else {
      setFilteredGroups(groups);
    }
  };

  const clearSearch = () => {
    setSearch("");
    setFilteredGroups(groups);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#333" : "#fff",
    },
    communityHomeHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      backgroundColor: theme === "dark" ? "#333" : "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "lightgray",
    },
    addButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
      backgroundColor: "green",
      padding: 10,
      borderRadius: 50,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    headerSearchBarContainer: {
      backgroundColor: isDark ? "#333" : "#fff",
      width: "100%",
      alignItems: "center",
      padding: 10,
    },
    headerSearchBar: {
      flexDirection: "row",
      backgroundColor: isDark ? "#666" : "#eee",
      padding: 10,
      width: "98%",
      borderRadius: 10,
      alignItems: "center",
    },
    headerSearchBarLeft: {
      flexDirection: "row",
      flex: 1,
      gap: 10,
    },
    headerSearchBarInput: {
      flex: 1,
      fontSize: 16,
      color: isDark ? "white" : "black",
    },
    deleteIcon: {
      marginLeft: 10,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerSearchBarContainer}>
        <View style={styles.headerSearchBar}>
          <View style={styles.headerSearchBarLeft}>
            <AntDesign name="search1" size={24} color={"gray"} />
            <TextInput
              placeholder="Search"
              placeholderTextColor={"gray"}
              value={search}
              onChangeText={handleSearch}
              style={styles.headerSearchBarInput}
            />
          </View>
          {search.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.deleteIcon}>
              <Feather
                name="delete"
                size={24}
                color={isDark ? "white" : "black"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* User list */}
      <UserIconAndUsername groups={filteredGroups} isDark={isDark} />

      {/* Add button */}
      <TouchableOpacity style={styles.addButton} onPress={toggleOpenCloseModal}>
        <AntDesign name="plus" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal for Add Form */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <CreateGroup
          toggleCloseModal={toggleOpenCloseModal}
          refreshGroupList={handleRefreshGroup}
        />
      </Modal>
    </View>
  );
};

export default GroupChat;
