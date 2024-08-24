import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import NewEventHeader from "@/src/components/event/NewEventHeader";
import Markdown from "react-native-markdown-display";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const NewEvents = () => {
  const theme = useColorScheme();
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [markdownText, setMarkdownText] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const togglePreview = () => setShowPreview(!showPreview);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: theme === "dark" ? "#1e1e1e" : "#f9f9f9",
    },
    header: {
      marginBottom: 20,
    },
    titleInput: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      borderRadius: 10,
      padding: 15,
      fontSize: 16,
      color: theme === "dark" ? "#f5f5f5" : "#333",
      borderColor: theme === "dark" ? "#444" : "#ddd",
      borderWidth: 1,
      marginBottom: 15,
    },
    dateInput: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      borderRadius: 10,
      padding: 15,
      fontSize: 16,
      color: theme === "dark" ? "#f5f5f5" : "#333",
      borderColor: theme === "dark" ? "#444" : "#ddd",
      borderWidth: 1,
      marginBottom: 15,
    },
    editor: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      borderRadius: 10,
      padding: 15,
      minHeight: 200,
      fontSize: 16,
      color: theme === "dark" ? "#f5f5f5" : "#333",
      borderColor: theme === "dark" ? "#444" : "#ddd",
      borderWidth: 1,
      marginBottom: 15,
    },
    markdown: {
      padding: 15,
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      borderRadius: 10,
      borderColor: theme === "dark" ? "#444" : "#ddd",
      borderWidth: 1,
      marginTop: 10,
    },
    previewToggle: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      marginBottom: 10,
    },
    toggleText: {
      fontSize: 16,
      color: theme === "dark" ? "#aaa" : "#555",
      marginRight: 5,
    },
    toggleIcon: {
      color: theme === "dark" ? "#aaa" : "#555",
    },
    previewTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme === "dark" ? "#fff" : "#333",
      marginBottom: 5,
    },
    previewDate: {
      fontSize: 16,
      color: theme === "dark" ? "#aaa" : "#555",
      marginBottom: 15,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <NewEventHeader />
      </View>

      {/* Body */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {!showPreview && (
          <>
            {/* イベントタイトル入力 */}
            <TextInput
              style={styles.titleInput}
              placeholder="吉野川掃除ボランティア"
              placeholderTextColor={theme === "dark" ? "#aaa" : "#888"}
              value={eventTitle}
              onChangeText={setEventTitle}
            />

            z

            {/* Markdown エディタ */}
            <TextInput
              style={styles.editor}
              multiline
              placeholder="イベントの詳細内容を入力してください..."
              placeholderTextColor={theme === "dark" ? "#aaa" : "#888"}
              value={markdownText}
              onChangeText={setMarkdownText}
            />
          </>
        )}

        {/* プレビュー切り替え */}
        <TouchableOpacity style={styles.previewToggle} onPress={togglePreview}>
          <Text style={styles.toggleText}>
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Text>
          <Ionicons
            name={showPreview ? "eye-off-outline" : "eye-outline"}
            size={20}
            style={styles.toggleIcon}
          />
        </TouchableOpacity>

        {/* プレビューモード */}
        {showPreview && (
          <>
            <Text style={styles.previewTitle}>{eventTitle || "Event Title"}</Text>
            <Text style={styles.previewDate}>{eventDate || "Event Date"}</Text>
            <Markdown style={styles.markdown as any}>
              {markdownText || "Enter your content in Markdown..."}
            </Markdown>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default NewEvents;
