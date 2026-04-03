import React, { useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SplashScreenComponent } from '@/components/splash-screen';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const webViewRef = useRef<WebView>(null);

  const handleSplashFinish = useCallback(() => {
    setSplashVisible(false);
  }, []);

  const handleRefresh = () => {
    setHasError(false);
    setErrorMessage('');
    webViewRef.current?.reload();
  };

  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    setHasError(true);
    setErrorMessage(
      nativeEvent?.description || 'Sahifani yuklashda xato yuz berdi',
    );
    console.warn('WebView error: ', nativeEvent);
  };

  // Web platformasi uchun iframe
  if (Platform.OS === 'web') {
    return (
      <view style={styles.webContainer}>
        <Stack.Screen
          options={{
            title: 'Sonli Usullar',
            headerShown: false,
          }}
        />
        {typeof window !== 'undefined' && (
          <iframe
            src="https://www.sonli-usullar.uz/"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              margin: 0,
              padding: 0,
            }}
            title="Sonli Usullar Website"
          />
        )}
      </view>
    );
  }

  // Native platformasi uchun WebView
  if (splashVisible) {
    return <SplashScreenComponent onFinish={handleSplashFinish} />;
  }

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Stack.Screen
        options={{
          title: 'Sonli Usullar',
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        {hasError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Internet bo'yichida muammo</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
            >
              <Text style={styles.refreshButtonText}>🔄 Qayta yuklash</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            source={{ uri: 'https://www.sonli-usullar.uz/' }}
            style={styles.webView}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )}
            onError={handleWebViewError}
            onHttpError={handleWebViewError}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webView: {
    flex: 1,
    marginTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
