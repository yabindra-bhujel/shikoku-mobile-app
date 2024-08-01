import GroupServices from "@/src/api/GroupServices";
import React, { useRef, useCallback, forwardRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, FlatListProps, TouchableNativeFeedback, Alert, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

interface GroupMessageListProps extends Omit<FlatListProps<any>, "data" | "renderItem"> {
  messages: any[];
  userId: string;
  fetchMoreMessages: () => void;
  loadingMore: boolean;
}

const GroupMessageList = forwardRef<FlatList<any>, GroupMessageListProps>(
  ({ messages, userId, fetchMoreMessages, loadingMore, ...restProps }, ref) => {
    const flatListRef = useRef<FlatList<any>>(null);
    const [messageList, setMessageList] = useState(messages);
    const [deletedMessageIds, setDeletedMessageIds] = useState<string[]>([]);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);

    useEffect(() => {
      // Filter out deleted messages
      const filteredMessages = messages.filter(msg => !deletedMessageIds.includes(msg.id));
      setMessageList(filteredMessages);
    }, [messages, deletedMessageIds]);

    const handleDelete = async (id: string) => {
      const newid = parseInt(id);
      try {
        await GroupServices.deleteMessageById(newid);
        setDeletedMessageIds(prevIds => [...prevIds, id]);
        setMessageList(prevMessages => prevMessages.filter(msg => msg.id !== id));
        Alert.alert("メッセージが削除されました。");
      } catch (error) {
        Alert.alert("メッセージの削除に失敗しました。");
      }
    };

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

        const confirmDelete = () => {
          if (isCurrentUser) {
            Alert.alert(
              "メッセージの削除",
              `${item.message} \nこのメッセージを完全に削除しますか?`,
              [
                {
                  text: "キャンセル",
                  style: "cancel",
                },
                {
                  text: "オーケー",
                  onPress: () => handleDelete(item.id),
                  style: "destructive",
                },
              ]
            );
          }
        };

        return (
          <TouchableNativeFeedback onLongPress={confirmDelete}>
            <View style={messageContainerStyle}>
              {!isCurrentUser && (
                <Text style={styles.senderText}>{item.username}</Text>
              )}
              <Text style={messageTextStyle}>{item.message}</Text>
              <Text style={styles.timestampText}>{showTime()}</Text>
            </View>
          </TouchableNativeFeedback>
        );
      },
      [userId, deletedMessageIds]
    );

    const keyExtractor = useCallback((item) => item.id.toString(), []);

    const renderFooter = () => {
      if (!loadingMore) return null;
      return <ActivityIndicator size="large" color="#00ff00" />;
    };

    const handleScroll = (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      if (offsetY > 1000) {
        setShowScrollToBottom(true);
      } else {
        setShowScrollToBottom(false);
      }
    };

    const scrollToBottom = () => {
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    };

    return (
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={[...messageList].reverse()}
          renderItem={renderMessageItem}
          keyExtractor={keyExtractor}
          onEndReached={fetchMoreMessages}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          inverted
          onScroll={handleScroll}
          {...restProps}
        />
        {showScrollToBottom && (
          <TouchableOpacity style={styles.scrollToBottomButton} onPress={scrollToBottom}>
            <FontAwesome name="arrow-down" size={24} color="white" />
          </TouchableOpacity>
        )}
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
  scrollToBottomButton: {
    position: 'absolute',
    bottom: 20,
    left: "50%",
    backgroundColor: '#30D158',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
});

export default React.memo(GroupMessageList);
