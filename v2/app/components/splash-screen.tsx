import React, { useEffect } from 'react';
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreenComponent: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
      // Keep splash visible for 2 seconds
      const timer = setTimeout(onFinish, 2000);
      return () => clearTimeout(timer);
    };

    hideSplash();
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo-glass.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
});
