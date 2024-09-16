import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  Alert,
  LayoutAnimation,
} from "react-native";
import UserAvatar from "../../UserAvatar";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useActionSheet } from '@expo/react-native-action-sheet'; // Import useActionSheet

// Separate component for rendering each comment
const CommentItem = ({ comment, level, isReply, onReply, handleDelete, isDark, commentTime }) => {
  const [commentHeight, setCommentHeight] = useState(0);
  const { showActionSheetWithOptions } = useActionSheet(); // Destructure the hook

  const handleLongPress = () => {
    // Action sheet options
    const options = ["Reply", "Delete", "Report", "Cancel"];
    const destructiveButtonIndex = 1; // Set "Delete" as the destructive button
    const cancelButtonIndex = 3; // Set "Cancel" as the cancel button

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title: "Choose an action",
        message: "Select an option for this comment",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // Reply
          onReply(comment);
        } else if (buttonIndex === 1) {
          // Delete
          handleDelete(comment, isReply);
        } else if (buttonIndex === 2) {
          // Report
          Alert.alert("Reported", "You have reported this comment.");
        }
      }
    );
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.commentItem,
          isReply && { marginLeft: level * 20, marginTop: 10 },
        ]}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setCommentHeight(height);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }}
      >
        <View style={[styles.line, { height: commentHeight }]} />
        <UserAvatar url={comment.user.profile_picture} height={35} width={35} />
        <View style={styles.commentContent}>
          <View style={styles.commentText}>
            <View style={styles.commentHeader}>
              <Text
                style={[
                  styles.username,
                  {
                    color: isDark ? "#fff" : "#000",
                  },
                ]}
              >
                {comment.user.username}
              </Text>
              <SimpleLineIcons name="options" size={22} color="black" onPress={handleLongPress}/>
            </View>
            <Text style={styles.timeAgo}>{commentTime(comment.created_at)}</Text>
            <View>
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
            </View>
          </View>
          <TouchableOpacity onPress={() => onReply(comment)}>
            <Text style={styles.replyButton}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CommentList = ({ comments, onReply, onDeleteComment, onDeleteReply }) => {
  const { t } = useTranslation();
  const isDark = useColorScheme() === "dark";

  const commentTime = (createdTime) => {
    const commentMoment = createdTime.split("T");
    const commentHour = commentMoment[1].split(":");
    const today = moment().format("YYYY-MM-DD");
    const todayHour = moment().format("HH:mm");

    if (commentMoment[0] === today) {
      const momentTime =
        parseInt(todayHour.split(":")[0]) * 60 +
        parseInt(todayHour.split(":")[1]);
      const commentTime =
        parseInt(commentHour[0]) * 60 + parseInt(commentHour[1]);
      const timeDiff = momentTime - commentTime;
      if (timeDiff < 1) {
        return "just now";
      } else if (timeDiff < 60) {
        return `${timeDiff} minutes ago`;
      } else if (timeDiff < 3600) {
        return `${Math.floor(timeDiff / 60)} hours ago`;
      }
    } else {
      return `${commentMoment[0]} ${commentHour[0]}:${commentHour[1]}`;
    }
  };

  const handleDelete = (comment, isReply = false) => {
    Alert.alert("Delete", "Are you sure you want to delete this comment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          if (isReply) {
            onDeleteReply(comment.id);
          } else {
            onDeleteComment(comment.id);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const sortedComments = comments.sort((a, b) => {
    return moment(a.created_at).diff(moment(b.created_at));
  });

  return (
    <View>
      {sortedComments.map((comment) => (
        <View key={comment.id} style={styles.divideComment}>
          {/* Render Top-Level Comment */}
          <CommentItem
            comment={comment}
            level={0}
            isReply={false}
            onReply={onReply}
            handleDelete={handleDelete}
            isDark={isDark}
            commentTime={commentTime}
          />

          {/* Render Replies if any, sorted by time */}
          {comment.replies &&
            comment.replies
              .sort((a, b) => moment(a.created_at).diff(moment(b.created_at)))
              .map((reply) => (
                <View key={reply.id}>
                  <CommentItem
                    comment={reply}
                    level={1}
                    isReply={true}
                    onReply={onReply}
                    handleDelete={handleDelete}
                    isDark={isDark}
                    commentTime={commentTime}
                  />

                  {/* Nested replies sorted by time */}
                  {reply.replies &&
                    reply.replies
                      .sort((a, b) => moment(a.created_at).diff(moment(b.created_at)))
                      .map((nestedReply) => (
                        <CommentItem
                          key={nestedReply.id}
                          comment={nestedReply}
                          level={2}
                          isReply={true}
                          onReply={onReply}
                          handleDelete={handleDelete}
                          isDark={isDark}
                          commentTime={commentTime}
                        />
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
  commentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    position: "relative", // Ensure the line stays inside the comment container
  },
  divideComment: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  commentContent: {
    flex: 1,
    flexDirection: "column",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentText: {
    flexWrap: "wrap",
  },
  username: {
    fontWeight: "bold",
  },
  comment: {
    fontWeight: "normal",
    padding: 8,
  },
  timeAgo: {
    fontSize: 12,
    color: "gray",
    marginTop: 3,
    padding: 1,
  },
  line: {
    borderLeftWidth: 2,
    borderLeftColor: "#ccc",
    position: "absolute",
    left: 0,
    top: 0,
    marginLeft: 18, // Adjust this to align with your content
  },
});

export default CommentList;
