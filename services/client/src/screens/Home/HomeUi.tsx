import React from 'react';
import { Text, View, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScaledSheet } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

interface ButtonData {
  route: string;
  icon: JSX.Element;
  title: string;
}

const Home = () => {
  const theme = useColorScheme();
  const { t } = useTranslation();

  const buttonData: ButtonData[] = [
    { route: '/community', icon: <Ionicons name="people-outline" size={45} color="#ff6666" />, title: t('commuIcons') },
    { route: '/calendar', icon: <Ionicons name="calendar-outline" size={45} color="blue" />, title: t('CalendarIcons') },
    { route: '/event', icon: <Ionicons name="school-outline" size={45} color="purple" />, title: t('SchoolEvt') },
    { route: '/chat', icon: <Ionicons name="chatbubble-ellipses-outline" size={45} color="#00A5CF" />, title: t('Chat') },
    { route: '/setting', icon: <Ionicons name="settings-outline" size={45} color="#CA3C25" />, title: t('Settings') },
    { route: '/profile', icon: <Ionicons name="person-circle-outline" size={45} color="#CA3C25" />, title: t('profile') },
    { route: '/notification', icon: <Ionicons name="notifications-outline" size={45} color="#CA3C25" />, title: t('notification') },
    {route: '/survey', icon: <Ionicons name='document-attach-outline' size={45} color="green" />, title: t('survey')},
  ];

  // Function to group buttons into pairs
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
      width: '145@s',
      height: '130@s',
      borderColor: theme === 'dark' ? '#444' : '#ddd',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
    },
    iconTitle: {
      fontSize: '14@s',
      fontWeight: '600',
      textAlign: 'center',
      marginTop: '10@s',
      color: theme === 'dark' ? '#eee' : '#333',
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
