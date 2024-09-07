import React from "react";
import { Image, StyleSheet } from "react-native";

interface PostImageProps {
  url: string;
}

export const PostImage = ({ url }: PostImageProps) => {
  return <Image source={{ uri: url }} style={styles.image} />;
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
});