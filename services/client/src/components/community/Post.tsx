import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import PostHeader from "./PostHeader";
import TextPost from "./PostText";
import PostFooter from "./PostFooter";
import ImagePost from "./ImagePost";
import { PostInterface } from "@/src/type/interfaces/PostInterface";
import PostServices from "@/src/api/PostServices";

const Post = () => {
  const [posts, setPosts] = useState<PostInterface[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await PostServices.getPosts();
        const data: PostInterface[] = await response.data;
        setPosts(data);
      } catch (error) {
      }
    }

    fetchPosts();
  }, []);

  return (
    <View>
      {posts.map((post) => (
        <View key={post.id}>
          <PostHeader
            imageUrl={post.user.profile_picture}
            username={post.user.first_name + " " + post.user.last_name}
            time={post.created_at}
          />
          <TextPost content={post.content} />
          {/* <ImagePost images={post.images} /> */}
          <PostFooter
            totalLikes={post.total_likes}
            totalComments={post.total_comments}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
});

export default Post;

export interface PostHeaderProps extends React.PropsWithChildren<{}> {
  postUser: string;
  username: string;
  time: string;
}
