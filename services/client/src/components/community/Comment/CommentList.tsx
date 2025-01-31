import React from "react";
import {
  StyleSheet,
  View,
  Text,
  useColorScheme,
  Pressable,
  useWindowDimensions,
} from "react-native";
import UserAvatar from "../../UserAvatar";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

interface User {
  username: string;
  profile_picture: string;
}

interface Comment {
  id: string;
  user: User;
  content: string;
  created_at: string;
  likes_count?: number;
  replies_count?: number;
}

interface CommentListProps {
  comments: Comment[];
  onLikePress?: (commentId: string) => void;
  onReplyPress?: (commentId: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  onLikePress,
  onReplyPress 
}) => {
  const theme = useColorScheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'MMM d, yyyy • h:mm a');
    } catch {
      return date;
    }
  };

  const isDark = theme === 'dark';
  
  return (
    <View style={styles.container}>
      {comments.map((comment) => (
        <View key={comment.id} style={styles.commentItem}>
          <UserAvatar
            url={comment.user.profile_picture}
            height={40}
            width={40}
          />
          
          <View style={styles.commentContent}>
            <View style={styles.commentHeader}>
              <Text style={[
                styles.username,
                isDark && styles.darkText
              ]}>
                {comment.user.username}
              </Text>
              <Text style={styles.timestamp}>
                {formatDate(comment.created_at)}
              </Text>
            </View>

            <View style={styles.commentTextContainer}>
              <Text style={[
                styles.commentText,
                isDark && styles.darkText
              ]}>
                {comment.content}
              </Text>
            </View>

            <View style={styles.actionContainer}>
              {onLikePress && (
                <Pressable 
                  style={styles.actionButton}
                  onPress={() => onLikePress(comment.id)}
                >
                  <Text style={styles.actionText}>
                    {t('like')} {comment.likes_count ? `(${comment.likes_count})` : ''}
                  </Text>
                </Pressable>
              )}
              
              {onReplyPress && (
                <Pressable 
                  style={styles.actionButton}
                  onPress={() => onReplyPress(comment.id)}
                >
                  <Text style={styles.actionText}>
                    {t('reply')} {comment.replies_count ? `(${comment.replies_count})` : ''}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fcfcfd',
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  commentTextContainer: {
    backgroundColor: '#f0f2f5',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1c1e21',
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  actionButton: {
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#65676b',
    fontWeight: '500',
  },
});

export default CommentList;