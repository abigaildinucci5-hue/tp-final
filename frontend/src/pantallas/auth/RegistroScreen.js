// frontend/src/pantallas/auth/RegistroScreen.js
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

const RegistroScreen = ({ navigation }) => {
  const { registro } = useAuth();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegistro = async () => {
    setError('');

    // Validaciones
    if (!nombre.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (!apellido.trim()) {
      setError('Por favor ingresa tu apellido');
      return;
    }

    if (!email.trim()) {
      setError('Por favor ingresa tu email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    if (!password) {
      setError('Por favor ingresa una contraseña');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const result = await registro(nombre, apellido, email, password, telefono);
      
      if (result.exito) {
        Alert.alert(
          'Registro Exitoso',
          '¡Bienvenido a Hotel Luna Serena!',
          [{ text: 'Continuar' }]
        );
      } else {
        setError(result.mensaje || 'Error al registrarse');
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
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORES.dorado} />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="office-building" size={50} color={COLORES.dorado} />
          </View>
          <Text style={styles.title}>Hotel Luna Serena</Text>
          <Text style={styles.subtitle}>Crea tu cuenta</Text>
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
            <Text style={styles.dividerText}>o regístrate con email</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Nombre */}
          <Input
            label="Nombre"
            value={nombre}
            onChangeText={setNombre}
            placeholder="Juan"
            autoCapitalize="words"
            icono="account-outline"
          />

          {/* Apellido */}
          <Input
            label="Apellido"
            value={apellido}
            onChangeText={setApellido}
            placeholder="Pérez"
            autoCapitalize="words"
            icono="account-outline"
          />

          {/* Email */}
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icono="email-outline"
          />

          {/* Teléfono (opcional) */}
          <Input
            label="Teléfono (opcional)"
            value={telefono}
            onChangeText={setTelefono}
            placeholder="+54 223 123-4567"
            keyboardType="phone-pad"
            icono="phone-outline"
          />

          {/* Password */}
          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            icono="lock-outline"
          />

          {/* Confirmar Password */}
          <Input
            label="Confirmar Contraseña"
            value={confirmarPassword}
            onChangeText={setConfirmarPassword}
            placeholder="Repite tu contraseña"
            secureTextEntry
            icono="lock-outline"
          />

          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <MaterialCommunityIcons name="alert-circle" size={20} color={COLORES.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Requisitos de contraseña */}
          <View style={styles.passwordHints}>
            <Text style={styles.hintTitle}>La contraseña debe tener:</Text>
            <View style={styles.hintItem}>
              <MaterialCommunityIcons 
                name={password.length >= 6 ? "check-circle" : "circle-outline"} 
                size={16} 
                color={password.length >= 6 ? COLORES.exito : COLORES.grisTexto} 
              />
              <Text style={styles.hintText}>Mínimo 6 caracteres</Text>
            </View>
          </View>

          {/* Botón Registro */}
          <Boton
            onPress={handleRegistro}
            loading={loading}
            disabled={loading}
            fullWidth
            style={styles.registerButton}
          >
            Crear Cuenta
          </Boton>

          {/* Link a Login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Inicia sesión aquí</Text>
            </TouchableOpacity>
          </View>
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
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 10,
    zIndex: 1,
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
    width: '100%',
    maxWidth: 500,
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
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: COLORES.error,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: COLORES.error,
    fontSize: 14,
    flex: 1,
  },
  passwordHints: {
    backgroundColor: COLORES.grisClaro,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  hintTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORES.grisOscuro,
    marginBottom: 8,
  },
  hintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 2,
  },
  hintText: {
    fontSize: 12,
    color: COLORES.grisTexto,
  },
  registerButton: {
    marginTop: 10,
    backgroundColor: COLORES.dorado,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: COLORES.grisTexto,
  },
  loginLink: {
    fontSize: 14,
    color: COLORES.dorado,
    fontWeight: 'bold',
  },
});

export default RegistroScreen;