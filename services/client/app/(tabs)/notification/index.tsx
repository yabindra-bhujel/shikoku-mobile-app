import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from "react-i18next";
import { useRouter, Href } from "expo-router";
import { useNotification, NotificationTypeEnum, NotificationType } from "@/src/hooks/notificationProvider";

const Notification = () => {
  const { t } = useTranslation();
  const { notifications, loading, getNotificationList, markNotificationAsRead } = useNotification();
  const router = useRouter();

  useEffect(() => {
    getNotificationList();
  }, []);

  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;

    // Check if the user is near the bottom of the scroll view
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      getNotificationList();
    }
  };

  const handleNotificationPress = async (notification: NotificationType) => {
    if (notification.is_read) return;

    await markNotificationAsRead(notification.notification_read_id);

    if (notification.possible_url) {
      router.push(notification.possible_url as Href<string>);
    }
  };

  const getNotificationStyle = (notification: NotificationType) => {
    if (notification.is_read) {
      return styles.readNotification;
    }

    switch (notification.notification_type) {
      case NotificationTypeEnum.WARNING:
        return styles.warningNotification;
      case NotificationTypeEnum.ERROR:
        return styles.errorNotification;
      case NotificationTypeEnum.INFO:
      default:
        return styles.infoNotification;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16} 
      >
        {notifications.map((notification) => (
          <TouchableOpacity 
            key={notification.id} 
            style={[
              styles.notificationContainer, 
              getNotificationStyle(notification)
            ]}
            onPress={() => handleNotificationPress(notification)}
            activeOpacity={0.8}
          >
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
            <Text style={styles.notificationDate}>{new Date(notification.created_at).toLocaleString()}</Text>
          </TouchableOpacity>
        ))}
        {loading && <ActivityIndicator size="small" color="#007BFF" style={styles.loadingIndicator} />}
      </ScrollView>
    </SafeAreaView>
  );
}

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollView: {
    padding: 10,
  },
  notificationContainer: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#555",
    marginVertical: 4,
  },
  notificationDate: {
    fontSize: 12,
    color: "#999",
    textAlign: 'right',
  },
  readNotification: {
    backgroundColor: '#f0f0f0',
  },
  warningNotification: {
    backgroundColor: '#fff3cd',
  },
  errorNotification: {
    backgroundColor: '#f8d7da',
  },
  infoNotification: {
    backgroundColor: '#d1ecf1',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});
