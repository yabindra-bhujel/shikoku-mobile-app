import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  Image,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AntDesign } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";

export interface GroupData {
  id: string;
  name: string;
  admin_id: number;
  description: string;
  group_image?: string;
  member_count?: number;
  group_members?: {
    id: number;
    profile: {
      fullname: string;
    };
  }[];
}
const GroupHeader = ({ groupData }: { groupData: GroupData }) => {
  const isDark = useColorScheme() === 'dark';

  const goBack = () => {
    router.back();
  };

  const styles = StyleSheet.create({
    communityHomeHeader: {
      padding: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: isDark ? "#333" : "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "lightgray",
    },
  });

  return (
    <View style={styles.communityHomeHeader}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons
            name="chevron-back-sharp"
            size={24}
            color={isDark ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDark ? "#333" : "#fff",
            gap: 20,
          }}
        >
          {groupData.group_image ? (
            <Image
              source={{ uri: groupData.group_image }}
              style={{ height: 50, width: 50, borderRadius: 50 }}
            />
          ) : (
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: isDark ? "#fff" : "#000",
                backgroundColor: isDark ? "#333" : "#fff",
              }}
            >
              {groupData?.name?.charAt(0).toUpperCase()}
            </Text>
          )}

          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: isDark ? "#fff" : "#000",
              }}
            >
              {groupData.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: isDark ? "#fff" : "#000",
              }}
            >
              メンバー数: {groupData.member_count}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          if (groupData.id) {
            router.push(`/chat/settings?groupId=${groupData.id}`);
          } else {
            Alert.alert("エラー", "グループIDの取得に失敗しました。");
          }
        }}
      >
        <AntDesign name="setting" size={24} color={isDark ? "white": "black"} />
      </TouchableOpacity>
    </View>
  );
};

export default GroupHeader;
