import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const PostDetail = () => {
    const {username} = useLocalSearchParams();
  return (
    <View>
      <Text>PostDetail</Text>
      <Text>Name : {username}</Text>
    </View>
  )
}

export default PostDetail

const styles = StyleSheet.create({})