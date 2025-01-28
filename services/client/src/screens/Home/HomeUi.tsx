import React from 'react';
import { Text, View, TouchableOpacity, useColorScheme, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScaledSheet } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { useNotification } from '@/src/hooks/notificationProvider';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface ButtonData {
  route: string;
  icon: JSX.Element;
  title: string;
  showBadge?: boolean;
  badgeCount?: number;
}

const Home = () => {
  const theme = useColorScheme();
  const { t } = useTranslation();
  const { unreadNotificationCount } = useNotification();

  const buttonData: ButtonData[] = [
    { route: '/community', icon: <Ionicons name="people-outline" size={45} color="#ff6666" />, title: t('commuIcons') },
    { route: '/calendar', icon: <Ionicons name="calendar-outline" size={45} color="blue" />, title: t('CalendarIcons') },
    { route: '/chatbot', icon: <FontAwesome5 name="robot" size={24} color="#42f575" />, title: t('ChatBot') },
    { route: '/event', icon: <Ionicons name="school-outline" size={45} color="purple" />, title: t('SchoolEvt') },
    { route: '/chat', icon: <Ionicons name="chatbubble-ellipses-outline" size={45} color="#00A5CF" />, title: t('Chat') },
    
    {
      route: '/notification',
      icon: <Ionicons name="notifications-outline" size={45} color="#CA3C25" />,
      title: t('settings.notifications'),
      showBadge: unreadNotificationCount > 0,
      badgeCount: unreadNotificationCount,
    },
    { route: '/setting', icon: <Ionicons name="settings-outline" size={45} color="#CA3C25" />, title: t('Settings') },
    { route: '/profile', icon: <Ionicons name="person-circle-outline" size={45} color="#CA3C25" />, title: t('profile') },

  ];

  const groupButtons = (data: ButtonData[], itemsPerRow: number): ButtonData[][] => {
    const groupedData: ButtonData[][] = [];
    for (let i = 0; i < data.length; i += itemsPerRow) {
      groupedData.push(data.slice(i, i + itemsPerRow));
    }
    return groupedData;
  };

  const groupedButtonData = groupButtons(buttonData, 2);

  const styles = ScaledSheet.create({
    homeContainer: {
      flex: 1,
      marginTop: '20@s',
      paddingHorizontal: '10@s',
      backgroundColor: theme === 'dark' ? '#222' : '#f9f9f9',
    },
    iconLineContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: '20@s',
    },
    iconContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconItem: {
      borderRadius: '10@s',
      borderWidth: '1@s',
      width: '130@s',
      height: '115@s',
      borderColor: theme === 'dark' ? '#444' : '#ddd',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
      position: 'relative',
    },
    iconTitle: {
      fontSize: '14@s',
      fontWeight: '600',
      textAlign: 'center',
      marginTop: '10@s',
      color: theme === 'dark' ? '#eee' : '#333',
    },
    badge: {
      position: 'absolute',
      right: '15@s',
      top: '8@s',
      backgroundColor: '#FF3B30',
      borderRadius: '10@s',
      width: '20@s',
      height: '20@s',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 5,
    },
    badgeText: {
      color: '#FFF',
      fontSize: '11@s',
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.homeContainer}>
      {groupedButtonData.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.iconLineContainer}>
          {row.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.iconContainer}
              onPress={() => router.push(button.route)}
              activeOpacity={0.8}
            >
              <View style={styles.iconItem}>
                {button.icon}
                {button.showBadge && (
                  <Animated.View style={styles.badge}>
                    <Text style={styles.badgeText}>{button.badgeCount}</Text>
                  </Animated.View>
                )}
                <Text style={styles.iconTitle}>{button.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

export default Home;
