import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import GoogleButton from './GoogleButton';
import GitHubButton from './GitHubButton';
import { API_CONFIG } from '../../constantes/config';

WebBrowser.maybeCompleteAuthSession();

// 🔥 Detectar si es development o production
const BACKEND_URL = API_CONFIG.BASE_URL || 'http://localhost:3000';

const SocialButtons = ({ onSuccess, onError }) => {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingGitHub, setLoadingGitHub] = useState(false);

  // ==========================================
  // GOOGLE - WEB + MOBILE UNIFICADO
  // ==========================================
  const handleGoogleLogin = async () => {
    try {
      setLoadingGoogle(true);

      if (Platform.OS === 'web') {
        // WEB: Redirect normal (sin ?platform=mobile)
        console.log('🌐 Google Login WEB');
        window.location.href = `${BACKEND_URL}/api/auth/google`;
      } else {
        // MOBILE: Abrir navegador con ?platform=mobile para deep linking
        console.log('📱 Google Login MOBILE');
        const googleAuthUrl = `${BACKEND_URL}/api/auth/google?platform=mobile`;
        
        try {
          await WebBrowser.openAuthSessionAsync(
            googleAuthUrl,
            'hotelunaserenamobile://auth'  // Deep link scheme
          );
          // Cuando vuelve de WebBrowser, el hook useGoogleAuthCallback
          // capturará los tokens desde route.params
        } catch (error) {
          console.error('❌ Error abriendo navegador para Google:', error);
          Alert.alert('Error', 'No se pudo iniciar sesión con Google');
          setLoadingGoogle(false);
        }
      }
    } catch (error) {
      console.error('❌ Error en Google Login:', error);
      Alert.alert('Error', 'No se pudo iniciar sesión con Google');
      setLoadingGoogle(false);
    }
  };

  // ==========================================
  // GITHUB - WEB + MOBILE UNIFICADO
  // ==========================================
  const handleGitHubLogin = async () => {
    try {
      setLoadingGitHub(true);

      if (Platform.OS === 'web') {
        // WEB: Redirect normal (sin ?platform=mobile)
        console.log('🌐 GitHub Login WEB');
        window.location.href = `${BACKEND_URL}/api/auth/github`;
      } else {
        // MOBILE: Abrir navegador con ?platform=mobile para deep linking
        console.log('📱 GitHub Login MOBILE');
        const githubAuthUrl = `${BACKEND_URL}/api/auth/github?platform=mobile`;
        
        try {
          await WebBrowser.openAuthSessionAsync(
            githubAuthUrl,
            'hotelunaserenamobile://auth'  // Deep link scheme
          );
          // Cuando vuelve de WebBrowser, el hook useGoogleAuthCallback
          // capturará los tokens desde route.params
        } catch (error) {
          console.error('❌ Error abriendo navegador para GitHub:', error);
          Alert.alert('Error', 'No se pudo iniciar sesión con GitHub');
          setLoadingGitHub(false);
        }
      }
    } catch (error) {
      console.error('❌ Error en GitHub Login:', error);
      Alert.alert('Error', 'No se pudo iniciar sesión con GitHub');
      setLoadingGitHub(false);
    }
  };

  return (
    <View style={styles.container}>
      <GoogleButton
        onPress={handleGoogleLogin}
        loading={loadingGoogle}
        disabled={loadingGitHub}
      />
      
      <GitHubButton
        onPress={handleGitHubLogin}
        loading={loadingGitHub}
        disabled={loadingGoogle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default SocialButtons;
