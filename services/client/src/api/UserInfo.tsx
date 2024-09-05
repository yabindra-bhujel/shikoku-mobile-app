import axiosInstance from "../config/Api";

const UserInfoServices = {

    async getUserInfo() {
        try {
            const response = await axiosInstance.get("/user_info/bio");
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deleteInterest(interestId: number) {
        try {
            const response = await axiosInstance.delete(`/user_info/interests/${interestId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async addInterest(interest: string) {
        const fromData = new FormData();
        fromData.append("interests", interest);
        try {
            const response = await axiosInstance.post("/user_info/interest", fromData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }

            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deleteSkill(skillid: number) {
        try {
            const response = await axiosInstance.delete(`/user_info/skills/${skillid}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async addSkill(skill: string) {
        const fromData = new FormData();
        fromData.append("skill", skill);
        try {
            const response = await axiosInstance.post("/user_info/skills", fromData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }

            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    async addClubActivities(activity: string) {
        const fromData = new FormData();
        fromData.append("club_activities", activity);
        
        try {
            const response = await axiosInstance.post("/user_info/club_activities", fromData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }

            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deleteClubActivities(activityId: number) {
        try {
            const response = await axiosInstance.delete(`/user_info/club_activities/${activityId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getUserPost(userId: number) {
        try {
            const response = await axiosInstance.get(`/posts/user/${userId}`);
            return response;
        } catch (error) {
            throw error;
        }
    }



}

export default UserInfoServices;