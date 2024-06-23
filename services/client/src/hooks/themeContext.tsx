// ThemeContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
  theme: string;
  toggleTheme: (newTheme: string) => void;
  useSystemTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    const getTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.log('Error loading theme:', error);
      }
    };
    getTheme();
  }, []);

  const toggleTheme = async (newTheme: string) => {
    try {
      setTheme(newTheme);
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const useSystemTheme = async () => {
    if (colorScheme) {
      try {
        setTheme(colorScheme);
        await AsyncStorage.setItem('theme', colorScheme);
      } catch (error) {
        console.log('Error saving system theme:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, useSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider, ThemeContext };
