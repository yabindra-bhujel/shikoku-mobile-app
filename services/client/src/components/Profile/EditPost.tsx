import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TextInput } from "react-native";
import PostHeader from "../community/PostHeader";
import UserInfoServices from "@/src/api/UserInfo";
import TextPost from "../community/PostText";
import ImagePost from "../community/ImagePost";
import PostServices from "@/src/api/PostServices";
import { UserPostInterface } from "./UserPostCard";


interface EditPostProps {
    post : UserPostInterface;

}


export const EditPost = ({post} : EditPostProps) => {
    const [content, setContent] = useState<string>(post.content);
    const [images, setImages] = useState<string[]>(post.images || []);

    useEffect(() => {
        setContent(post.content);
        setImages(post.images || []);
    }, [post]);

    return (
        <View>
            <TextInput
                value={content}
                onChangeText={setContent}
                multiline
                style={styles.textInput}
            />
          
        
        </View>
    )
}

const styles = StyleSheet.create({
    textInput: {
        padding: 10,
        backgroundColor: "white",
        borderRadius: 10,
        marginBottom: 10,
    },

})