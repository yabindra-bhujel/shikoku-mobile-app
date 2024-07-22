import React, { useRef } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const GroupMessageList = ({ messages, userId, senderFullname }) => {
  const flatListRef = useRef<FlatList>(null);

  const renderMessageItem = ({ item }) => {
    const isCurrentUser = item.sender_id === userId;

    const messageContainerStyle = isCurrentUser
      ? [styles.messageContainer, styles.currentUserMessage]
      : [styles.messageContainer, styles.otherUserMessage];

    const messageTextStyle = isCurrentUser
      ? [styles.messageText, styles.currentUserMessageText]
      : [styles.messageText, styles.otherUserMessageText];

    const showTime = () => {
      const todaytime = new Date();
      const time = new Date(item.created_at);
      if (time.getFullYear() === todaytime.getFullYear()) {
      if (time.getDate() === todaytime.getDate()) {
        const timestamp = `${item.created_at.split("T")[1].split(":")[0]}:${
          item.created_at.split("T")[1].split(":")[1]
        }`;
        return timestamp;
      } else {
        const eventDate = `${
          new Date(item.created_at).getMonth() + 1
        }/${new Date(item.created_at).getDate()} ${
          item.created_at.split("T")[1].split(":")[0]
        }:${item.created_at.split("T")[1].split(":")[1]}`;
        return eventDate;
      }}
      else {
        const eventDate = `${new Date(item.created_at).getFullYear()}/${
          new Date(item.created_at).getMonth() + 1
          }/${new Date(item.created_at).getDate()} ${
            item.created_at.split("T")[1].split(":")[0]
            }:${item.created_at.split("T")[1].split(":")[1]}`;
            return eventDate;
      }
    };

    return (
      <View key={item.id} style={messageContainerStyle}>
        {!isCurrentUser && (
          <Text style={styles.senderText}>{item.username}</Text>
        )}
        <Text style={messageTextStyle}>{item.message}</Text>
        <Text style={styles.timestampText}>{showTime()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        inverted
        ref={flatListRef}
        data={[...messages].reverse()}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={true}
      />
    </View>
  );
};

export default GroupMessageList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  messageContainer: {
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E8E8E8",
  },
  senderText: {
    fontSize: 12,
    marginBottom: 2,
    color: "#666",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    color: "#000",
  },
  currentUserMessageText: {
    color: "#000",
  },
  otherUserMessageText: {},
  timestampText: {
    fontSize: 10,
    alignSelf: "flex-end",
    color: "#999",
    marginTop: 2,
  },
});
