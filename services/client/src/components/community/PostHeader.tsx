import React from "react";
import { StyleSheet, Text, View } from "react-native";
import UserAvatar from "../UserAvatar";
import Feather from "@expo/vector-icons/Feather";

interface PostHeaderProps {
  imageUrl?: string;
  username?: string;
  time?: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  imageUrl,
  username,
  time,
}) => {
  return (
    <View style={styles.postHeader}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <UserAvatar url={imageUrl} />
        <View style={styles.usernameTime}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            {username}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "gray",
            }}
          >
            {time}
          </Text>
        </View>
      </View>

      <Feather name="more-horizontal" size={24} color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  usernameTime: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 10,
  },
});

export default PostHeader;
