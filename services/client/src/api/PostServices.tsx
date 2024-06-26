import axiosInstance from "../config/Api";

const PostServices = {

    async getPosts(){
        try {
            const result = await axiosInstance.get("/posts");
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default PostServices;