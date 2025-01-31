import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  PostDetailInterface,
  CommentListInterface,
} from "@/src/type/interfaces/PostDetailInterface";
import PostServices from "@/src/api/PostServices";
import UserAvatar from "@/src/components/UserAvatar";
import PostFooter from "@/src/components/community/PostFooter";
import TextPost from "@/src/components/community/PostText";
import CommentsService from "@/src/api/CommentServices";
import CommentBox from "@/src/components/community/Comment/CommentInput";
import CommentList from "@/src/components/community/Comment/CommentList";
import ImagePost from "@/src/components/community/ImagePost";
import { useTranslation } from "react-i18next";

const PostDetail = () => {
  const router = useRouter();
  const [post, setPost] = useState<PostDetailInterface>();
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<CommentListInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const theme = useColorScheme();
  const { postId } = useLocalSearchParams<{ postId: string }>() ?? {
    postId: "",
  };
  const { t } = useTranslation();

  const goBack = () => {
    router.back();
  };

  async function fetchPost() {
    if (!postId) return;

    try {
      const response = await PostServices.getPostById(postId);
      const data: PostDetailInterface = await response.data;
      setPost(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch post. Please try again later.");
    }
  }

  async function fetchComments() {
    if (!postId) return;

    try {
      const response = await CommentsService.getCommentsByPostId(
        parseInt(postId)
      );
      const newComments = response.data.items;

      setComments((prevComments) => {
        const allComments = [...newComments, ...prevComments];
        const uniqueallComments = Array.from(
          new Set(allComments.map((cm) => cm.id))
        ).map((id) => allComments.find((cm) => cm.id === id));
        return uniqueallComments;
      });
      setCurrentPage(response.data.page);
      setTotalPages(response.data.pages);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch comments. Please try again later.");
    }
  }

  const submitComment = async () => {
    if (comment.trim().length === 0) {
      return;
    }

    const commentData = {
      content: comment,
      post_id: parseInt(postId ?? ""),
    };
    try {
      await CommentsService.commentPost(commentData);
      setComment("");
      await fetchPost();
      await fetchComments();
    } catch (error) {
      Alert.alert("Error", "Failed to comment on this post. Please try again.");
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
        <SafeAreaView style={styles.container}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons
              name="chevron-back-sharp"
              size={24}
              color={theme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View
              style={{
                padding: 10,
                backgroundColor: theme === "dark" ? "#333" : "#fff",
              }}
            />
            <View style={styles.header}>
              <View style={styles.userInfo}>
                <UserAvatar url={post?.user.profile_picture} />
                <View style={styles.usernameTime}>
                  <Text style={styles.username}>
                    {post?.user.first_name + " " + post?.user.last_name}
                  </Text>
                  <Text style={styles.timestamp}>{post?.created_at}</Text>
                </View>
              </View>
            </View>
            <View
              style={{ backgroundColor: theme === "dark" ? "#333" : "#fff" }}
            >
              {post?.content && (
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 24,
                    color: theme === "dark" ? "#fff" : "#333",
                    padding: 10,
                  }}
                >
                  {post?.content}
                </Text>
              )}

              {(post?.images?.length ?? 0) > 0 && (
                <ImagePost
                  images={post?.images?.map((image) => image.url) ?? []}
                />
              )}
            </View>
            <View
              style={[
                styles.footer,
                { backgroundColor: theme === "dark" ? "#333" : "#fff" },
              ]}
            >
              <PostFooter
                totalLikes={post?.total_likes ?? 0}
                totalComments={post?.total_comments ?? 0}
                postId={post?.id ?? 0}
                alreadyLiked={post?.is_liked ?? false}
                showComments={false}
              />
            </View>

            <CommentList comments={comments ?? []} />
          </ScrollView>
          <View
            style={[
              styles.commentBox,
              { backgroundColor: theme === "dark" ? "#333" : "#fff" },
            ]}
          >
            <CommentBox
              comment={comment}
              setComment={setComment}
              submitComment={submitComment}
            />
          </View>
        </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    paddingLeft: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  usernameTime: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 10,
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
  },
  footer: {
    flexDirection: "column",
  },
  commentBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default PostDetail;
