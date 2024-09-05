import React, { useState } from "react";
import {
  StyleSheet,
  View,
    Text,
  useColorScheme,
} from "react-native";
import UserAvatar from "../../UserAvatar";
import { useTranslation } from "react-i18next";

const CommentList = ({ comments }) =>  {
    const theme = useColorScheme();
    const {t} = useTranslation();
    
    return (
        <View>
        {comments.map((comment) => (
          <View key={comment.id} style={styles.commentItem}>
            <UserAvatar
              url={comment.user.profile_picture}
              height={35} 
              width={35}
            />
            <View style={styles.commentContent}>
              <Text
                style={{
                    fontWeight: "bold",
                    fontSize: 10,
                }}
              >{comment.user.first_name + " " + comment.user.last_name}</Text>
              <Text 
                style={{
                  color: "gray",
                  fontSize: 10,
                }}
              >{comment.created_at}</Text>
              <View style ={{
               
              
              }}>
              <Text
                style={{
                fontSize: 14,
                paddingHorizontal: 5,
                lineHeight: 15,
                color: "#333333",
                maxWidth: "95%",
                width: "auto",
                }}
              >{comment.content}</Text>
                
                </View>
             
            </View>
          </View>
        ))}
      </View>
    );
}

const styles = StyleSheet.create({
  commentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  commentContent: {
    flex: 1,
    flexDirection: "column",
    // marginLeft: 10,
  },
});

export default CommentList;