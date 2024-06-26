import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

interface TextPostProps {
  content: string;
}

const TextPost: React.FC<TextPostProps> = ({ content }) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  const textToShow = showFullText ? content : content.slice(0, 200);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{textToShow}</Text>
      {content.length > 200 && (
        <TouchableOpacity onPress={toggleText} style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>{showFullText ? "Read less" : "Read more"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 16,
    elevation: 5,
    paddingVertical: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333333",
  },
  readMoreButton: {
    alignSelf: "flex-start",
    marginTop: 12,
  },
  readMoreText: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default TextPost;
