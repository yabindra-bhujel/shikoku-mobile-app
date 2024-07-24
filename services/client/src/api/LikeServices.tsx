import axiosInstance from "../config/Api";

const LikeServices = {
    async likePost(postId: string){
        try {
            const result = await axiosInstance.post(`likes`, {
                post_id:postId
            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    async unlikePost(postId: string){
        try {
            const result = await axiosInstance.delete(`/posts/${postId}/like`);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default LikeServices;