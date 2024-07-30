import React, { useRef, useCallback } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const GroupMessageList = ({ messages, userId }) => {
  const flatListRef = useRef<FlatList>(null);

  const renderMessageItem = useCallback(
    ({ item }) => {
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
        console.log(todaytime.getMonth())
        if (time.getFullYear() === todaytime.getFullYear()) {
          if (time.getDate() === todaytime.getDate()) {
            const timestamp = `${item.created_at.split("T")[1].split(":")[0]}:${
              item.created_at.split("T")[1].split(":")[1]
            }`;
            return timestamp;
          } else {
            const eventDate = `${
              item.created_at.split("-")[1]
            }/${item.created_at.split("T")[0].split("-")[2]} ${
              item.created_at.split("T")[1].split(":")[0]
            }:${item.created_at.split("T")[1].split(":")[1]}`;
            return eventDate;
          }
        } else {
          const eventDate = `${new Date(item.created_at).getFullYear()}/${
            item.created_at.split("-")[1]
          }/${item.created_at.split("T")[0].split("-")[2]} ${
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
    },
    [userId]
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <FlatList
        inverted
        ref={flatListRef}
        data={[...messages].reverse()}
        renderItem={renderMessageItem}
        keyExtractor={keyExtractor}
        scrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  messageContainer: {
    maxWidth: "75%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#30D158",
    borderTopRightRadius: 0,
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E8E8E8",
    borderTopLeftRadius: 0,
  },
  senderText: {
    fontSize: 12,
    marginBottom: 2,
    color: "#666",
    fontWeight: "600",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    color: "#000",
  },
  currentUserMessageText: {
    color: "#FFF",
  },
  otherUserMessageText: {
    color: "#000",
  },
  timestampText: {
    fontSize: 10,
    alignSelf: "flex-end",
    color: "#999",
    marginTop: 2,
  },
});

export default React.memo(GroupMessageList);
