import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import PostHeader from "../community/PostHeader";
import UserInfoServices from "@/src/api/UserInfo";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  profile_picture: string;
}

interface Post {
  id: number;
  content: string;
  created_at: string;
  user: User;
  is_active: boolean;
  total_comments: number;
  total_likes: number;
  images?: string[];
}

interface UserPostCardProps {
  user_id?: number;
}

const UserPostCard = ({ user_id = 0 }: UserPostCardProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setUserId] = useState<number>(user_id);

  useEffect(() => {
    setUserId(user_id);
  }, [user_id]);

  const getPosts = async () => {
    try {
      const response = await UserInfoServices.getUserPost(userId);
      setPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, [userId]);

  return (
    <View style={styles.container}>
      {posts.map((post) => (
        <View key={post.id} style={styles.postCard}>
          <PostHeader
            imageUrl={post.user.profile_picture}
            username={`${post.user.first_name} ${post.user.last_name}`}
            time={post.created_at}
          />
          <Text style={styles.postContent}>{post.content}</Text>
          <View style={styles.footer}>
            <Text style={styles.likeCount}>{post.total_likes} Likes</Text>
            <Text style={styles.commentCount}>{post.total_comments} Comments</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 3,
  },
  postContent: {
    fontSize: 16,
    color: "#333",
    marginVertical: 10,
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  commentCount: {
    fontSize: 14,
    color: "#888",
  },
  likeCount: {
    fontSize: 14,
    color: "#888",
  },
});

export default UserPostCard;
