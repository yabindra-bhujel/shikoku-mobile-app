import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import UserAvatar from "../UserAvatar";
import { DateFormat } from "@/src/ReusableComponents/DateFormat";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColor } from "@/src/hooks/useThemeColor";

interface PostHeaderProps {
  imageUrl?: string;
  username?: string;
  time?: string;
  showOptions?: boolean;
  isEditing?: boolean;
  handleEditing?: () => void;
  handleDelete?: () => void;
  handleUpdate?: () => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  imageUrl,
  username = "Unknown User",
  time = "",
  showOptions = false,
  isEditing = false,
  handleEditing = () => {},
  handleDelete = () => {},
  handleUpdate = () => {},
}) => {

  const backgroundColor = useThemeColor({}, "postbackground");
  const color = useThemeColor({}, "tint");

  return (
    <View style={[styles.postHeader, {backgroundColor}]}>
      <View style={styles.avatarAndText}>
        <UserAvatar url={imageUrl} height={40} width={40}/>
        <View style={styles.usernameTime}>
          <Text style={[styles.username, {color}]}>{username}</Text>
          <Text style={styles.time}>
            <DateFormat date={time} />
          </Text>
        </View>
      </View>

      {showOptions && (
        <View style={styles.options}>
          <View>
            {isEditing ? (
              <>
                <TouchableOpacity style={styles.iconButton} onPress={handleUpdate}>
                  <Ionicons name="checkmark-circle-outline" size={24} color="#4caf50" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.iconButton} onPress={handleEditing}>
                <Ionicons name="create-outline" size={24} color="#333" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.iconButton} onPress={handleDelete}>
            <Ionicons name="remove-circle-outline" size={24} color="#f44336" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  avatarAndText: {
    flexDirection: "row",
    alignItems: "center",
  },
  usernameTime: {
    marginLeft: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  options: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 15,
    padding: 8,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
  },
});

export default PostHeader;
