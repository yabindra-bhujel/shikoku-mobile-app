import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, ja } from './languagesList'; // Import all the languages
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageDetectorModule } from 'i18next';

// Define the key for AsyncStorage
const STORE_LANGUAGE_KEY = 'settings.lang';

// Create the language detector plugin
const languageDetectorPlugin: LanguageDetectorModule = {
    type: 'languageDetector',
    async: true,
    init: () => {},

    // Detect function for i18next
    detect: (callback) => {
        AsyncStorage.getItem(STORE_LANGUAGE_KEY)
            .then((language) => {
                if (language) {
                    callback(language); // Call back with the detected language
                } else {
                    callback('en'); // Default to English if no language is set
                }
            })
            .catch((error) => {
                console.log('Error detecting language', error);
                callback('en'); // Fallback to English on error
            });
    },

    // Function to cache the user language
    cacheUserLanguage: async (language: string) => {
        try {
            await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
        } catch (error) {
            console.log('Error saving language', error);
        }
    },
};

// Define resources for i18next (translations)
const resources = {
    en: { translation: en },
    ja: { translation: ja },
};

// Initialize i18next with the React binding and language detector
i18n
    .use(initReactI18next)
    .use(languageDetectorPlugin) // Add the language detector plugin
    .init({
        resources,
        compatibilityJSON: 'v3',
        fallbackLng: 'en', // Fallback to English if no language is detected
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });

export default i18n;
