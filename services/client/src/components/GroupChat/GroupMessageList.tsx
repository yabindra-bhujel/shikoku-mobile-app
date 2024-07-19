import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, useColorScheme, FlatList } from "react-native";
import { useNavigation } from "expo-router";

const GroupMessageList = ({ messages, userId }) => {
  const theme = useColorScheme();
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', scrollToBottom);

    return unsubscribe;
  }, [navigation, messages]); 

  const renderMessageItem = ({ item }) => {
    const isCurrentUser = item.sender_id === userId;

    const messageContainerStyle = isCurrentUser
      ? [styles.messageContainer, styles.currentUserMessage]
      : [styles.messageContainer, styles.otherUserMessage];

    const messageTextStyle = isCurrentUser
      ? [styles.messageText, styles.currentUserMessageText]
      : [styles.messageText, styles.otherUserMessageText];

    return (
      <View key={item.id} style={messageContainerStyle}>
        {!isCurrentUser && (
          <Text style={styles.senderText}>{item.sender_fullname}</Text>
        )}
        <Text style={messageTextStyle}>{item.message}</Text>
        <Text style={styles.timestampText}>{item.timestamp}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        onContentSizeChange={scrollToBottom} 
        scrollEnabled={false}
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