import axiosInstance from "../config/Api";

interface CommentData {
  content: string; // コメントの内容
  post_id: number; // コメントする投稿のID
}

const CommentsService = {
  async commentPost(data: CommentData) {
    try {
      const result = await axiosInstance.post("/comments", data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  async getCommentsByPostId(
    postId: number,
    page: number = 1,
    size: number = 50
  ) {
    // comments/6?page=1&size=50
    try {
      const url = `/comments/${postId}?page=${page}&size=${size}`;
      const result = await axiosInstance.get(url);
      return result;
    } catch (error) {
      throw error;
    }
  },

  async replyToComment(data: any) {
    try {
      const result = await axiosInstance.post(`/comments/replies`, data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteComment(commentId: number, postId: number) {
    try {
      const result = await axiosInstance.delete(`/comments/${commentId}/${postId}`);
      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteReplyComment(replyId: number, postId: number) {
    try {
      const result = await axiosInstance.delete(`/comments/replies/${replyId}/${postId}`);
      return result;
    } catch (error) {
      throw error;
    }
  },
};

export default CommentsService;
