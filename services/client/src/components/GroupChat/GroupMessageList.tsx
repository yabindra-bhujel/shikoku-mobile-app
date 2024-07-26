import React, { useRef, useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import MessageOptionsModal from "./settings/ReplyDeleteModal";

interface Message {
  id: number;
  sender_id: string;
  sender_fullname: string;
  message: string;
  created_at: string;
  username: string;
}

interface GroupMessageListProps {
  messages: Message[];
  userId: string;
}

const GroupMessageList: React.FC<GroupMessageListProps> = ({ messages, userId }) => {
  const flatListRef = useRef<FlatList>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLongPress = (message: Message) => {
    setSelectedMessage(message);
    setModalVisible(true);
  };

  const handleReply = () => {
    if (selectedMessage) {
      setModalVisible(false);
      Alert.alert("Reply", `Reply to message: ${selectedMessage.message}`);
    }
  };

  const handleDelete = () => {
    if (selectedMessage) {
      setModalVisible(false);
      Alert.alert("Delete", `Delete message: ${selectedMessage.message}`);
    }
  };

  const renderMessageItem = useCallback(
    ({ item }: { item: Message }) => {
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
          }
        } else {
          const eventDate = `${new Date(item.created_at).getFullYear()}/${
            new Date(item.created_at).getMonth() + 1
          }/${new Date(item.created_at).getDate()} ${
            item.created_at.split("T")[1].split(":")[0]
          }:${item.created_at.split("T")[1].split(":")[1]}`;
          return eventDate;
        }
      };

      return (
        <TouchableOpacity
          key={item.id}
          style={messageContainerStyle}
          onLongPress={() => handleLongPress(item)}
        >
          {!isCurrentUser && (
            <Text style={styles.senderText}>{item.username}</Text>
          )}
          <Text style={messageTextStyle}>{item.message}</Text>
          <Text style={styles.timestampText}>{showTime()}</Text>
        </TouchableOpacity>
      );
    },
    [userId]
  );

  const keyExtractor = useCallback((item: Message) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <FlatList
        inverted
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={keyExtractor}
        scrollEnabled={true}
      />
      {selectedMessage && (
        <MessageOptionsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onReply={handleReply}
          onDelete={handleDelete}
        />
      )}
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
