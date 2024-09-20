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
    }
}

export default NotificationServices;