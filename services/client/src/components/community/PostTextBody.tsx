import { useThemeColor } from "@/src/hooks/useThemeColor";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

interface TextPostProps {
  content: string | null | undefined;
}

const TextPost: React.FC<TextPostProps> = ({ content }) => {
  const [showFullText, setShowFullText] = useState(false);
  const {t} = useTranslation();

  const background = useThemeColor({}, "postbackground");
  const color = useThemeColor({}, "text");

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  // Check if content exists before slicing
  const textToShow = content ? (showFullText ? content : content.slice(0, 200)) : '';

  return (
    <View style={[styles.container, {backgroundColor: background}]}>
      <Text style={[styles.text, {color}]}>{textToShow}</Text>
      {content && content.length > 200 && (
        <TouchableOpacity onPress={toggleText} style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>{showFullText ? "Read less" : "Read more"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
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
