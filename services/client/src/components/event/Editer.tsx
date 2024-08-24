import React, { useState } from "react";
import {
  StyleSheet,
  View,
  useColorScheme,
  TextInput,
} from "react-native";


const NewEvents = (
    

) => {
  const theme = useColorScheme();
  const [markdownText, setMarkdownText] = useState("");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: theme === "dark" ? "#1e1e1e" : "#f9f9f9",
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

  });

  return (
    <View style={styles.container}>
        {/* Markdown Editor */}
          <TextInput
            style={styles.editor}
            multiline
            placeholder="イベントの詳細内容を入力してください..."
            placeholderTextColor={theme === "dark" ? "#aaa" : "#888"}
            value={markdownText}
            onChangeText={setMarkdownText}
          />

    </View>
  );
};

export default NewEvents;
