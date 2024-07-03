import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import { useRouter, useNavigation } from "expo-router";
import GroupServices from "@/src/api/GroupServices";

interface Group {
  id: number;
  name: string;
  description: string;
  group_image?: string;
}

const UserIconAndUsername = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [groups, setGroups] = React.useState<Group[]>([]);

  const navigationToChatDetail = (groupId: number) => {
    router.navigate(`chat/${groupId}`);
  };

  const openButtonSheet = () => {
  }

  const fetchGroups = async () => {
    try {
      const response = await GroupServices.getGroups();
      setGroups(response.data.groups);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch groups data from server. Please try again later.");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchGroups();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View>
      {groups.map((group) => (
        <TouchableOpacity key={group.id} onPress={() => navigationToChatDetail(group.id)}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "lightgray",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 50,
                  backgroundColor: "lightgray",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {group.group_image ? (
                  <Image
                    source={{ uri: group.group_image }}
                    style={{ height: 50, width: 50, borderRadius: 50 }}
                  />
                ) : (
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {group.name.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>{group.name}</Text>
              </View>
            </View>

            <TouchableOpacity>
              <Feather name="more-horizontal" size={24} color="green" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default UserIconAndUsername;
