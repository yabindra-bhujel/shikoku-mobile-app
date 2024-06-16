import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthorLayout = () => {
  return (
    <>
    <Stack>
      <Stack.Screen name='login' 
      options={{
        headerShown: false
      }}/>
      <Stack.Screen name='forgetpass'
      options={{
        headerShown: false
      }}/>
      </Stack>
    </>
  )
}

export default AuthorLayout

