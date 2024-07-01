import axiosInstance from "../config/Api";

const PostServices = {

    async getPosts(){
        try {
            const result = await axiosInstance.get("/posts");
            return result;
        } catch (error) {
            throw error;
        }
    },

    async sendPost(formData: FormData){
        try {
            const result = await axiosInstance.post("/posts", formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    async getPostById(id: string){
        try {
            const result = await axiosInstance.get(`/posts/${id}`);
            return result;
        } catch (error) {
            throw error;
        }
    }
}


export default PostServices;