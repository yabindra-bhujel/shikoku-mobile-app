import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";

const Setting = () => {
  const router = useRouter();
  const theme = useColorScheme();

  const goBack = () => {
    router.back();
  };

  const navigateToSection = (section) => {
    // Placeholder for navigation logic
    console.log(`Navigating to ${section}`);
  };

  const [messageNotifications, setMessageNotifications] = React.useState(true);
  const [postNotifications, setPostNotifications] = React.useState(true);
  const [surveyNotifications, setSurveyNotifications] = React.useState(true);
  const [featureAuth, setFeatureAuth] = React.useState(true);
  const [profileSearchable, setProfileSearchable] = React.useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = React.useState(true);
  const [passwordChangeRequired, setPasswordChangeRequired] = React.useState(false);
  const [autoLock, setAutoLock] = React.useState(true);

  const toggleSwitch = (type) => {
    switch (type) {
      case 'message':
        setMessageNotifications(previousState => !previousState);
        break;
      case 'post':
        setPostNotifications(previousState => !previousState);
        break;
      case 'survey':
        setSurveyNotifications(previousState => !previousState);
        break;
      case 'featureAuth':
        setFeatureAuth(previousState => !previousState);
        break;
      case 'profileSearchable':
        setProfileSearchable(previousState => !previousState);
        break;
      case 'twoFactorAuth':
        setTwoFactorAuth(previousState => !previousState);
        break;
      case 'passwordChangeRequired':
        setPasswordChangeRequired(previousState => !previousState);
        break;
      case 'autoLock':
        setAutoLock(previousState => !previousState);
        break;
      default:
        break;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#444' : '#ddd',
    },
    backButton: {
      marginRight: 15,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#fff' : '#000',
    },
    section: {
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#444' : '#ddd',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      padding: 15,
      color: theme === 'dark' ? '#fff' : '#000',
    },
    item: {
      padding: 15,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#444' : '#ddd',
    },
    itemText: {
      fontSize: 16,
      color: theme === 'dark' ? '#ddd' : '#333',
      marginLeft: 10,
      flex: 1,
    },
    switch: {
      marginLeft: 10,
    },
  });

  return (
    <View style={styles.container}>
      <View>
        <View
          style={{
            height: 54,
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
          }}
        />
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons
              name="chevron-back-sharp"
              size={24}
              color={theme === 'dark' ? '#fff' : '#000'}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>

      {/* Profile */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <TouchableOpacity style={styles.item} onPress={() => navigateToSection('Profile')}>
          <Ionicons name="person-outline" size={20} color={theme === 'dark' ? '#ddd' : '#333'} />
          <Text style={styles.itemText}>Edit Profile</Text>
        </TouchableOpacity>
        <View style={styles.item}>
          <Ionicons name="people-outline" size={20} color={theme === 'dark' ? '#ddd' : '#333'} />
          <Text style={styles.itemText}>Profile Searchable</Text>
          <Switch
            style={styles.switch}
            value={profileSearchable}
            onValueChange={() => toggleSwitch('profileSearchable')}
          />
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.item}>
          <Ionicons name="chatbubble-outline" size={20} color={theme === 'dark' ? '#ddd' : '#333'} />
          <Text style={styles.itemText}>Message Notifications</Text>
          <Switch
            style={styles.switch}
            value={messageNotifications}
            onValueChange={() => toggleSwitch('message')}
          />
        </View>
        <View style={styles.item}>
          <Ionicons name="paper-plane-outline" size={20} color={theme === 'dark' ? '#ddd' : '#333'} />
          <Text style={styles.itemText}>Post Notifications</Text>
          <Switch
            style={styles.switch}
            value={postNotifications}
            onValueChange={() => toggleSwitch('post')}
          />
        </View>
        <View style={styles.item}>
          <Ionicons name="megaphone-outline" size={20} color={theme === 'dark' ? '#ddd' : '#333'} />
          <Text style={styles.itemText}>Survey Notifications</Text>
          <Switch
            style={styles.switch}
            value={surveyNotifications}
            onValueChange={() => toggleSwitch('survey')}
          />
        </View>
      </View>

      {/* Security */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.item}>
          <Ionicons name="shield-checkmark-outline" size={20} color={theme === 'dark' ? '#ddd' : '#333'} />
          <Text style={styles.itemText}>Feature Authentication</Text>
          <Switch
            style={styles.switch}
            value={featureAuth}
            onValueChange={() => toggleSwitch('featureAuth')}
          />
        </View>
        <View style={styles.item}>
          <Ionicons name="lock-open-outline" size={20} color={theme === 'dark' ? '#ddd' : '#333'} />
          <Text style={styles.itemText}>Password Change Required</Text>
          <Switch
            style={styles.switch}
            value={passwordChangeRequired}
            onValueChange={() => toggleSwitch('passwordChangeRequired')}
          />
        </View>
        <View style={styles.item}>
          <Ionicons name="lock-closed-outline" size={20} color={theme === 'dark' ? '#ddd' : '#333'} />
          <Text style={styles.itemText}>Two-Factor Authentication</Text>
          <Switch
            style={styles.switch}
            value={twoFactorAuth}
            onValueChange={() => toggleSwitch('twoFactorAuth')}
          />
        </View>
        <View style={styles.item}>
          <Ionicons name="timer-outline" size={20} color={theme === 'dark' ? '#ddd' : '#333'} />
          <Text style={styles.itemText}>Auto Lock</Text>
          <Switch
            style={styles.switch}
            value={autoLock}
            onValueChange={() => toggleSwitch('autoLock')}
          />
        </View>
      </View>
    </View>
  );
};

export default Setting;
