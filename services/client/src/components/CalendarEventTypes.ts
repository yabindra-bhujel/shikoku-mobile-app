export interface CalendarEvent {
  start: string;
  end: string;
  title: string;
  description: string;
  color: string;
  user_id: number | any;
}

export interface CalendarClientEvent {
  id: number;
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  color: string;
  isActive: boolean;
  userId: number;
} 