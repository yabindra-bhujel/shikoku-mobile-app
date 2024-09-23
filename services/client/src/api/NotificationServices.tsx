import { get } from "lodash";
import axiosInstance from "../config/Api";

const NotificationServices = {

    async registerNotificationToken(token: string) {
        const data = new FormData();
        data.append("token", token);

        try {
            const result = await axiosInstance.post("/notification_token", data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    async getNotificationList(page: number = 1, size: number = 50) {
        try {
            const result = await axiosInstance.get(`/notification?page=${page}&size=${size}`);
            return result;
        } catch (error) {
            throw error;
        }
    },

    async markAsRead(id: number) {
        try {
            const result = await axiosInstance.put(`/notification/read/${id}`);
            return result;
        } catch (error) {
            throw error;
        }
    },


}

export default NotificationServices;