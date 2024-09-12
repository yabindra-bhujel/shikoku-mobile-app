import React from "react";
import {
  StyleSheet,
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  Alert,
} from "react-native";
import UserAvatar from "../../UserAvatar"; // Assuming this component works for showing avatars
import { useTranslation } from "react-i18next";
import moment from "moment";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Ionicons } from "@expo/vector-icons";

const CommentList = ({ comments, onReply, onDeleteComment, onDeleteReply }) => {
  const { t } = useTranslation();
  const isDark = useColorScheme() === "dark";

  // Function to format comment time
  const commentTime = (createdTime) => {
    const commentMoment = createdTime.split("T");
    const commentHour = commentMoment[1].split(":");
    const today = moment().format("YYYY-MM-DD");
    const todayHour = moment().format("HH:mm");

    // Check if the comment was created today
    if (commentMoment[0] === today) {
      // Return "X minutes ago", "X hours ago" etc.
      const momentTime =
        parseInt(todayHour.split(":")[0]) * 60 +
        parseInt(todayHour.split(":")[1]);
      const commentTime =
        parseInt(commentHour[0]) * 60 + parseInt(commentHour[1]);
      const timeDiff = momentTime - commentTime;
      if (timeDiff < 60) {
        return `${timeDiff} ${t("Community.minutesAgo")}`;
      } else if (timeDiff < 3600) {
        return `${Math.floor(timeDiff / 60)} ${t("Community.hoursAgo")}`;
      }
    } else {
      // Return formatted date and time for comments not from today
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
            onDeleteReply(comment.id); // Handle reply deletion
          } else {
            onDeleteComment(comment.id); // Handle top-level comment deletion
          }
        },
        style: "destructive",
      },
    ]);
  };

  // Sort the comments by time (newest to oldest)
  const sortedComments = comments.sort((a, b) => {
    return moment(a.created_at).diff(moment(b.created_at));
  });

  // Function to render a line
  const renderLine = (level) => {
    return <View style={[styles.line, { marginLeft: level * 20 }]} />;
  };

  // Function to render each comment (top-level and replies)
  const renderComment = (comment, level = 0, isReply = false) => (
    <View
      key={comment.id}
      style={[styles.commentItem, isReply && { marginLeft: level * 20, marginTop: 10 }]}
    >
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
            <TouchableOpacity onPress={() => handleDelete(comment, isReply)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>

            <SimpleLineIcons name="options" size={20} color="black" />
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
          <Text style={styles.replyButton}>{t("Community.reply")}</Text>
        </TouchableOpacity>
      </View>
      {renderLine(level)}
    </View>
  );

  return (
    <View>
      {sortedComments.map((comment) => (
        <View key={comment.id} style={styles.divideComment}>
          {/* Render Top-Level Comment */}
          {renderComment(comment, 0)}

          {/* Render Replies if any, sorted by time */}
          {comment.replies &&
            comment.replies
              .sort((a, b) => moment(a.created_at).diff(moment(b.created_at))) // Sort replies by time
              .map((reply) => (
                <View key={reply.id}>
                  {renderComment(reply, 1, true)}

                  {/* Nested replies sorted by time */}
                  {reply.replies &&
                    reply.replies
                      .sort((a, b) =>
                        moment(a.created_at).diff(moment(b.created_at))
                      )
                      .map((nestedReply) => (
                        <View key={nestedReply.id}>
                          {renderComment(nestedReply, 2, true)}
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
    marginBottom: 15,
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
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    height: '100%',
    position: 'absolute',
    left: 0,
  },
});

export default CommentList;
