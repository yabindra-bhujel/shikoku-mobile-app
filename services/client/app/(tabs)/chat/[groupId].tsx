import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Text,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  FlatList,
} from "react-native";
import GroupHeader from "@/src/components/GroupChat/GroupHeader";
import { useLocalSearchParams } from "expo-router";
import GroupServices from "@/src/api/GroupServices";
import GroupMessageList from "@/src/components/GroupChat/GroupMessageList";
import { myip } from "@/src/config/Api";
import axiosInstance from "@/src/config/Api";
import { useUser } from "@/src/hooks/UserContext";
import { useFocusEffect } from "@react-navigation/native";

interface GroupData {
  id: string;
  name: string;
  description: string;
  group_image?: string;
  member_count?: number;
  admin_id: number;
}

const ChatDetail = () => {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const theme = useColorScheme();
  const [group, setGroup] = useState<GroupData | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const textInputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList<any>>(null);
  const { loggedInUserId, fullname } = useUser();

  const [messageData, setMessageData] = useState({
    message: "",
    sender_id: 0,
    username: "",
    group_id: groupId || "",
  });

  const fetchGroup = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      const response = await GroupServices.getGroupById(groupId);
      setGroup(response.data);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to fetch group data from server. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGroup();
    }, [groupId])
  );

  const fetchMessages = async (pageNum: number) => {
    if (!groupId) return;

    try {
      setLoadingMore(true);
      const response = await axiosInstance.get(
        `/group_messages/${groupId}?page=${pageNum}&size=50`
      );
      const newMessages = response.data.items;

      setMessages((prevMessages) => {
        const allMessages = [...newMessages, ...prevMessages];
        // Remove duplicate messages
        const uniqueMessages = Array.from(
          new Set(allMessages.map((msg) => msg.id))
        ).map((id) => allMessages.find((msg) => msg.id === id));
        return uniqueMessages;
      });
      setCurrentPage(response.data.page);
      setTotalPages(response.data.pages);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to fetch group messages from server. Please try again later."
      );
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchMessages(1);
  }, [groupId]);

  useEffect(() => {
    if (typeof loggedInUserId === 'number') {
      setMessageData((prevData) => ({
        ...prevData,
        sender_id: loggedInUserId,
        username: fullname ?? "",
      }));
    }
  }, [loggedInUserId, fullname]);

  useEffect(() => {
    const initializeWebSocket = () => {
      if (!groupId) return;

      const socketUrl = `ws://${myip}:8000/ws/${groupId}`;
      const ws = new WebSocket(socketUrl);

      ws.onopen = () => {};

      ws.onmessage = (e) => {
        try {
          const message = JSON.parse(e.data);
          setMessages((prevMessages) => {
            const messageExists = prevMessages.some(
              (msg) => msg.id === message.id
            );
            if (messageExists) {
              return prevMessages;
            }
            return [...prevMessages, message];
          });
          // Scroll to bottom on new message
          flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
        } catch (e) {}
      };

      setWs(ws);
    };
    initializeWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [groupId]);

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);

  const sendMessage = () => {
    if (messageData.message.trim()) {
      ws?.send(JSON.stringify(messageData));
      setMessageData({ ...messageData, message: "" });
      setInputValue("");
      // Scroll to bottom after sending a message
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
      }, 100);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchMessages(currentPage + 1);
    }
  };

  const renderMessages = () => {
    if (loading) {
      return (
        <ActivityIndicator
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          size="large"
          color="#00ff00"
        />
      );
    }
    return (
      <GroupMessageList
        ref={flatListRef}
        messages={messages}
        userId={loggedInUserId}
        fetchMoreMessages={handleLoadMore}
        loadingMore={loadingMore}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: 54,
            backgroundColor: theme === "dark" ? "#333" : "#fff",
          }}
        />
        {group && <GroupHeader groupData={group} />}

        {renderMessages()}

        <View style={styles.footerContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              ref={textInputRef}
              placeholder="メッセージを入力..."
              style={styles.messageInput}
              multiline
              autoFocus={true}
              value={inputValue}
              onChangeText={(text) => {
                setInputValue(text);
                setMessageData({ ...messageData, message: text });
              }}
            />
            {inputValue.trim() !== "" && (
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Text style={styles.sendButtonText}>送信</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "lightgray",
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 25,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#f0f0f0",
    justifyContent: "space-between",
  },
  messageInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 25,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChatDetail;