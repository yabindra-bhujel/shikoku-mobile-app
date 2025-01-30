import {
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import React, { useState, useRef } from "react";
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
  const flatListRef = useRef<FlatList>(null);

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
    Keyboard.dismiss();

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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 95 : 0}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.chatBodyContainer}>
          <FlatList
            ref={flatListRef}
            contentContainerStyle={styles.flatListContent}
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
                      <FontAwesome5 name="user-circle" size={30} color="black" />
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
              multiline={false}
              returnKeyType="send"
              onSubmitEditing={submitMessage}
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatBodyContainer: { 
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  flatListContent: {
    paddingHorizontal: 15,
    gap: 10,
    paddingBottom: 20,
  },
  chatBody: {
    backgroundColor: "lightblue",
    borderRadius: 10,
    padding: 15,
    flex: 1,
    maxWidth: '80%',
  },
  chatUserIcon: { 
    marginTop: 5,
    width: 30,
    alignItems: 'center',
  },
  chatTextContainer: {
    justifyContent: "center",
    marginBottom: 10,
    flexDirection: "row",
    gap: 7,
  },
  chatInputContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: "row",
    backgroundColor: '#fff',
    alignItems: "center",
  },
  inputForm: {
    flex: 1,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
  },
  inputField: { 
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendBtn: { 
    padding: 12,
    backgroundColor: "blue",
    borderRadius: 20,
    width: 70,
    alignItems: 'center',
  },
  sendBtnTitle: { 
    color: "white",
    fontWeight: '600',
  },
});

export default ChatbotScreen;