import React from "react";
import { StyleSheet, Text, View } from "react-native";
import UserAvatar from "../UserAvatar";
import Feather from "@expo/vector-icons/Feather";
import { DateFormat } from "@/src/ReusableComponents/DateFormat";

interface PostHeaderProps {
  imageUrl?: string;
  username?: string;
  time?: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  imageUrl,
  username = "Unknown User",
  time = "",
}) => {
  return (
    <View style={styles.postHeader}>
      <View style={styles.avatarAndText}>
        <UserAvatar url={imageUrl} />
        <View style={styles.usernameTime}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.time}>
            <DateFormat date={time} />
          </Text>
        </View>
      </View>
      <Feather name="more-horizontal" size={24} color="#333" />
    </View>
  );
};

const styles = StyleSheet.create({
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff", 
  },
  avatarAndText: {
    flexDirection: "row",
    alignItems: "center",
  },
  usernameTime: {
    // marginLeft: 10, 
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
});

export default PostHeader;
