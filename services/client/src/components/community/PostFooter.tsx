import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import LikeServices from "@/src/api/LikeServices";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/src/hooks/useThemeColor";

interface PostFooterProps {
  totalLikes?: number;
  totalComments?: number;
  postId: number;
  alreadyLiked: boolean;
  showComments?: boolean;
}

const PostFooter: React.FC<PostFooterProps> = ({
  totalLikes = 0,
  totalComments = 0,
  postId,
  alreadyLiked,
  showComments = true,
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(alreadyLiked);
  const [likesCount, setLikesCount] = useState<number>(totalLikes);
  const router = useRouter();
  const { t } = useTranslation();
  
  const backgroundColor = useThemeColor({}, "postbackground");
  const color = useThemeColor({}, "text");

  useEffect(() => {
    setIsLiked(alreadyLiked);
    setLikesCount(totalLikes);
  }, [alreadyLiked, totalLikes]);

  const toggleLike = async () => {
    try {
      const result = await LikeServices.likePost(postId.toString());
      if (result.status === 201) {
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToComments = () => {
    router.push(`community/${postId}`);
  };

  return (
    <View style={[styles.postFooter, {backgroundColor}]}>
      <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
        <AntDesign
          name={isLiked ? "heart" : "hearto"}
          size={23}
          color={isLiked ? "red" : color}
        />
        <Text style={[styles.actionText, { color: isLiked ? "red" : color }]}>
          {likesCount} {t("Community.likes")}
        </Text>
      </TouchableOpacity>
      {showComments && (
        <TouchableOpacity style={styles.actionButton} onPress={navigateToComments}>
          <AntDesign name="message1" size={24} color={color} />
          <Text style={[styles.actionText, {color}]}>{totalComments} {t("Community.comments")}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 5,
    paddingLeft: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "600",
  },
});

export default PostFooter;
