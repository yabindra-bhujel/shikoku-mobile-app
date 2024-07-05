import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { FontAwesome } from '@expo/vector-icons';
import EventModal from '../../components/Calendar/EventModal';
import CalenderService from '@/src/api/CalenderService';
import CreateModal from "@/src/components/Calendar/CreateModal";
import { User } from "@/assets/interfaces/userInterface";
import AuthServices from "@/src/api/AuthServices";
import { CalendarClientEvent } from "@/src/components/CalendarEventTypes";

const CalendarScreen = () => {
  const isDark = useColorScheme() === 'dark';
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarClientEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarClientEvent[]
  >([]);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const fetchData = async () => {
    try {
      const res = await CalenderService.getPosts();
      const getUser = await AuthServices.getCurrentUser();
      setUser(getUser?.data);
      const mappedData = res.data.map(event => {
        const startDate = event.start_time.split('T')[0];
        const startTime = event.start_time.split('T')[1].split('.')[0];
        const endDate = event.end_time.split('T')[0];
        const endTime = event.end_time.split('T')[1].split('.')[0];
        return {
          ...event,
          startDate,
          startTime,
          endDate,
          endTime,
        };
      });
      setEvents(mappedData);
    } catch (err) {
      setError('Error fetching data');
    }
  };


  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    const updatedMarkedDates = {};
    const setColor = isDark ? "white" : "black";
    events.forEach(event => {
      const { startDate, endDate } = event;
      const currentDate = new Date(startDate);
      const end = new Date(endDate);
      while (currentDate <= end) {
        const dateString = currentDate.toISOString().split('T')[0];
        if (!updatedMarkedDates[dateString]) {
          updatedMarkedDates[dateString] = {
            dots: [{ color: setColor }],
            marked: true,
          };
        } else {
          updatedMarkedDates[dateString].dots.push({ color: setColor });
        }
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }
    });
    setMarkedDates(updatedMarkedDates);
  }, [events]);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  const handleSelected = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const currentDate: Date = new Date();
  const currentDateString: string = currentDate.toISOString().split('T')[0];

  const filteredEvents = selectedDate
    ? events.filter(
        event =>
          new Date(event.startDate) <= new Date(selectedDate) &&
          new Date(event.endDate) >= new Date(selectedDate)
      )
    : [];

  filteredEvents.sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleRefresh = () => {
    fetchData();
  };

  const handleEventClick = event => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleDeleteEvent = eventToDelete => {
    setEvents(prevEvents =>
      prevEvents.filter(event => event.id !== eventToDelete.id)
    );
    setShowEventModal(false);
  };

  const styles = StyleSheet.create({
  headerBtn: {
    padding: 6,
    borderWidth: 1,
    borderRadius: 10,
    width: 70,
    borderColor: 'transparent',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
  },
  headerBtnText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  addBtn: {
    position: 'absolute',
    bottom: 20,
    right: 10,
  },
  dateContainer: {
    padding: 20,
    backgroundColor: isDark ? "#333" : '#E8E8E8',
  },
  eventList: {
    padding: 10,
  },
  eventItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    borderLeftColor: "red",
    borderLeftWidth: 10,
    backgroundColor: isDark ? "#444" : '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    
    elevation: 4,
  },
  eventTitle: {
    fontSize: 16,
    height: 20,
    maxWidth: 100,
    color: isDark ? "white" : '#666',
  },
  eventTime: {
    color: isDark ? "white" : '#666',
  },
  noEventsText: {
    fontSize: 16,
    color: isDark ? "white" : '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

  return (
    <SafeAreaView style={{ flex: 1,
      backgroundColor: isDark ? "#333" : "white",
     }}>
      <View
        style={{
          backgroundColor: isDark ? '#111' : 'white',
          width: '100%',
        }}
      >
        <Calendar
          current={currentDateString}
          markedDates={{ ...markedDates, [selectedDate || '']: { selected: true } }}
          onDayPress={handleSelected}
          renderArrow={direction => {
            return direction === 'right' ? (
              <FontAwesome
                name="chevron-right"
                size={18}
                color={isDark ? 'white' : 'black'}
              />
            ) : (
              <FontAwesome
                name="chevron-left"
                size={18}
                color={isDark ? 'white' : 'black'}
              />
            );
          }}
          enableSwipeMonths={true}
          markingType="multi-dot"
          theme={{
            dayTextColor: isDark ? 'white' : 'black',
            textDayHeaderFontWeight: '900',
            textMonthFontWeight: '900',
            textMonthFontSize: 20,
            textDayFontSize: 16,
            calendarBackground: isDark ? '#111' : 'white',
            monthTextColor: isDark ? 'white' : 'black',
          }}
          style={{
            marginHorizontal: 10,
          }}
        />
      </View>
      <ScrollView style={styles.dateContainer}>
        <View style={styles.eventList}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleEventClick(event)}
              >
                <View style={styles.eventItem}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View>
                    <Text style={styles.eventTime}>
                    {event.startTime.split("Z")[0]}
                    </Text>
                    <Text style={styles.eventTime}>
                   {event.endTime.split("Z")[0]}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noEventsText}>No events for this date</Text>
          )}
        </View>
      </ScrollView>
      <FontAwesome
        name="plus-circle"
        size={70}
        color="#40AAFF"
        style={styles.addBtn}
        onPress={handleShowModal}
      />
      <CreateModal
      isDark={isDark}
        visible={showModal}
        onHide={handleShowModal}
        userId={user?.id}
        onEventCreated={handleRefresh}
      />
      {selectedEvent && (
        <EventModal
        isDark={isDark}
          visible={showEventModal}
          event={selectedEvent}
          onClose={() => setShowEventModal(false)}
          onDelete={handleDeleteEvent}
          onUpdate={handleRefresh}
        />
      )}
    </SafeAreaView>
  );
};

export default CalendarScreen;