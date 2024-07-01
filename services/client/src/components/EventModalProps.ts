import { CalendarEvent } from "./CalendarEvent";


export interface EventModalProps {
    visible: boolean;
    event: CalendarEvent | null;
    onClose: () => void;
    onSave: (event: CalendarEvent) => void;
    onDelete: (event: CalendarEvent) => void;
  }
  