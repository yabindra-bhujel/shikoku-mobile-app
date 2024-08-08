import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import axiosInstance from "@/src/config/Api";
import debounce from "lodash/debounce";

interface Settings {
  user_id: number;
  is_profile_searchable: boolean;
  is_message_notification_enabled: boolean;
  is_post_notification_enabled: boolean;
  is_survey_notification_enabled: boolean;
  is_two_factor_authentication_enabled: boolean;
}

const Setting = () => {
  const router = useRouter();
  const theme = useColorScheme();
  const [loading, setLoading] = React.useState(false);
  const [settings, setSettings] = React.useState<Settings | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/settings');
      setSettings(response.data);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', "An error occurred while fetching settings. Please try again later.");
      setLoading(false);
    }
  };

  const updateSettings = async (updatedSettings: Settings) => {
    try {
      await axiosInstance.put('/settings', updatedSettings);
    } catch (error) {
      Alert.alert('Error', "An error occurred while updating settings. Please try again later.");
    }
  };

  // delays for 500 milliseconds before updating settings
  const debouncedUpdateSettings = React.useCallback(
    debounce((updatedSettings: Settings) => {
      updateSettings(updatedSettings);
    }, 500),
    []
  );

  React.useEffect(() => {
    fetchSettings();
  }, []);

  const goBack = () => {
    router.back();
  };

  const toggleSwitch = (type: keyof Settings) => {
    if (settings) {
      const updatedSettings = { ...settings, [type]: !settings[type] };
      setSettings(updatedSettings);
      debouncedUpdateSettings(updatedSettings);
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
      marginTop: 20,
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
      borderRadius: 10,
      marginHorizontal: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (loading || !settings) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
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
        
        <View style={styles.item}>
          <Ionicons name="people-outline" size={20} color={theme === 'dark' ? '#ddd' : '#333'} />
          <Text style={styles.itemText}>Profile Searchable</Text>
          <Switch
            style={styles.switch}
            value={settings.is_profile_searchable}
            onValueChange={() => toggleSwitch('is_profile_searchable')}
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
            value={settings.is_message_notification_enabled}
            onValueChange={() => toggleSwitch('is_message_notification_enabled')}
          />
        </View>
        <View style={styles.item}>
          <Ionicons name="paper-plane-outline" size={20} color={theme === 'dark' ? '#ddd' : '#333'} />
          <Text style={styles.itemText}>Post Notifications</Text>
          <Switch
            style={styles.switch}
            value={settings.is_post_notification_enabled}
            onValueChange={() => toggleSwitch('is_post_notification_enabled')}
          />
        </View>
        <View style={styles.item}>
          <Ionicons name="megaphone-outline" size={20} color={theme === 'dark' ? '#ddd' : '#333'} />
          <Text style={styles.itemText}>Survey Notifications</Text>
          <Switch
            style={styles.switch}
            value={settings.is_survey_notification_enabled}
            onValueChange={() => toggleSwitch('is_survey_notification_enabled')}
          />
        </View>
      </View>

      {/* Security */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.item}>
          <Ionicons name="lock-closed-outline" size={20} color={theme === 'dark' ? '#ddd' : '#333'} />
          <Text style={styles.itemText}>Two-Factor Authentication</Text>
          <Switch
            style={styles.switch}
            value={settings.is_two_factor_authentication_enabled}
            onValueChange={() => toggleSwitch('is_two_factor_authentication_enabled')}
          />
        </View>
      </View>
    </View>
  );
};

export default Setting;
