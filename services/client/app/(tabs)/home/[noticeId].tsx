import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'

const Notice = () => {

  const {noticeId} = useLocalSearchParams();


  return (
    <SafeAreaView style={styles.container}>
      <View>
      <Text>Hello to notice details -- {noticeId}`</Text>
      </View>
    </SafeAreaView>
  )
}

export default Notice

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'blue',
      }
})