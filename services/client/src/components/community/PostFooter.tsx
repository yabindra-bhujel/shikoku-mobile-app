import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface PostFooterProps {
  totalLikes?: number;
  totalComments?: number;
}

const PostFooter: React.FC<PostFooterProps> = ({
  totalLikes,
  totalComments,
}) => {
  return (
    <View style={styles.postFooter}>
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <AntDesign name="heart" size={24} color="red" />
          <Text style={styles.actionText}>{totalLikes} Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <AntDesign name="message1" size={24} color="black" />
          <Text style={styles.actionText}>{totalComments} Comments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },
  moreButton: {
    padding: 5,
  },
});

export default PostFooter;
