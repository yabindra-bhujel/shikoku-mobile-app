import axiosInstance from "../config/Api";

const GroupMessageServices = {
    async getGroupMessages(groupId: string) {
        try{
            return await axiosInstance.get(`/group_messages/${groupId}`);

        } catch (error) {
            throw error;
        }
    },

    async deleteGroupMessage(messageId: string) {
        try {
            return await axiosInstance.delete(`/group_messages/${messageId}`);
        } catch (error) {
            throw error;
        }
    }
}

export default GroupMessageServices;