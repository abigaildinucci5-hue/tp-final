// frontend/src/pantallas/home/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA } from '../../constantes/estilos';
import { IMAGENES_LOCALES } from '../../constantes/imagenes';
import { HOTEL_INFO } from '../../constantes/config';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Simular carga de la app
    const timer = setTimeout(() => {
      // Aquí se verificaría si hay sesión activa
      navigation.replace('Auth'); // o 'Main' si está autenticado
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={estilos.container}>
      <Image source={IMAGENES_LOCALES.logo} style={estilos.logo} />
      <Text style={estilos.titulo}>{HOTEL_INFO.nombre}</Text>
      <Text style={estilos.subtitulo}>Tu lugar de descanso perfecto</Text>
      
      <ActivityIndicator
        size="large"
        color={COLORES.primario}
        style={estilos.loader}
      />
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORES.fondoBlanco,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  titulo: {
    fontSize: TIPOGRAFIA.fontSizeDisplay,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoMedio,
  },
  loader: {
    marginTop: 40,
  },
});

export default SplashScreen;