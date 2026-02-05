// frontend/src/pantallas/auth/RecuperarPasswordScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Componentes
import Input from '../../componentes/comun/Input';
import Boton from '../../componentes/comun/Boton';

// Constantes
import { COLORES } from '../../constantes/colores';
import { ESPACIADO, FUENTES } from '../../constantes/estilos';

// Validaciones
import { validarEmail } from '../../utils/validaciones';

const RecuperarPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // Validación
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!email.trim()) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!validarEmail(email)) {
      nuevosErrores.email = 'Email inválido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Enviar email de recuperación
  const handleEnviar = async () => {
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Llamar al servicio de recuperación de contraseña
      // await authService.recuperarPassword(email);

      // Simulación
      await new Promise(resolve => setTimeout(resolve, 1500));

      setEnviado(true);
      Alert.alert(
        'Email enviado',
        'Si el correo existe, recibirás instrucciones para recuperar tu contraseña.',
        [
          {
            text: 'Entendido',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el email. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Volver a login
  const irALogin = () => {
    navigation.goBack();
  };

  if (enviado) {
    return (
      <View style={estilos.container}>
        <View style={estilos.exitoContainer}>
          <MaterialCommunityIcons name="check-circle" size={80} color={COLORES.exito} />
          <Text style={estilos.exitoTitulo}>Email enviado</Text>
          <Text style={estilos.exitoTexto}>
            Revisa tu bandeja de entrada y sigue las instrucciones para
            recuperar tu contraseña.
          </Text>
          <Boton
            onPress={irALogin}
            variant="primary"
            size="large"
            fullWidth
            style={estilos.botonVolver}
          >
            Volver al inicio de sesión
          </Boton>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={estilos.container}
    >
      <ScrollView
        contentContainerStyle={estilos.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <TouchableOpacity
          style={estilos.botonAtras}
          onPress={irALogin}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORES.textoOscuro} />
        </TouchableOpacity>

        <View style={estilos.headerContainer}>
          <View style={estilos.iconoContainer}>
            <MaterialCommunityIcons name="lock" size={60} color={COLORES.primario} />
          </View>
          <Text style={estilos.titulo}>¿Olvidaste tu contraseña?</Text>
          <Text style={estilos.descripcion}>
            Ingresa tu email y te enviaremos instrucciones para recuperar tu
            contraseña.
          </Text>
        </View>

        {/* Formulario */}
        <View style={estilos.formContainer}>
          <Input
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errores.email) {
                setErrores({ ...errores, email: '' });
              }
            }}
            placeholder="ejemplo@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icono="email-outline"
            error={errores.email}
            editable={!loading}
          />

          <Boton
            onPress={handleEnviar}
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            disabled={loading}
            style={estilos.botonEnviar}
          >
            Enviar instrucciones
          </Boton>

          <TouchableOpacity
            onPress={irALogin}
            style={estilos.volverContainer}
            disabled={loading}
          >
            <MaterialCommunityIcons
              name="arrow-left-circle-outline"
              size={20}
              color={COLORES.primario}
            />
            <Text style={estilos.volverTexto}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORES.fondoClaro,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: ESPACIADO.lg,
    paddingTop: ESPACIADO.xl,
  },

  botonAtras: {
    alignSelf: 'flex-start',
    padding: ESPACIADO.sm,
    marginBottom: ESPACIADO.md,
  },

  headerContainer: {
    alignItems: 'center',
    paddingVertical: ESPACIADO.xl,
  },

  iconoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORES.primario + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ESPACIADO.lg,
  },

  titulo: {
    fontSize: FUENTES.xxl,
    fontWeight: 'bold',
    color: COLORES.textoOscuro,
    marginBottom: ESPACIADO.sm,
    textAlign: 'center',
  },

  descripcion: {
    fontSize: FUENTES.md,
    color: COLORES.textoGris,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: ESPACIADO.md,
  },

  formContainer: {
    flex: 1,
    paddingBottom: ESPACIADO.xl,
  },

  botonEnviar: {
    marginTop: ESPACIADO.md,
  },

  volverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ESPACIADO.xl,
    gap: ESPACIADO.xs,
  },

  volverTexto: {
    fontSize: FUENTES.md,
    color: COLORES.primario,
    fontWeight: '600',
  },

  // Pantalla de éxito
  exitoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ESPACIADO.xl,
  },

  exitoTitulo: {
    fontSize: FUENTES.xxl,
    fontWeight: 'bold',
    color: COLORES.textoOscuro,
    marginTop: ESPACIADO.lg,
    marginBottom: ESPACIADO.sm,
    textAlign: 'center',
  },

  exitoTexto: {
    fontSize: FUENTES.md,
    color: COLORES.textoGris,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: ESPACIADO.xl,
  },

  botonVolver: {
    marginTop: ESPACIADO.lg,
  },
});

export default RecuperarPasswordScreen;