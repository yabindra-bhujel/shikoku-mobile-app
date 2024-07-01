import axiosInstance from "../config/Api";

export const updateEvent = async (id, event) => {
  console.log(event)

  const response = await axiosInstance.put(`/calenders/${id}`, event, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response) {
    throw new Error("Failed to update event");
  }

  return response;
};
