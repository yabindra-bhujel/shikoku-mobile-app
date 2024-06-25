import { StyleSheet, Text, View, TextInput, TextInputProps, useColorScheme, Platform } from 'react-native'
import React from 'react'

const StyledTextInput = (Props: TextInputProps ) => {

  const theme = useColorScheme();

  const styles = StyleSheet.create({
    textInputField: {
        height: 53,
        width: "100%",
        color:Platform.OS === "ios" ? (theme === "dark" ? "white" : "black") : undefined,
    }
})

  return (
    <TextInput style={styles.textInputField}
    {...Props}
    />

  )
}

export default StyledTextInput