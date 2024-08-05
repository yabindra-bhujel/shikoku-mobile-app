import { StyleSheet, View, useColorScheme } from 'react-native'


const Setting = () => {
  
    const systemTheme = useColorScheme();

    const styles = StyleSheet.create({
      container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: systemTheme === 'dark' ? 'black' : 'white',
          },
          text: {
            color: systemTheme === 'dark' ? 'white' : 'black',
          },
          button: {
            color: systemTheme === 'dark' ? 'black' : 'white',
          },
  })

  return (
    <View style={styles.container}>
    </View>
  )
}

export default Setting;