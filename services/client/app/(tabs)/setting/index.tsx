import { Button, StyleSheet, Switch, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { EventRegister } from 'react-native-event-listeners';
import { StyledText } from '@/app/modal';
import { ThemeContext } from '@/src/hooks/ThemeContext';


const Setting = () => {
  const { theme, toggleTheme, useSystemTheme } = useContext<any>(ThemeContext);
    const [darkMode, setDarkMode] = useState(theme==="dark");
    const systemTheme = useColorScheme();

    useEffect(()=> {
      setDarkMode(theme==="dark");
    },[theme]);

    const handleTogleTheme = (value) => {
      setDarkMode(value);
      toggleTheme(value ? "dark" : "light");
    }

    const styles = StyleSheet.create({
      container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme === 'dark' ? 'black' : 'white',
          },
          text: {
            color: theme === 'dark' ? 'white' : 'black',
          },
          button: {
            color: theme === 'dark' ? 'black' : 'white',
          },
  })

  return (
    <View style={styles.container}>
      <StyledText>Setting Screen</StyledText>
      <Switch value={darkMode}
      onValueChange={handleTogleTheme}/>
      <Text style={styles.text}>Current Theme: {theme}</Text>
      <Text style={styles.text}>System Theme: {systemTheme}</Text>
      <TouchableOpacity
        onPress={() => toggleTheme('light')}
        style={{
          marginTop: 10,
          paddingVertical: 5,
          paddingHorizontal: 10,
          backgroundColor: theme === 'dark' ? '#fff' : '#000',
        }}
      >
        <Text style={styles.button}>Light Theme</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => toggleTheme('dark')}
        style={{
          marginTop: 20,
          paddingVertical: 5,
          paddingHorizontal: 10,
          backgroundColor: theme === 'dark' ? '#fff' : '#000',
        }}
      >
        <Text style={styles.button}>Dark Theme</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => useSystemTheme()}
        style={{
          marginTop: 20,
          paddingVertical: 5,
          paddingHorizontal: 10,
          backgroundColor: theme === 'dark' ? '#fff' : '#000',
        }}
      >
        <Text style={styles.button}>System Theme</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Setting;