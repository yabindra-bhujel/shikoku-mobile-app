import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

const CommentBox = ({comment, setComment, submitComment}) => {
  const theme = useColorScheme();
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={t("Community.addcomment")}
        value={comment}
        onChangeText={(text) => setComment(text)}
        multiline={true} 
        numberOfLines={1} 
        maxLength={5} 
      />
      <TouchableOpacity style={styles.sendButton} onPress={submitComment}>
        <Ionicons name="send" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent", 
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 'auto',
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  sendButton: {
    padding: 10,
    backgroundColor: "lightblue",
    borderRadius: 20,
    marginLeft: 10,
  },
});

export default CommentBox;
