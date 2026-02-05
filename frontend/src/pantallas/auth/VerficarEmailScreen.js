// frontend/src/pantallas/auth/VerificarEmailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import authService from '../../servicios/authService';
import Boton from '../../componentes/comun/Boton';

const VerificarEmailScreen = ({ navigation, route }) => {
  const { token } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [verificado, setVerificado] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    verificarEmail();
  }, []);

  const verificarEmail = async () => {
    if (!token) {
      setError('Token de verificación no válido');
      setLoading(false);
      return;
    }

    try {
      await authService.verifyEmail(token);
      setVerificado(true);
    } catch (err) {
      setError(err.message || 'Error al verificar email');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={ESTILOS_GLOBALES.containerCenter}>
        <ActivityIndicator size="large" color={COLORES.primario} />
        <Text style={estilos.loadingText}>Verificando email...</Text>
      </View>
    );
  }

  if (verificado) {
    return (
      <View style={ESTILOS_GLOBALES.containerCenter}>
        <View style={estilos.container}>
          <View style={estilos.iconContainer}>
            <MaterialCommunityIcons name="check-circle" size={100} color={COLORES.exito} />
          </View>
          <Text style={estilos.titulo}>¡Email Verificado!</Text>
          <Text style={estilos.descripcion}>
            Tu cuenta ha sido verificada exitosamente. Ya puedes iniciar sesión.
          </Text>
          <Boton onPress={() => navigation.navigate('Login')} fullWidth>
            Ir al Login
          </Boton>
        </View>
      </View>
    );
  }

  return (
    <View style={ESTILOS_GLOBALES.containerCenter}>
      <View style={estilos.container}>
        <View style={estilos.iconContainer}>
          <MaterialCommunityIcons name="close-circle" size={100} color={COLORES.error} />
        </View>
        <Text style={estilos.titulo}>Error de Verificación</Text>
        <Text style={estilos.descripcion}>{error}</Text>
        <Boton onPress={() => navigation.navigate('Login')} fullWidth>
          Volver al Login
        </Boton>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    padding: DIMENSIONES.paddingLarge,
    alignItems: 'center',
    gap: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoMedio,
    marginTop: 16,
  },
  titulo: {
    fontSize: TIPOGRAFIA.fontSizeHeading,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    textAlign: 'center',
  },
  descripcion: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoMedio,
    textAlign: 'center',
    lineHeight: TIPOGRAFIA.lineHeightMedium,
  },
});

export default VerificarEmailScreen;