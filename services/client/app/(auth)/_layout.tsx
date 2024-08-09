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

      <Stack.Screen name='otp_verify'
      options={{
        headerShown: false
      }}/>
      </Stack>
    </>
  )
}

export default AuthorLayout

