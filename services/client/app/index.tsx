import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import * as SecureStore from 'expo-secure-store'; 
import { router } from 'expo-router';
import AuthServices from './../src/api/AuthServices';

export default function App() {
  const [appIsReady, setAppIsReady] = useState<boolean>(false);

  useEffect(() => {
    async function prepare() {1
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync(Entypo.font);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    const fetchRefreshToken = async () => {
      try {
        // 保存されたrefresh tokneを取得
        const storedToken = await SecureStore.getItemAsync('refreshToken');
        if (storedToken) {
          // refresh tokenを使って新しいaccess tokenを取得
          const response = await AuthServices.refreshToken(storedToken);
          if (response.status === 200) {
            // 新しいaccess tokenが発行することができれば、homeに遷移
            router.push("/home");
          } else {
            // それ以外の場合は、loginに遷移
            router.push("/login"); 
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login"); 
      }
    };

    fetchRefreshToken();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Entypo name="rocket" size={50} style={styles.icon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5043BA',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  icon: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});
