import axiosInstance from "../config/Api";

const AuthServices = {
  async login(username: string, password: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const result = await axiosInstance.post("/auth/access_token", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      });

      return result;
    } catch (error) {
      throw error;
    }
  },
  async getCurrentUser() {
    try {
      const result = await axiosInstance.get("", {
        withCredentials: true,
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  async logout() {},

  async chanagePassword() {},

  async forgotPassword() {},
};

export default AuthServices;
