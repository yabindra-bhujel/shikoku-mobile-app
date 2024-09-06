import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Alert,
  ActivityIndicator,
  Switch,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import axiosInstance from "@/src/config/Api";
import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next"; // Import useTranslation
import i18n from "@/services/config";
import { Snackbar } from "react-native-paper";

interface Settings {
  user_id?: number;
  is_profile_searchable?: boolean | undefined;
  is_message_notification_enabled?: boolean;
  is_post_notification_enabled?: boolean;
  is_survey_notification_enabled?: boolean;
  is_two_factor_authentication_enabled?: boolean;
  language: string;
}

const Setting = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const router = useRouter();
  const theme = useColorScheme();
  const [loading, setLoading] = React.useState(false);
  const [settings, setSettings] = React.useState<Settings | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/settings");
      setSettings(response.data);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", t("error_fetch_settings"));
      setLoading(false);
    }
  };

  const updateSettings = async (updatedSettings: Settings) => {
    try {
      await axiosInstance.put("/settings", updatedSettings);
    } catch (error) {
      Alert.alert("Error", t("error_update_settings"));
    }
  };

  const updateLanguage = async (newLang: string) => {
    try {
      await i18n.changeLanguage(newLang); // Change the language using i18next
      const updatedSettings = { ...settings, language: newLang };
      setSettings(updatedSettings);
      await axiosInstance.put("/settings/language", { language: newLang });

      // show changed languages
      setSnackbarMessage(t("settings.languageChanged"));
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
    } catch (error) {
      Alert.alert("Error", t("error_update_language"));
    }
  };

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
      backgroundColor: theme === "dark" ? "#121212" : "#f5f5f5",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      backgroundColor: theme === "dark" ? "#333" : "#fff",
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#444" : "#ddd",
    },
    backButton: {
      marginRight: 15,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#000",
    },
    section: {
      marginTop: 20,
      backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff",
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
      fontWeight: "bold",
      padding: 15,
      color: theme === "dark" ? "#fff" : "#000",
    },
    item: {
      padding: 15,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#444" : "#ddd",
    },
    itemText: {
      fontSize: 16,
      color: theme === "dark" ? "#ddd" : "#333",
      marginLeft: 10,
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
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
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
        style={{zIndex: 99}}
      >
        {snackbarMessage}
      </Snackbar>
      <View>
        <View
          style={{
            height: 54,
            backgroundColor: theme === "dark" ? "#333" : "#fff",
          }}
        />
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons
              name="chevron-back-sharp"
              size={24}
              color={theme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("settings.settingTitle")}</Text>
        </View>
      </View>

      <ScrollView>
        {/* Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("profile")}</Text>
          <View style={styles.item}>
            <Ionicons
              name="people-outline"
              size={20}
              color={theme === "dark" ? "#ddd" : "#333"}
            />
            <Text style={styles.itemText}>
              {t("settings.profileSearchable")}
            </Text>
            <Switch
              value={settings.is_profile_searchable}
              onValueChange={() => toggleSwitch("is_profile_searchable")}
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.notifications")}</Text>
          <View style={styles.item}>
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={theme === "dark" ? "#ddd" : "#333"}
            />
            <Text style={styles.itemText}>
              {t("settings.messageNotifications")}
            </Text>
            <Switch
              value={settings.is_message_notification_enabled}
              onValueChange={() =>
                toggleSwitch("is_message_notification_enabled")
              }
            />
          </View>
          <View style={styles.item}>
            <Ionicons
              name="paper-plane-outline"
              size={20}
              color={theme === "dark" ? "#ddd" : "#333"}
            />
            <Text style={styles.itemText}>
              {t("settings.postNotifications")}
            </Text>
            <Switch
              value={settings.is_post_notification_enabled}
              onValueChange={() => toggleSwitch("is_post_notification_enabled")}
            />
          </View>
          <View style={styles.item}>
            <Ionicons
              name="megaphone-outline"
              size={20}
              color={theme === "dark" ? "#ddd" : "#333"}
            />
            <Text style={styles.itemText}>
              {t("settings.surveyNotifications")}
            </Text>
            <Switch
              value={settings.is_survey_notification_enabled}
              onValueChange={() =>
                toggleSwitch("is_survey_notification_enabled")
              }
            />
          </View>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.Security")}</Text>
          <View style={styles.item}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={theme === "dark" ? "#ddd" : "#333"}
            />
            <Text style={styles.itemText}>{t("settings.two-factor-auth")}</Text>
            <Switch
              value={settings.is_two_factor_authentication_enabled}
              onValueChange={() =>
                toggleSwitch("is_two_factor_authentication_enabled")
              }
            />
          </View>
        </View>

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("language")}</Text>
          <View style={styles.item}>
            <Ionicons
              name="language-outline"
              size={20}
              color={theme === "dark" ? "#ddd" : "#333"}
            />
            <Text style={styles.itemText}>{t("settings.select_language")}</Text>
            <TouchableOpacity
              onPress={() =>
                updateLanguage(settings.language === "en" ? "ja" : "en")
              }
            >
              <Text style={styles.itemText}>
                {settings.language === "en" ? "English" : "日本語"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Setting;
``;
