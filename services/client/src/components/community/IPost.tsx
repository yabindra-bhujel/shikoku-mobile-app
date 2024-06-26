import React from "react";

import { StyleSheet, Text, View } from "react-native";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import ImagePost from "./ImagePost";

const IPost = () => {
    return(
        <View>
            <PostHeader />

            <ImagePost />

            <PostFooter />
        </View>
    )

}

export default IPost;