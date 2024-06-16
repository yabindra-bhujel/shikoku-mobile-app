import { View, Text, Modal } from 'react-native'
import React from 'react'

const SysModal = () => {
  return (
    <Modal 
    visible={true}
    transparent={true}
    >
    <View
    style={{flex: 1, 
      backgroundColor: "rgba(00, 00, 00, .5)",
      justifyContent: "center",
      alignItems: "center",
    }}
    >
    <View style={{
      backgroundColor: "white",
      width: "100%",
      padding: 20,
      marginHorizontal: 20,
    }}>
      <Text>Modal</Text>
    </View>

    </View>
    </Modal>
  )
}

export default SysModal