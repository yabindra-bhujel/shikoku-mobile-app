import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PostDetailInterface, CommentListInterface } from "@/src/type/interfaces/PostDetailInterface";
import PostServices from "@/src/api/PostServices";
import UserAvatar from "@/src/components/UserAvatar";
import CommentsService from "@/src/api/CommentServices";
import { useTranslation } from "react-i18next";
import { PostImage } from "@/src/components/Profile/PostImage";
import { PostSkeletonPlaceholder } from "@/src/ReusableComponents/PostSkeletonPlaceholder";

const PostDetail = () => {
  const router = useRouter();
  const [post, setPost] = useState<PostDetailInterface>();
  const [comments, setComments] = useState<CommentListInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const theme = useColorScheme();
  const { postId } = useLocalSearchParams<{ postId: string }>() ?? { postId: "" };
  const { t } = useTranslation();

  const goBack = () => {
    router.back();
  };

  async function fetchPost() {
    if (!postId) return;

    try {
      setLoading(true);
      const response = await PostServices.getPostById(postId);
      const data: PostDetailInterface = await response.data;
      setPost(data);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch post. Please try again later.");
    }
  }

  async function fetchComments() {
    if (!postId) return;

    try {
      setLoading(true);
      const response = await CommentsService.getCommentsByPostId(parseInt(postId));
      const newComments = response.data.items;

      setComments((prevComments) => {
        const allComments = [...newComments, ...prevComments];
        const uniqueComments = Array.from(
          new Set(allComments.map((cm) => cm.id))
        ).map((id) => allComments.find((cm) => cm.id === id));
        return uniqueComments;
      });
      setLoading(false);

    } catch (error) {
      Alert.alert("Error", "Failed to fetch comments. Please try again later.");
    }
  }

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const isDarkMode = theme === "dark";

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f0f0f0' }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.spacer} />
        <View style={styles.postCard}>
          <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Ionicons
                name="chevron-back-sharp"
                size={24}
                color={isDarkMode ? "#fff" : "#000"}
              />
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <UserAvatar url={post?.user.profile_picture} />
              <View style={styles.usernameTime}>
                <Text style={[styles.username, { color: isDarkMode ? "#e0e0e0" : "#333" }]}>
                  {post?.user.first_name + " " + post?.user.last_name}
                </Text>
                <Text style={[styles.timestamp, { color: isDarkMode ? "#b0b0b0" : "gray" }]}>
                  {post?.created_at}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.postContent, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
            {post?.content && (
              <Text style={[styles.postText, { color: isDarkMode ? "#e0e0e0" : "#333" }]}>
                {post?.content}
              </Text>
            )}
            {(post?.images?.length ?? 0) > 0 && (
              post?.images?.map((image) => (
                <PostImage key={image.id} url={image.url} />
              ))
            )}
          </View>

          <View style={[styles.footer, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
            <Text style={[styles.footerText, { color: isDarkMode ? "#e0e0e0" : "#888" }]}>
              {post?.total_likes} {t('Likes')}
            </Text>
            <Text style={[styles.footerText, { color: isDarkMode ? "#e0e0e0" : "#888" }]}>
              {post?.total_comments} {t('Comments')}
            </Text>
          </View>
        </View>

        {comments.length > 0 && (
          <View style={[styles.commentSection, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
            {comments.map((comment) => (
              <TouchableOpacity
                key={comment.id}
                style={[
                  styles.commentItem,
                  { backgroundColor: isDarkMode ? "#2c2c2c" : "#ffffff" },
                ]}
                activeOpacity={0.95}
              >
                <UserAvatar url={comment.user.profile_picture} height={40} width={40} />
                <View style={styles.commentContent}>
                  <Text
                    style={[
                      styles.username,
                      { color: isDarkMode ? "#e0e0e0" : "#333333" },
                    ]}
                  >
                    {comment.user.username}
                  </Text>
                  <Text style={[styles.timestamp, { color: isDarkMode ? "#b0b0b0" : "#999999" }]}>
                    {comment.created_at}
                  </Text>
                  <Text
                    style={[
                      styles.commentText,
                      { color: isDarkMode ? "#cccccc" : "#444444" },
                    ]}
                  >
                    {comment.content}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  spacer: {
    height: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    elevation: 4,
  },
  backButton: {
    paddingRight: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameTime: {
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
  },
  postContent: {
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  postText: {
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
  },
  footerText: {
    fontSize: 14,
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  commentSection: {
    margin: 10,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  commentContent: {
    marginLeft: 10,
    flex: 1,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PostDetail;
