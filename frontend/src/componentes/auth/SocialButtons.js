import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import GoogleButton from './GoogleButton';
import GitHubButton from './GitHubButton';

WebBrowser.maybeCompleteAuthSession();

// 🔥 CONFIGURACIÓN OAUTH
const GOOGLE_CLIENT_ID = '251632903609-lbbcnb5ja0aqalmrphv0u7qs2u8oiu0g.apps.googleusercontent.com';
const GOOGLE_ANDROID_CLIENT_ID = '251632903609-lbbcnb5ja0aqalmrphv0u7qs2u8oiu0g.apps.googleusercontent.com';
const GITHUB_CLIENT_ID = 'Iv23licLxm4gYzIBVba0'; // ✅ CONFIGURADO

const SocialButtons = ({ onSuccess, onError }) => {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingGitHub, setLoadingGitHub] = useState(false);

  // ==========================================
  // GOOGLE
  // ==========================================
  const [requestGoogle, responseGoogle, promptAsyncGoogle] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (responseGoogle?.type === 'success') {
      const token = responseGoogle.authentication?.accessToken;
      handleGoogleAuthSuccess(token);
    } else if (responseGoogle?.type === 'error') {
      setLoadingGoogle(false);
      Alert.alert('Error', 'No se pudo iniciar sesión con Google');
    }
  }, [responseGoogle]);

  const handleGoogleAuthSuccess = async (googleAccessToken) => {
    if (!googleAccessToken) {
      setLoadingGoogle(false);
      Alert.alert('Error', 'No se pudo obtener el token de Google');
      return;
    }

    try {
      onSuccess && onSuccess('google', googleAccessToken);
    } catch (error) {
      onError && onError('google', error.message);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleGoogleLogin = () => {
    if (Platform.OS === 'web') {
      window.location.href = 'http://localhost:3000/api/auth/google';
    } else {
      setLoadingGoogle(true);
      promptAsyncGoogle();
    }
  };

  // ==========================================
  // GITHUB
  // ==========================================
  // 🔥 Para móvil, GitHub requiere intercambiar el código por un token
  // Usamos el flujo implicit con scopes para obtener el access_token directamente
  const discoveryGitHub = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revokeEndpoint: 'https://github.com/settings/connections/applications',
  };

  const [requestGitHub, responseGitHub, promptAsyncGitHub] = AuthSession.useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ['user:email', 'read:user'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'hotellunaserena'
      }),
    },
    discoveryGitHub
  );

  useEffect(() => {
    if (responseGitHub?.type === 'success') {
      // GitHub devuelve el token en responseGitHub.params.access_token
      const accessToken = responseGitHub.params?.access_token;
      if (accessToken) {
        handleGitHubAuthSuccess(accessToken);
      } else {
        // Si no hay token, intentar con el código
        const code = responseGitHub.params?.code;
        if (code) {
          console.log('ℹ️ GitHub devolvió código en lugar de token, necesita intercambio en backend');
          // El backend está configurado para manejar esto en github/mobile
          handleGitHubAuthSuccess(code);
        }
      }
    } else if (responseGitHub?.type === 'error') {
      setLoadingGitHub(false);
      Alert.alert('Error', 'No se pudo iniciar sesión con GitHub');
    }
  }, [responseGitHub]);

  const handleGitHubAuthSuccess = async (tokenOrCode) => {
    if (!tokenOrCode) {
      setLoadingGitHub(false);
      Alert.alert('Error', 'No se pudo obtener el token de GitHub');
      return;
    }

    try {
      onSuccess && onSuccess('github', tokenOrCode);
    } catch (error) {
      onError && onError('github', error.message);
    } finally {
      setLoadingGitHub(false);
    }
  };

  const handleGitHubLogin = () => {
    if (Platform.OS === 'web') {
      window.location.href = 'http://localhost:3000/api/auth/github';
    } else {
      setLoadingGitHub(true);
      promptAsyncGitHub();
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
