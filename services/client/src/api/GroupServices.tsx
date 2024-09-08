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

  async getGroupById(id: string) {
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

  async updateGroup(id: string, data: any) {
    try {
      const result = await axiosInstance.put(`/groups/${id}`, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
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

  async addMember(groupId: number, data: any) {
    try {
      const result = await axiosInstance.post(
        `/groups/${groupId}/add_members`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  async removeMemberFromGroup(groupId: number, deleteId: number) {
    try {
      const formData = new URLSearchParams();
      formData.append("member_id", deleteId.toString());

      const result = await axiosInstance.post(
        `/groups/${groupId}/remove_members`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  async changeGroupImage(id: string, data: any) {
    try {
      const result = await axiosInstance.post(
        `/groups/${id}/update_icon`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  async leaveGroup(id: number) {
    try {
      const result = await axiosInstance.post(`/groups/${id}/leave`);
      return result;
    } catch (error) {
      throw error;
    }
  },
  async deleteMessageById(id: number) {
    try {
      const result = await axiosInstance.delete(`/group_messages/${id}`);
      return result;
    } catch (error) {
      throw error;
    }
  }
};

export default GroupServices;
