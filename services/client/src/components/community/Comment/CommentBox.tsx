import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Text,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

const CommentBox = ({
  comment,
  setComment,
  submitComment,
  replyToComment,
  replyToReply,
  cancelReply,
}) => {
  const { t } = useTranslation();

  // Determine if it's a reply to a comment or a reply to a reply
  const replyingTo = replyToReply || replyToComment;

  return (
    <View style={styles.wrapper}>
      {/* Replying To Text */}
      {replyingTo && (
        <View style={styles.replyingToContainer}>
          <Text>
            {t("Community.replyingTo")} {replyingTo.user.username}
          </Text>
          <TouchableOpacity onPress={cancelReply}>
            <Ionicons name="close" size={16} color="gray" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder={t("Community.addcomment")}
          value={comment}
          onChangeText={(text) => setComment(text)}
          multiline={true}
          autoFocus={true}
        />
        <TouchableOpacity style={styles.sendButton} onPress={submitComment}>
          <Ionicons name="send" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    flex: 1,
  },
  replyingToContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  sendButton: {
    padding: 10,
    backgroundColor: "lightblue",
    borderRadius: 20,
    marginLeft: 10,
  },
});

export default CommentBox;
