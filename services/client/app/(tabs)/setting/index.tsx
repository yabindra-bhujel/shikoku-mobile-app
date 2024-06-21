import { StyleSheet, Switch, Text, View } from 'react-native'
import React, { useState } from 'react'
import { EventRegister } from 'react-native-event-listeners';
import { StyledText } from '@/app/modal';


const Setting = () => {
    const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      <StyledText>Setting Screen</StyledText>
      <Switch value={darkMode}
      onValueChange={(value) => {setDarkMode(value)
        EventRegister.emit("changeTheme", value)
      }}/>
    </View>
  )
}

export default Setting

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
        }
})