import React, { useState, useEffect } from "react";
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
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import GroupServices from "@/src/api/GroupServices";

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
  const theme = useColorScheme();
  const router = useRouter();
  const [groupImage, setGroupImage] = useState<string[] | undefined>();

  useEffect(() => {
    if (groupData.group_image) {
      setGroupImage([groupData.group_image]);
    }
  }, [groupData.group_image]);

  const goBack = () => {
    router.back();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = [result.assets[0].uri];
      const index = 0;

      const formData: any = new FormData();
      const uriParts = selectedImages[0].split(".");
      const fileType = uriParts[uriParts.length - 1];

      formData.append("icon", {
        uri: selectedImages[0],
        name: `image${index}.${fileType}`,
        type: `image/${fileType}`,
      });

      try {
        await GroupServices.changeGroupImage(groupData.id, formData);
        setGroupImage(selectedImages);
      } catch (err) {
        Alert.alert(
          "Error",
          "Failed to update group image. Please try again later."
        );
      }
    }
  };

  const styles = StyleSheet.create({
    communityHomeHeader: {
      padding: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme === "dark" ? "#333" : "#fff",
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
            color={theme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            gap: 20,
          }}
        >
          <TouchableOpacity onPress={pickImage}>
            {groupImage ? (
              <Image
                source={{ uri: groupImage[groupImage.length - 1] }}
                style={{ height: 50, width: 50, borderRadius: 50 }}
              />
            ) : (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: theme === "dark" ? "#fff" : "#000",
                  backgroundColor: theme === "dark" ? "#333" : "#fff",
                }}
              >
                {groupData?.name?.charAt(0).toUpperCase()}
              </Text>
            )}
          </TouchableOpacity>

          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: theme === "dark" ? "#fff" : "#000",
              }}
            >
              {groupData.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: theme === "dark" ? "#fff" : "#000",
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
            Alert.alert("Error", "Group ID is missing.");
          }
        }}
      >
        <AntDesign name="setting" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default GroupHeader;
