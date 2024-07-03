import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, useColorScheme, FlatList } from "react-native";
import { useRouter, useNavigation } from "expo-router";


interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isCurrentUser?: boolean;
}

interface GroupMessageListProps {
  groupId?: string;
}

const GroupMessageList = (props: GroupMessageListProps) => {
  const theme = useColorScheme();
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();


  const dummyMessages: Message[] = [
    { id: "1", sender: "Alice", content: "Hello!", timestamp: "10:00 AM", isCurrentUser: false },
    { id: "2", sender: "Bob", content: "Hi Alice!", timestamp: "10:05 AM", isCurrentUser: false },
    { id: "3", sender: "Alice", content: "How are you?", timestamp: "10:10 AM", isCurrentUser: false },
    { id: "4", sender: "Bob", content: "I'm good, thanks!", timestamp: "10:15 AM", isCurrentUser: false },
    { id: "5", sender: "Alice", content: "Great!", timestamp: "10:20 AM", isCurrentUser: false },
    { id: "6", sender: "You", content: "Hey everyone!", timestamp: "11:00 AM", isCurrentUser: true },
    { id: "7", sender: "You", content: "This is a test message.", timestamp: "11:05 AM", isCurrentUser: true },
    { id: "8", sender: "You", content: "How's everyone doing?", timestamp: "11:10 AM", isCurrentUser: true },
    { id: "9", sender: "You", content: "Feel free to ask any questions!", timestamp: "11:15 AM", isCurrentUser: true },
    { id: "10", sender: "Alice", content: "How are you? Thanks for joining this group let's make some fun..", timestamp: "10:10 AM", isCurrentUser: false },
    { id: "11", sender: "You", content: "Feel free to ask any questions!", timestamp: "11:15 AM", isCurrentUser: true },
    { id: "12", sender: "You", content: "Feel free to ask any questions!", timestamp: "11:15 AM", isCurrentUser: true },

  ];

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

  const renderMessageItem = ({ item }: { item: Message }) => {
    const messageContainerStyle = item.isCurrentUser
      ? [styles.messageContainer, styles.currentUserMessage]
      : [styles.messageContainer, styles.otherUserMessage];

    const messageTextStyle = item.isCurrentUser
      ? [styles.messageText, styles.currentUserMessageText]
      : [styles.messageText, styles.otherUserMessageText];

    return (
      <View key={item.id} style={messageContainerStyle}>
        {!item.isCurrentUser && (
          <Text style={styles.senderText}>{item.sender}</Text>
        )}
        <Text style={messageTextStyle}>{item.content}</Text>
        <Text style={styles.timestampText}>{item.timestamp}</Text>
      </View>
    );
  };


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={dummyMessages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        scrollEnabled={false}
      />
    </View>
  );
};

export default GroupMessageList;
