import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, TextInput, Image, TouchableOpacity } from "react-native";
import { UserPostInterface } from "./UserPostCard";
import { Ionicons } from "@expo/vector-icons";
import { ImageInterface } from "@/src/type/interfaces/PostInterface";
import UserInfoServices from "@/src/api/UserInfo";

interface EditPostProps {
    post: UserPostInterface;
    setContent: (content: string) => void;
    content: string;
}

export const EditPost = ({ post, setContent, content }: EditPostProps) => {
    const [images, setImages] = useState<ImageInterface[]>(post.images || []);

    useEffect(() => {
        setContent(post.content);
        setImages(post.images || []);
    }, [post]);


    const removeImage = async (index: number, image_id: number) => {
        try {
            const response = await UserInfoServices.deletePostImage(post.id, image_id);
            if (response.status === 204) {
                const updatedImages = images.filter((_, i) => i !== index);
                setImages(updatedImages);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to delete image. Please try again later.");
        }
    };


    const confirmRemoveImage = (index: number, image_id: number) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this image ?  You can't undo this action.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: () => removeImage(index, image_id),
                    style: "destructive",
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View>
            <TextInput
                value={content}
                onChangeText={setContent}
                multiline
                style={styles.textInput}
            />

            {/* Show images if they exist */}
            {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                    {image.url && <Image source={{ uri: image.url }} style={styles.image} />}
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => confirmRemoveImage(index, image.id)}
                    >
                        <Ionicons name="close-circle" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    textInput: {
        padding: 10,
        backgroundColor: "white",
        borderRadius: 10,
        marginBottom: 10,
    },
    imageContainer: {
        position: "relative",
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    removeButton: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 12,
        padding: 2,
    },
});
