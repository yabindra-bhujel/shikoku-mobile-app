import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import * as SecureStore from 'expo-secure-store'; 
import { router, useRouter } from 'expo-router';
import AuthServices from './../src/api/AuthServices';

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function prepare() {
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
        const storedToken = await SecureStore.getItemAsync('refreshToken');
        if (storedToken) {
          const response = await AuthServices.refreshToken(storedToken);
          if (response.status === 200) {
            router.push("/home");
          } else {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    if (appIsReady) {
      fetchRefreshToken();
    }
  }, [appIsReady, router]);

  if (!appIsReady) {
    return null; 
  }
  return (
    <View style={styles.container}>
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
