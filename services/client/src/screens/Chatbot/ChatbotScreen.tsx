import {
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import ChatBotService from "@/src/api/ChatBotService";

interface dtypes {
  id: number;
  type: string;
  content: string;
  date: string;
}

const ChatbotScreen = () => {
  const [dataChat, setDataChat] = useState<dtypes[]>([]);
  const [message, setMessage] = useState("");

  const submitMessage = async () => {
    if (!message.trim()) return;

    // Append user message to the chat
    const userMessage = {
      id: Math.random(),
      type: "USER",
      content: message,
      date: new Date().toISOString(),
    };
    setDataChat([...dataChat, userMessage]);

    setMessage("");

    try {
      // Get the chatbot's response
      const botResponse = await ChatBotService.getResponse(message);

      // Append chatbot message to the chat
      const botMessage = {
        id: Math.random(),
        type: "chatBot",
        content: botResponse,
        date: new Date().toISOString(),
      };
      setDataChat((prevChat) => [...prevChat, botMessage]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.chatBodyContainer}>
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 15,
              gap: 10,
            }}
            inverted={true}
            data={[...dataChat].reverse()}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              return (
                <View style={styles.chatTextContainer}>
                  {item.type === "chatBot" ? (
                    <View style={styles.chatUserIcon}>
                      <FontAwesome6 name="robot" size={24} color="black" />
                    </View>
                  ) : null}
                  <View style={styles.chatBody}>
                    <Text>{item.content}</Text>
                  </View>
                  {item.type === "USER" && (
                    <View style={styles.chatUserIcon}>
                      <FontAwesome5
                        name="user-circle"
                        size={30}
                        color="black"
                      />
                    </View>
                  )}
                </View>
              );
            }}
          />
        </View>

        <View style={styles.chatInputContainer}>
          <View style={styles.inputForm}>
            <TextInput
              style={styles.inputField}
              value={message}
              onChangeText={(text) => setMessage(text)}
              placeholder="Type your message..."
            />
          </View>

          <TouchableOpacity style={styles.sendBtn} onPress={submitMessage}>
            <Text style={styles.sendBtnTitle}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  chatBodyContainer: { flex: 1 },
  chatBody: {
    backgroundColor: "lightblue",
    borderRadius: 10,
    padding: 15,
    flex: 1,
  },
  chatUserIcon: { marginTop: 5 },
  chatTextContainer: {
    justifyContent: "center",
    marginBottom: 10,
    flexDirection: "row",
    gap: 7,
  },
  chatInputContainer: {
    flex: 0,
    padding: 10,
    borderTopWidth: 2,
    borderTopColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inputForm: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 10,
    borderColor: "#f0e9e7",
  },
  inputField: { backgroundColor: "#fff", height: 45 },
  sendBtn: { padding: 15, backgroundColor: "blue", borderRadius: 10 },
  sendBtnTitle: { color: "white" },
});

export default ChatbotScreen;
