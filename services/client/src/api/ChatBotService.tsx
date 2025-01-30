import axiosInstance from "../config/Api";

const ChatBotService = {
  async getResponse(userMessage: string): Promise<any> {
    try {
      const payload = {
        messages: [
          { role: "user", content: userMessage }
        ]
      };
      const result = await axiosInstance.post("/chatbot", payload);
      return result.data.response;
    } catch (error) {
      console.error("Error getting chatbot response:", error);
      throw error;
    }
  },
};

export default ChatBotService;
