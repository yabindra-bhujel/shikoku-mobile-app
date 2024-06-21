import { Text, View, Switch, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react'
import { styled, useColorScheme } from "nativewind";
import { EventRegister } from 'react-native-event-listeners';


export const StyledText = styled(Text);

export default function Modal() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  console.log(colorScheme);

  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack();

  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}
      {!isPresented && <Link href="../">Dismiss</Link>}
      {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
      <StatusBar style="light" />
      <View style={styles.container}>
      <Text>Setting Screen</Text>
      <Switch value={colorScheme=="dark"}
      onValueChange={toggleColorScheme}/>
      <Text style={styles.but} onPress={toggleColorScheme}>Switch</Text>
      <Text style={{color: colorScheme === "dark" ? 'red' : 'yellow'}}>Dark Mode: {colorScheme ? 'On' : 'Off'}</Text>
    </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
      },
      but: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
        padding: 20,
        color: 'white',
        backgroundColor: "blue"
      }
})
