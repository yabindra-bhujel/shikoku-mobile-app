import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CalendarClientEvent } from "@/src/components/CalendarEventTypes";
import { FontAwesome } from '@expo/vector-icons';

interface CalendarEventListProps {
  filteredEvents: CalendarClientEvent[];
  handleEventClick: (event: { title: string; startTime: string; endTime: string }) => void;
  t: (key: string) => string;
}

export const CalendarEventList: React.FC<CalendarEventListProps> = ({ filteredEvents, handleEventClick, t }) => {
  return (
    <View style={styles.eventList}>
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleEventClick(event)}
          >
            <View style={styles.eventItem}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.eventTimeContainer}>
                <FontAwesome name="clock-o" size={16} color="#666" />
                <Text style={styles.eventTime}>
                  {event.startTime.split("Z")[0]}
                </Text>
              </View>
              <View style={styles.eventTimeContainer}>
                <FontAwesome name="clock-o" size={16} color="#666" />
                <Text style={styles.eventTime}>
                  {event.endTime.split("Z")[0]}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noEventsText}>{t("calendar.noEvent")}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  eventList: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  noEventsText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
});
