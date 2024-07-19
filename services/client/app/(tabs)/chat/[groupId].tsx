import {
    Text,
    View,
    useColorScheme,
    ScrollView,
    Alert,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
  } from "react-native";
  import GroupHeader from "@/src/components/GroupChat/GroupHeader";
  import { useLocalSearchParams } from "expo-router";
  import GroupServices from "@/src/api/GroupServices";
  import { useEffect, useState } from "react";
  import AuthServices from "@/src/api/AuthServices";
  import GroupMessageList from "@/src/components/GroupChat/GroupMessageList";
  import GroupMessageServices from "@/src/api/GroupMessageServices";
  
  interface GroupData {
    id: string;
    name: string;
    description: string;
    group_image?: string;
    member_count?: number;
    admin_id: number;
  }
  
  const ChatDetail = () => {
    const theme = useColorScheme();
    const { groupId } = useLocalSearchParams<{ groupId: string }>();
  
    const [group, setGroup] = useState<GroupData | null>(null);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [user, setUser] = useState<any>(null);
    const [messages, setMessages] = useState<any>([]);
    const [userId, setUserId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
  
    const [messageData, setMessageData] = useState({
      message: "",
      sender_id: "",
      sender_fullname: "",
      group_id: groupId || "",
    });
  
    useEffect(() => {
      const fetchMessages = async () => {
        if (!groupId) return;
  
        try {
          setLoading(true);
          const response = await GroupMessageServices.getGroupMessages(groupId);
          setMessages(response.data);
        } catch (error) {
          Alert.alert("Error", "Failed to fetch group messages from server. Please try again later.");
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
          Alert.alert("Error", "Failed to fetch group data from server. Please try again later.");
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
          sender_fullname: `${user.data.first_name} ${user.data.last_name}`,
        }));
      };
      getUser();
    }, []);
  
    useEffect(() => {
      const initializeWebSocket = () => {
        if (!groupId) return;
  
        const socketUrl = `ws://localhost:8000/ws/${groupId}`;
  
        const ws = new WebSocket(socketUrl);
  
        ws.onopen = () => {};
  
        ws.onmessage = (e) => {
          const message = JSON.parse(e.data);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              ...message,
            },
          ]);
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
  
    const sendMessage = () => {
      if (messageData.message.trim()) {
        ws?.send(JSON.stringify(messageData));
        setMessageData({ ...messageData, message: "" });
      }
    };
  
    const renderMessages = () => {
      if (loading) {
        return (
          <ActivityIndicator
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            size="large"
            color="#00ff00"
          />
        );
      }
      return <GroupMessageList messages={messages} userId={userId} />;
    };
  
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 54, backgroundColor: theme === "dark" ? "#333" : "#fff" }} />
        {group && <GroupHeader groupData={group} />}
  
        <ScrollView>
          {renderMessages()}
        </ScrollView>
  
        <View style={styles.footerContainer}>
          <TextInput
            placeholder="メッセージを入力..."
            style={styles.messageInput}
            multiline
            value={messageData.message}
            onChangeText={(text) => setMessageData({ ...messageData, message: text })}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>送信</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    footerContainer: {
      minHeight: 90,
      maxHeight: 120,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: "lightgray",
    },
    messageInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: "lightgray",
      borderRadius: 15,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 8,
      fontSize: 16,
    },
    sendButton: {
      backgroundColor: "#007BFF",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
    },
    sendButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    messageContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    messageMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    senderName: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    timestamp: {
      color: '#666',
      fontSize: 12,
    },
    messageContent: {
      backgroundColor: '#f0f0f0',
      padding: 12,
      borderRadius: 10,
    },
    messageText: {
      fontSize: 14,
    },
  });
  
  export default ChatDetail;
  