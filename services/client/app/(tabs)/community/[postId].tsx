import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
import CommentsService from "@/src/api/CommentServices";
import CommentBox from "@/src/components/community/Comment/CommentBox";
import CommentList from "@/src/components/community/Comment/CommentList";
import ImagePost from "@/src/components/community/ImagePost";
import { useThemeColor } from "@/src/hooks/useThemeColor";
import { useUser } from "@/src/hooks/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";

const PostDetail = () => {
  const router = useRouter();
  const [showFullText, setShowFullText] = useState(false);
  const [post, setPost] = useState<PostDetailInterface>();
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<CommentListInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [replyToComment, setReplyToComment] =
    useState<PostDetailInterface | null>(null);
  const [replyToReply, setReplyToReply] = useState<CommentListInterface | null>(
    null
  );

  const { loggedInUserId } = useUser();

  const postBgColor = useThemeColor({}, "postbackground");
  const color = useThemeColor({}, "text");

  const { postId } = useLocalSearchParams<{ postId: string }>() ?? {
    postId: "",
  };

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
        // Remove duplicate messages
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

  const onReply = (comment: PostDetailInterface, isReplyToReply = false) => {
    if (isReplyToReply) {
      setReplyToReply(comment); 
      setReplyToComment(null);
    } else {
      setReplyToComment(comment); 
      setReplyToReply(null);
    }
  };
  

  const cancelReply = () => {
    setReplyToComment(null); 
    setReplyToReply(null);
  };

  const submitComment = async () => {
    if (comment.trim().length === 0) {
      return;
    }
  
    let commentData;
  
    // Determine if this is a new comment, a reply to a comment, or a reply to a reply
    if (replyToReply) {
      commentData = {
        content: comment,
        reply_id: replyToComment?.id || 0,
        parent_comment_id: replyToReply.id,
        post_id: parseInt(postId ?? ""),
      };
    } else if (replyToComment) {
      commentData = {
        content: comment,
        comment_id: replyToComment.id, // Use comment ID for reply-to-comment
        user_id: loggedInUserId,
        post_id: parseInt(postId ?? ""),
      };
    } else {
      commentData = {
        content: comment,
        post_id: parseInt(postId ?? ""), // Top-level comment
      };
    }
  
    try {
      if (replyToReply) {
        await CommentsService.replyToReply(commentData); // API call for reply-to-reply
      } else if (replyToComment) {
        await CommentsService.replyToComment(commentData); // API call for reply-to-comment
      } else {
        await CommentsService.commentPost(commentData); // API call for new comment
      }
  
      setComment(""); // Clear the input
      setReplyToComment(null); // Reset reply-to-comment
      setReplyToReply(null);   // Reset reply-to-reply
      await fetchComments(); // Refresh the comment list
    } catch (error) {
      Alert.alert("Error", "Failed to submit comment. Please try again.");
    }
  };
  

  const deleteCommentHandler = (commentId: number) => {
    CommentsService.deleteComment(commentId, parseInt(postId ?? ""))
      .then(() => {
        setComments((prevComments: any) =>
          prevComments.filter((cm) => cm.id !== commentId)
        );
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to delete comment. Please try again.");
      });
  };

  const deleteReplyHandler = (replyId: number) => {
    CommentsService.deleteReplyComment(replyId, parseInt(postId ?? ""))
      .then(() => {
        setComments((prevComments) =>
          prevComments.map((comment) => ({
            ...comment,
            replies: comment.replies.filter((reply) => reply.id !== replyId),
          }))
        );
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to delete reply. Please try again.");
      });
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const dateTimeStamp = `${post?.created_at.split("T")[0]} ${
    post?.created_at.split("T")[1].split(":")[0]
  }:${post?.created_at.split("T")[1].split(":")[1]}`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: postBgColor }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={[styles.header, { backgroundColor: postBgColor }]}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="chevron-back-sharp" size={24} color={color} />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <UserAvatar url={post?.user.profile_picture} />
            <View style={styles.usernameTime}>
              <Text style={[styles.username, { color }]}>
                {post?.user.first_name + " " + post?.user.last_name}
              </Text>
              <Text style={styles.timestamp}>{dateTimeStamp}</Text>
            </View>
          </View>
        </View>
        <View style={{ backgroundColor: postBgColor }}>
          {post?.content && (
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                color,
                padding: 10,
              }}
            >
              {post?.content}
            </Text>
          )}

          {(post?.images?.length ?? 0) > 0 && (
            <ImagePost images={post?.images?.map((image) => image.url) ?? []} />
          )}
        </View>
        <View style={[styles.footer, { backgroundColor: postBgColor }]}>
          <PostFooter
            totalLikes={post?.total_likes ?? 0}
            totalComments={post?.total_comments ?? 0}
            postId={post?.id ?? 0}
            alreadyLiked={post?.is_liked ?? false}
            showComments={false}
          />
        </View>
        <View
          style={{
            backgroundColor: postBgColor,
            padding: 10,
          }}
        >
          <CommentList
            comments={comments ?? []}
            onReply={onReply}
            onDeleteComment={deleteCommentHandler}
            onDeleteReply={deleteReplyHandler}
          />
        </View>
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.commentBox, { backgroundColor: postBgColor }]}>
          <CommentBox
            comment={comment}
            setComment={setComment}
            submitComment={submitComment}
            replyToComment={replyToComment}
            replyToReply={replyToReply}
            cancelReply={cancelReply}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
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
    paddingBottom: 10,
    flexDirection: "column",
    borderBottomWidth: 2,
    borderBottomColor: "lightgray",
  },
  commentBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    height: "auto",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  contentContainer: {
    flexGrow: 1,
  },
});
