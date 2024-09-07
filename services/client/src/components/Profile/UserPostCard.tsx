import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import PostHeader from "../community/PostHeader";
import UserInfoServices from "@/src/api/UserInfo";
import TextPost from "../community/PostText";
import PostServices from "@/src/api/PostServices";
import { EditPost } from "./EditPost";
import { PostImage } from "./PostImage";
import { PostSkeletonPlaceholder } from "@/src/ReusableComponents/PostSkeletonPlaceholder";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  profile_picture: string;
}

interface ImageInterface {
  id: number;
  url: string;
}

export interface UserPostInterface {
  id: number;
  content: string;
  created_at: string;
  user: User;
  is_active: boolean;
  total_comments: number;
  total_likes: number;
  images?: ImageInterface[];
}

interface UserPostCardProps {
  user_id?: number;
}

const UserPostCard = ({ user_id = 0 }: UserPostCardProps) => {
  const [posts, setPosts] = useState<UserPostInterface[]>([]);
  const [userId, setUserId] = useState<number>(user_id);
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleEditing = (postId: number) => {
    setEditPostId(prevPostId => prevPostId === postId ? null : postId);
  };

  const handleUpdate = async (postId: number) => {
    if (!content) {
      setEditPostId(null);
      return;
    };
    try {
      const response = await UserInfoServices.updatePostContent(postId, content);
      if (response.status === 200) {
        setEditPostId(null);
        setContent("");
        getPosts();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update post. Please try again later.");
    }
  }

  useEffect(() => {
    setUserId(user_id);
  }, [user_id]);

  const getPosts = async () => {
    try {
      setLoading(true);
      const response = await UserInfoServices.getUserPost(userId);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to fetch posts. Please try again later.");
    }
  };

  useEffect(() => {
    getPosts();
  }, [userId]);

  const navigationToPostDetail = (postId: number) => {
    router.push(`/profile/${postId}`);
  }

  const handleDelete = async (postId: number) => {
    try {
      // User confirmation
      Alert.alert(
        'Delete Post',
        'Are you sure you want to delete this post?',
        [
          {
            text: 'Delete',
            style: 'destructive',

            onPress: async () => {
              try {
                await PostServices.deletePost(postId);
                setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
                getPosts();
              } catch (error) {
                console.error("Failed to delete post:", error);
              }
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <>
        <PostSkeletonPlaceholder />
        <PostSkeletonPlaceholder />
        </>
      ) : (
        <>
          {posts.length === 0 && <Text style={styles.noPostAvailable}>No posts available</Text>}
          {posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <PostHeader
                imageUrl={post.user.profile_picture}
                username={`${post.user.first_name} ${post.user.last_name}`}
                time={post.created_at}
                showOptions={true}
                isEditing={editPostId === post.id}
                handleEditing={() => handleEditing(post.id)}
                handleDelete={() => handleDelete(post.id)}
                handleUpdate={() => handleUpdate(post.id)}
              />

              {editPostId === post.id ? (
                <View>
                  <EditPost
                    post={post}
                    setContent={setContent}
                    content={content}
                  />
                </View>
              ) : (
                <View>
                  {post.content && <TextPost content={post.content} />}

                  {(post?.images?.length ?? 0) > 0 && (
                    post?.images?.map((image) => (
                      <PostImage key={image.id} url={image.url} />
                    ))
                  )}

                  <View style={styles.footer}>
                    <Text style={styles.likeCount}>{post.total_likes} Likes</Text>
                    <TouchableOpacity onPress={() => navigationToPostDetail(post.id)}>
                      <Text style={styles.commentCount}>{post.total_comments} Comments</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  noPostAvailable: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },

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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
