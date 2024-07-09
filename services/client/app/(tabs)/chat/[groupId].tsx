import {
    Text,
    View,
    useColorScheme,
    ScrollView,
    Alert,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import GroupHeader from "@/src/components/GroupChat/GroupHeader";
import MessageFooter from "@/src/components/GroupChat/MessageFooter";
import { useLocalSearchParams } from "expo-router";
import GroupServices from "@/src/api/GroupServices";
import { useEffect, useState } from "react";
import AuthServices from "@/src/api/AuthServices";
import GroupMessageList from "@/src/components/GroupChat/GroupMessageList";
import { Link } from 'expo-router';

const ChatDetail = () => {
    const theme = useColorScheme();
    const { groupId } = useLocalSearchParams<{ groupId: string }>() ?? { groupId: "" };

    const [group, setGroup] = useState<any>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [user, setUser] = useState<any>(null);

    const [messageData, setMessageData] = useState({
        message: "",
        sender_id:"",
        sender_fullname: "",
        group_id: groupId || "",
    });

    useEffect(() => {
        const getUser = async () => {
            const user = await AuthServices.getUserProfile();
            setUser(user.data);
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

            const ws = new WebSocket(`ws://localhost:8000/ws/1`);

            ws.onopen = () => {
                ws.send(JSON.stringify({ message: "Hello from client!" }));
            };

            ws.onmessage = (e) => {
                // handle message
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

    useEffect(() => {
        const fetchGroup = async () => {
            if (!groupId) return;

            try {
                const response = await GroupServices.getGroup(groupId);
                setGroup(response.data);
            } catch (error) {
                Alert.alert("Error", "Failed to fetch group data from server. Please try again later.");
            }
        };

        fetchGroup();
    }, [groupId]);

    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={{ height: 54, backgroundColor: theme === "dark" ? "#333" : "#fff" }} />
            <GroupHeader groupData={group} />

            {/* Message List */}
            <ScrollView>
            <Link href="/modal">Present modal</Link>
                 {/* <GroupMessageList /> */}
            </ScrollView>

            {/* Footer */}
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
});

export default ChatDetail;
