import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    useColorScheme,
    TextInput
} from "react-native";


const MessageFooter = () => {
    const theme = useColorScheme();

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
    return(
        <View>
            <View style={styles.footerContainer}>
                <TextInput
                    placeholder="メッセージを入力..."
                    style={styles.messageInput}
                    multiline
                    // Add any necessary props for TextInput
                />
                <TouchableOpacity style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>送信</Text>
                </TouchableOpacity>
            </View>
            </View>
    )

}

export default MessageFooter;
