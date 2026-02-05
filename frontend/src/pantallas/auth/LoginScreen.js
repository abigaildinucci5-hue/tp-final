    // ============================================
    // PARTE 1: LoginScreen.js
    // frontend/src/pantallas/auth/LoginScreen.js
    // ============================================

    import React, { useState } from 'react';
    import {
      View,
      Text,
      StyleSheet,
      KeyboardAvoidingView,
      Platform,
      ScrollView,
      TouchableOpacity,
      Alert,
    } from 'react-native';
    import { MaterialCommunityIcons } from '@expo/vector-icons';
    import { useAuth } from '../../contexto/AuthContext';
    import HeaderApp from '../../componentes/comun/HeaderApp';
    import Input from '../../componentes/comun/Input';
    import Boton from '../../componentes/comun/Boton';
    import SocialButtons from '../../componentes/auth/SocialButtons';
    import { COLORES } from '../../constantes/colores';

    const LoginScreen = ({ navigation }) => {
      const { login } = useAuth();
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');

      const handleLogin = async () => {
        setError('');

        if (!email.trim()) {
          setError('Por favor ingresa tu email');
          return;
        }

        if (!password) {
          setError('Por favor ingresa tu contraseña');
          return;
        }

        setLoading(true);
        try {
          const result = await login(email, password);
          if (!result.exito) {
            setError(result.mensaje || 'Error al iniciar sesión');
          }
        } catch (err) {
          setError('No se pudo conectar con el servidor');
        } finally {
          setLoading(false);
        }
      };

      const handleOAuthSuccess = async (provider, tokenOrCode) => {
        console.log(`✅ Token recibido de ${provider}:`, tokenOrCode?.substring(0, 20) + '...');
        
        try {
          setLoading(true);
          
          let result;
          if (provider === 'google') {
            // Google en móvil retorna access_token
            result = await auth.loginConGoogle(tokenOrCode);
          } else if (provider === 'github') {
            // GitHub en móvil puede retornar token o código
            result = await auth.loginConGitHub(tokenOrCode);
          }
          
          if (result.exito) {
            console.log(`✅ Autenticación con ${provider} exitosa`);
            // AuthContext se actualiza automáticamente
          } else {
            Alert.alert('Error', result.mensaje || `Error al autenticar con ${provider}`);
          }
        } catch (error) {
          console.error(`❌ Error en OAuth ${provider}:`, error);
          Alert.alert('Error', `No se pudo procesar la autenticación con ${provider}`);
        } finally {
          setLoading(false);
        }
      };

      const handleOAuthError = (provider, mensaje) => {
        console.error(`❌ Error en ${provider}:`, mensaje);
        Alert.alert('Error', `No se pudo iniciar sesión con ${provider}`);
      };

      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Header con navegación */}
          <HeaderApp
            title="Hotel Luna Serena"
            showNavigation={true}
            navigation={navigation}
            activeRoute="Auth"
          />

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header con logo */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <MaterialCommunityIcons
                  name="office-building"
                  size={50}
                  color={COLORES.dorado}
                />
              </View>
              <Text style={styles.title}>Hotel Luna Serena</Text>
              <Text style={styles.subtitle}>Bienvenido de nuevo</Text>
            </View>

            {/* Formulario */}
            <View style={styles.form}>
              {/* Botones OAuth */}
              <SocialButtons
                onSuccess={handleOAuthSuccess}
                onError={handleOAuthError}
              />

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o continúa con email</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Email */}
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="tu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                icono="email-outline"
                error={error && !password ? error : ''}
              />

              {/* Password */}
              <Input
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                placeholder="Ingresa tu contraseña"
                secureTextEntry
                icono="lock-outline"
                error={error && password ? error : ''}
              />

              {/* Botón Login */}
              <Boton
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                fullWidth
                style={styles.loginButton}
              >
                Iniciar Sesión
              </Boton>

              {/* Link a Registro */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
                  <Text style={styles.registerLink}>Regístrate aquí</Text>
                </TouchableOpacity>
              </View>

              {/* Botón Volver al Home */}
              <TouchableOpacity
                style={styles.homeButton}
                onPress={() => navigation.navigate('MainStack')}
              >
                <MaterialCommunityIcons
                  name="home-outline"
                  size={20}
                  color={COLORES.dorado}
                />
                <Text style={styles.homeButtonText}>Volver al Home</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      );
    };

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: COLORES.fondoClaro,
      },
      scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
      },
      header: {
        alignItems: 'center',
        marginBottom: 30,
      },
      logoContainer: {
        width: 100,
        height: 100,
        backgroundColor: COLORES.blanco,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: COLORES.sombraDorada,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      },
      title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORES.dorado,
        marginBottom: 8,
      },
      subtitle: {
        fontSize: 16,
        color: COLORES.grisTexto,
      },
      form: {
        backgroundColor: COLORES.blanco,
        borderRadius: 20,
        padding: 24,
        shadowColor: COLORES.sombra,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      },
      divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
      },
      dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORES.grisBorde,
      },
      dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: COLORES.grisTexto,
      },
      loginButton: {
        marginTop: 10,
        backgroundColor: COLORES.dorado,
      },
      registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
      },
      registerText: {
        fontSize: 14,
        color: COLORES.grisTexto,
      },
      registerLink: {
        fontSize: 14,
        color: COLORES.dorado,
        fontWeight: 'bold',
      },
      homeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderColor: COLORES.dorado,
        borderRadius: 12,
        backgroundColor: 'transparent',
        gap: 8,
      },
      homeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORES.dorado,
      },
    });

    export default LoginScreen;