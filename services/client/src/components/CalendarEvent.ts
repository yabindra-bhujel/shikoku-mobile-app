export type CalendarEvent = {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  create_at: string;
  color: string;
  user_id: number;
  // repeatFrequency: "daily" | "weekly" | "monthly" | "yearly"; // Repeat type
};
