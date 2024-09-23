import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  useColorScheme,
  Platform,
  Alert,
} from "react-native";
import HeaderView from "@/src/screens/Home/HeaderView";
import Home from "@/src/screens/Home/HomeUi";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import NotificationServices from "@/src/api/NotificationServices";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    // handleRegistrationError('Must use physical device for push notifications');
  }
}

const HomeScreen = () => {
  const theme = useColorScheme();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const isRealDevice = Device.isDevice;

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const sendTokenToSave = async () => {

    if(expoPushToken.trim().length === 0) return;

      try {
        const response = await NotificationServices.registerNotificationToken(expoPushToken);

        if (response.status === 200) {
          setExpoPushToken('');
        }
      
      } catch (error) {
        Alert.alert("Error", "Failed to register notification token");
    }
  }


  useEffect(() =>{
    if(!isRealDevice) return;
    sendTokenToSave();
}, [expoPushToken, sendTokenToSave]);


  return (
    <View style={{ flex: 1 ,
      backgroundColor: theme === "dark" ? "#333" : "#fff",
    }}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <HeaderView/>
      <ScrollView
        style={[
          styles.bodyContainer,
          {
            backgroundColor: theme === "dark" ? "#333" : "#f5f5f5",
          },
        ]}
      >
        <Home />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 55,
    paddingLeft: 28,
    paddingRight: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  bodyContainer: {
    flex: 1,
    padding: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerActions: {
    right: 10,
  },
  darBgColor: {
    backgroundColor: "grey",
  },
});

export default HomeScreen;
