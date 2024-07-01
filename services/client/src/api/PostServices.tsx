import axiosInstance from "../config/Api";

const PostServices = {
  async getPosts() {
    try {
      const result = await axiosInstance.get("/posts");
      return result;
    } catch (error) {
      throw error;
    }
  },

  // submit calendar data code
  async submitCalendarData(data: any) {
    try {
      const result = await axiosInstance.post("/calendars", data);
      return result.data;
    } catch (error:any) {
      throw error;
    }
  },
};

export default PostServices;
