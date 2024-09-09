import React from "react";
import { StyleSheet, View, Text, useColorScheme, TouchableOpacity } from "react-native";
import UserAvatar from "../../UserAvatar"; // Assuming this component works for showing avatars
import { useTranslation } from "react-i18next";
import { DateFormat } from "@/src/ReusableComponents/DateFormat";

const CommentList = ({ comments, onReply }) => {
  const { t } = useTranslation();
  const isDark = useColorScheme() === "dark";

  // Function to render each comment (top-level and replies)
  const renderComment = (comment, isReply = false) => (
    <View
      key={comment.id}
      style={[
        styles.commentItem,
        isReply && { marginLeft: 30, marginTop: 10 }, // Indent replies
      ]}
    >
      {/* Avatar Section */}
      <UserAvatar url={comment.user.profile_picture} height={35} width={35} />

      {/* Comment Content */}
      <View style={styles.commentContent}>
        {/* Username and Comment in one line */}
        <Text style={styles.commentText}>
          <Text
            style={[
              styles.username,
              {
                color: isDark ? "#fff" : "#000",
              },
            ]}
          >
            {comment.user.username}{" "}
          </Text>
          <Text
            style={[
              styles.comment,
              {
                color: isDark ? "#ccc" : "#333",
              },
            ]}
          >
            {comment.content}
          </Text>
        </Text>

        {/* Timestamp */}
        <Text style={styles.timeAgo}>
          <DateFormat date={comment.created_at} />
        </Text>

        {/* Reply Button */}
        <TouchableOpacity onPress={() => onReply(comment)}>
          <Text style={styles.replyButton}>{t("Community.reply")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View>
      {comments.map((comment) => (
        <View key={comment.id}>
          {/* Render Top-Level Comment */}
          {renderComment(comment)}

          {/* Render Replies if any */}
          {comment.replies &&
            comment.replies.map((reply) => (
              <View key={reply.id}>
                {renderComment(reply, true)}

                {/* Add Reply Button for Replies */}
                {reply.replies &&
                  reply.replies.map((nestedReply) => (
                    <View key={nestedReply.id}>
                      {renderComment(nestedReply, true)}
                    </View>
                  ))}
              </View>
            ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  replyButton: {
    color: "blue",
    marginTop: 5,
  },
  commentsContainer: {},
  commentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15, // Space between each comment
  },
  commentContent: {
    flex: 1, // Take up the remaining space beside the avatar
    flexDirection: "column",
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#333", // Dark text color
    flexWrap: "wrap", // Ensure long comments wrap
  },
  username: {
    fontWeight: "bold", // Bold username to highlight it
  },
  comment: {
    fontWeight: "normal", // Regular comment text
  },
  timeAgo: {
    fontSize: 12, // Smaller font size for timestamp
    color: "gray", // Light gray for less focus on the timestamp
    marginTop: 3, // Small margin to separate timestamp from comment text
  },
});

export default CommentList;
