import axiosInstance from "../config/Api";

const AuthServices = {
  async login(username: string, password: string): Promise<any> {

    // 新規でURLSearchParamsオブジェクトを作成
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const result = await axiosInstance.post("/auth/access_token", formData.toString, {

        // リクエストヘッダーの設定
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
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

  // リフレッシュトークンを使ってアクセストークンを更新
  async refreshToken(refresh_token: string) {
    try {
      const data = {
        token: refresh_token,
      };

      const result = await axiosInstance.post("/auth/refresh_token", data);

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
