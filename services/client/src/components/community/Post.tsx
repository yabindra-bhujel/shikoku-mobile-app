import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, RefreshControl, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import { PostInterface } from "@/src/type/interfaces/PostInterface";
import PostServices from "@/src/api/PostServices";
import ImagePost from "./ImagePost";
import TextPost from "./PostText";

const Post = () => {
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await PostServices.getPosts();
      const data: PostInterface[] = await response.data;
      setPosts(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch posts. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts().then(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {posts.length === 0 ? (
        <Text style={styles.noPostsText}>No posts available</Text>
      ) : (
        posts.map((post) => (
          <View key={post.id} style={styles.postContainer}>
            <PostHeader
              imageUrl={post.user.profile_picture}
              username={post.user.first_name + " " + post.user.last_name}
              time={post.created_at}
            />
            {/* only show if content have */}
            {post.content && <TextPost content={post.content} />}

            {/* check if have image then render images */}
            {post.images?.length > 0 && <ImagePost images={post.images.map(image => image.url)} />}

            <PostFooter
              totalLikes={post.total_likes}
              totalComments={post.total_comments}
              postId={post.id}
              alreadyLiked={post.is_liked}
            />
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  noPostsText: {
    textAlign: "center",
    fontSize: 20,
    color: "#888",
    marginTop: 20,
  },
  postContainer: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  postContent: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
  },
});

export default Post;
