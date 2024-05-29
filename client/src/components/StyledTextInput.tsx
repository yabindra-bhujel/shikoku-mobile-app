import { StyleSheet, Text, View, TextInput, TextInputProps } from 'react-native'
import React from 'react'

const StyledTextInput: React.FC<TextInputProps> = ({...otherProps}) => {
  return (
    <TextInput style={styles.textInputField}
    {...otherProps}
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