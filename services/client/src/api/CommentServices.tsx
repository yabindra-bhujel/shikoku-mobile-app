import axiosInstance from "../config/Api";

interface CommentData {
  content: string;  // コメントの内容
  post_id: number;   // コメントする投稿のID
}

const CommentsService = {
  async commentPost(data: CommentData) {
    try {
      const result = await axiosInstance.post("/comments", data);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default CommentsService;
