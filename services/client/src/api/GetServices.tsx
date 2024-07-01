import axiosInstance from "../config/Api";

interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  create_at: string;
  color: string;
  user_id: number;
}

const GetServices = {
  fetchCalendarData: async (): Promise<CalendarEvent[]> => {
    try {
      const response = await axiosInstance.get<CalendarEvent[]>('/calenders');
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      throw error;
    }
  },
};

export default GetServices;
