import { CalendarEvent } from "../components/CalendarEventTypes";
import axiosInstance from "../config/Api";


const CalenderService = {

  async getPosts() {
    try {
      const result = await axiosInstance.get("/calenders");
      return result;
    } catch (error) {
      throw error;
    }
  },

async updateEvent(id, event) {

  const response = await axiosInstance.put(`/calenders/${id}`, event, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response) {
    throw new Error("Failed to update event");
  }

  return response;
},

async submitCalendarData(data: CalendarEvent) {
  try {
    const result = await axiosInstance.post("/calenders", data);
    return result.data;
  } catch (error:any) {
    throw error;
  }
},
async deleteEvent(id) {
  const response = await axiosInstance.delete(`/calenders/${id}`);

  if (!response) {
    throw new Error("Failed to delete event");
  }

  return response;
},



  

}
export default CalenderService;
