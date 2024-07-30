import React, { useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, FlatListProps } from "react-native";

interface GroupMessageListProps extends Omit<FlatListProps<any>, 'data' | 'renderItem'> {
  messages: any[];
  userId: string;
  fetchMoreMessages: () => void;
  loadingMore: boolean;
}

const GroupMessageList = forwardRef<FlatList<any>, GroupMessageListProps>(
  ({ messages, userId, fetchMoreMessages, loadingMore, ...restProps }, ref) => {
    const flatListRef = useRef<FlatList<any>>(null);

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
          const timeString = item.created_at.split("T")[1].split(":");

          if (time.getFullYear() === todaytime.getFullYear()) {
            if (time.getDate() === todaytime.getDate()) {
              return `${timeString[0]}:${timeString[1]}`;
            } else {
              return `${time.getMonth() + 1}/${time.getDate()} ${timeString[0]}:${timeString[1]}`;
            }
          } else {
            return `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()} ${timeString[0]}:${timeString[1]}`;
          }
        };

        return (
          <View style={messageContainerStyle}>
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

    const renderFooter = () => {
      if (!loadingMore) return null;
      return <ActivityIndicator size="large" color="#00ff00" />;
    };

    return (
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={[...messages].reverse()}
          renderItem={renderMessageItem}
          keyExtractor={keyExtractor}
          onEndReached={fetchMoreMessages}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          inverted // This inverts the direction of the FlatList
          {...restProps}
        />
      </View>
    );
  }
);

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
