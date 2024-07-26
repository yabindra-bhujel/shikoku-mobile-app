import React, { useEffect, useState, useRef } from "react";
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
  Keyboard,
  useColorScheme,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import GroupHeader from "@/src/components/GroupChat/GroupHeader";
import { useLocalSearchParams } from "expo-router";
import GroupServices from "@/src/api/GroupServices";
import AuthServices from "@/src/api/AuthServices";
import GroupMessageList from "@/src/components/GroupChat/GroupMessageList";
import GroupMessageServices from "@/src/api/GroupMessageServices";
import { myip } from "@/src/config/Api";

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
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  const [messageData, setMessageData] = useState({
    message: "",
    sender_id: "",
    sender_fullname: "",
    group_id: groupId || "",
  });

  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!groupId) return;

      try {
        setLoading(true);
        const response = await GroupMessageServices.getGroupMessages(groupId);
        setMessages(response.data);
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to fetch group messages from server. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [groupId]);

  useEffect(() => {
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

    fetchGroup();
  }, [groupId]);

  useEffect(() => {
    const getUser = async () => {
      const user = await AuthServices.getUserProfile();
      setUser(user.data);
      setUserId(user.data.user_id);
      setMessageData((prevData) => ({
        ...prevData,
        sender_id: user.data.user_id,
        username: `${user.data.first_name} ${user.data.last_name}`,
      }));
    };
    getUser();
  }, []);

  useEffect(() => {
    const initializeWebSocket = () => {
      if (!groupId) return;

      const socketUrl = `ws://${myip}:8000/ws/${groupId}`;

      const ws = new WebSocket(socketUrl);

      ws.onopen = () => {};

      ws.onmessage = (e) => {
        const message = JSON.parse(e.data);
        setMessages((prevMessages) => {
          // Ensure messages have unique ids
          const messageExists = prevMessages.some((msg) => msg.id === message.id);
          if (messageExists) {
            return prevMessages;
          }
          return [...prevMessages, message];
        });
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
    // Focus the text input after the component mounts
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);

  const sendMessage = () => {
    if (messageData.message.trim()) {
      ws?.send(JSON.stringify(messageData));
      setMessageData({ ...messageData, message: "" });
      setInputValue(""); // Clear the input value
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
    return <GroupMessageList messages={messages} userId={userId} />;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
    </TouchableWithoutFeedback>
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
    fontSize: 16,
    paddingVertical: 10,
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
