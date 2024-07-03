import axiosInstance from "../config/Api";

const GroupServices = {
    async getGroups() {
        try {
        const result = await axiosInstance.get("/groups");
        return result;
        } catch (error) {
        throw error;
        }
    },

    async getGroup(id: string) {
        try {
            const result = await axiosInstance.get(`/groups/${id}`);
            return result;
        } catch (error) {
            throw error;
        }
    },
    
    async createGroup(data: any) {
        try {
        const result = await axiosInstance.post("/groups", data);
        return result;
        } catch (error) {
        throw error;
        }
    },
    
    async updateGroup(id: number, data: any) {
        try {
        const result = await axiosInstance.put(`/groups/${id}`, data);
        return result;
        } catch (error) {
        throw error;
        }
    },
    
    async deleteGroup(id: number) {
        try {
        const result = await axiosInstance.delete(`/groups/${id}`);
        return result;
        } catch (error) {
        throw error;
        }
    },

    async chnageGroupImage(id: string, data: any) {
        try {
            const result = await axiosInstance.post(`/groups/${id}/update_icon`, data,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            
            });

            return result;
        } catch (error) {
            throw error;
        }
    }
}


export default GroupServices;