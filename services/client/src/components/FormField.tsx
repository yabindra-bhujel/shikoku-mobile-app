import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const FormField = ({title, value, placeholder, 
    handleChangeText, ...props
}: {title: any, value: any, placeholder: any, handleChangeText: any}) => {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  )
}

export default FormField

const styles = StyleSheet.create({})