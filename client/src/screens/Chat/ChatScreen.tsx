import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatScreen = () => {
  return (
    
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Chat Screen</Text>
    </SafeAreaView>
  );
};

export default ChatScreen;
