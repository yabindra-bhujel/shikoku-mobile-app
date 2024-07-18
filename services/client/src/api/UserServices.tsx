// UserServices.ts or similar
import axiosInstance from "@/src/config/Api";

export interface UserData {
  user_image?: string;
  username: string;
  user_id: number;
}

const GetAllUser = async (): Promise<UserData[]> => {
  const response = await axiosInstance.get<UserData[]>("/user_profile/group_create");
  return response.data; // Access the data property to get the user data
};

export default {
  GetAllUser,
};
