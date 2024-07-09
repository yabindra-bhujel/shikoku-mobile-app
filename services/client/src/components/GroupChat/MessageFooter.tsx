import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    useColorScheme,
    TextInput,
} from "react-native";
import React, { useState } from "react";

interface Props {
    WebSocket: WebSocket;
    messageData: {
        message: string;
        sender_id: string;
        sender_fullname: string;
        group_id: string;
    };
    setMessageData: (data: any) => void;
}

const MessageFooter: React.FC<Props> = ({ WebSocket, messageData, setMessageData }) => {
    const theme = useColorScheme();

    const sendMessage = () => {
        if (messageData.message.trim()) {
            WebSocket.send(JSON.stringify(messageData));
            setMessageData({ ...messageData, message: "" }); // メッセージ送信後に入力フィールドをクリア
        }
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
            backgroundColor: theme === "dark" ? "#333" : "#fff",
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

    return (
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
    );
};

export default MessageFooter;
