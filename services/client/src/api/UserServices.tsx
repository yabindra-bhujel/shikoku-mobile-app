// UserServices.ts or similar
import axiosInstance from "@/src/config/Api";
import { AxiosResponse } from "axios";

export interface UserData {
  user_image?: string;
  username: string;
  user_id: number;
}

export interface UserProfile {
  user_id: number;
  update_profile: string;
  bio: string;
  first_name: string;
  last_name: string;
}

interface UploadImageResponse {
  url: string;
}

const GetAllUser = async (): Promise<UserData[]> => {
  const response = await axiosInstance.get<UserData[]>(
    "/user_profile/group_create?page=1&page_size=50&size=50"
  );
  return response.data;
};

const UserProfile = {
  async getProfile() {
    try {
      const response = await axiosInstance.get("/user_profile");
      return response;
    } catch (error) {
      throw error;
    }
  },
  async updateProfile(data: any) {
    try {
      const response = await axiosInstance.put("/user_profile", data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async updateImage(formData: FormData): Promise<AxiosResponse<UploadImageResponse>> {
    try {
      const response = await axiosInstance.post<UploadImageResponse>(
        "/user_profile/upload_profile_picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  async updateBio(bio: string) {

    const formData = new FormData();
    formData.append("bio", bio);
    try {
      const response = await axiosInstance.put("/user_info",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default {
  GetAllUser,
  UserProfile,
};
