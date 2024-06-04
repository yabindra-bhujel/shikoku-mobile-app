import { StyleSheet, Text, View, TextInput, TextInputProps } from 'react-native'
import React from 'react'

const StyledTextInput = (Props: TextInputProps ) => {
  return (
    <TextInput style={styles.textInputField}
    {...Props}
    />

  )
}

export default StyledTextInput

const styles = StyleSheet.create({
    textInputField: {
        height: 53,
        width: "100%"
    }
})