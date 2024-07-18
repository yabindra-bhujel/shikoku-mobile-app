import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { Group } from "@/src/screens/Chat/GroupChat";

interface UserIconAndUsernameProps {
  groups: Group[];
}

const UserIconAndUsername: React.FC<UserIconAndUsernameProps> = ({
  groups = [],
}) => {
  const navigationToChatDetail = (groupId: number) => {
    router.push(`chat/${groupId}`);
  };

  // Sort groups alphabetically by name
  const sortedGroups = [...groups].sort((a, b) => a.name.localeCompare(b.name));

  // Group the sorted groups by their initial letter
  const groupedGroups = sortedGroups.reduce((acc, group) => {
    const firstLetter = group.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(group);
    return acc;
  }, {} as Record<string, Group[]>);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.GroupListContainer}
    >
      {Object.keys(groupedGroups)
        .sort()
        .map((letter) => (
          <View key={letter}>
            <Text style={styles.sectionHeader}>{letter}</Text>
            {groupedGroups[letter].map((group: Group) => (
              <TouchableOpacity
                key={group.id}
                onPress={() => navigationToChatDetail(group.id)}
              >
                <View style={styles.groupItem}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={styles.groupImageContainer}>
                      {group.group_image ? (
                        <Image
                          source={{ uri: group.group_image }}
                          style={styles.groupImage}
                        />
                      ) : (
                        <Text style={styles.groupInitial}>
                          {group.name.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.groupName}>{group.name}</Text>
                    </View>
                  </View>

                  <TouchableOpacity>
                    <AntDesign name="right" size={22} color="green" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  GroupListContainer: {
    flex: 1,
    padding: 10,
  },
  sectionHeader: {
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  groupItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    backgroundColor: "#fff",
    borderBottomColor: "lightgray",
  },
  groupImageContainer: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
  },
  groupImage: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  groupInitial: {
    fontSize: 20,
    fontWeight: "bold",
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UserIconAndUsername;
