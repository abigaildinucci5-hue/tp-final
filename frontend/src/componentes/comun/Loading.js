// src/componentes/comun/Loading.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORES } from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';

const { width } = Dimensions.get('window');

const Loading = ({
  mensaje = 'Cargando...',
  tipo = 'normal', // normal, fullscreen, inline, dots
  size = 'large',
  color = COLORES.primario,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  if (tipo === 'inline') {
    return (
      <View style={estilos.inlineContainer}>
        <ActivityIndicator size="small" color={color} />
        {mensaje && <Text style={estilos.mensajeInline}>{mensaje}</Text>}
      </View>
    );
  }

  if (tipo === 'dots') {
    return <LoadingDots color={color} />;
  }

  if (tipo === 'fullscreen') {
    return (
      <View style={estilos.fullscreenContainer}>
        <Animated.View
          style={[
            estilos.fullscreenContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={estilos.logoContainer}>
            <Text style={estilos.logoTexto}>LUNA</Text>
            <Text style={estilos.logoTexto}>SERENA</Text>
          </View>

          <ActivityIndicator
            size="large"
            color={COLORES.secundario}
            style={estilos.indicator}
          />

          {mensaje && <Text style={estilos.mensajeFullscreen}>{mensaje}</Text>}
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={estilos.normalContainer}>
      <ActivityIndicator size={size} color={color} />
      {mensaje && <Text style={estilos.mensajeNormal}>{mensaje}</Text>}
    </View>
  );
};

const LoadingDots = ({ color = COLORES.primario }) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, []);

  const dotStyle = (animValue) => ({
    opacity: animValue,
    transform: [
      {
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  });

  return (
    <View style={estilos.dotsContainer}>
      <Animated.View style={[estilos.dot, { backgroundColor: color }, dotStyle(dot1)]} />
      <Animated.View style={[estilos.dot, { backgroundColor: color }, dotStyle(dot2)]} />
      <Animated.View style={[estilos.dot, { backgroundColor: color }, dotStyle(dot3)]} />
    </View>
  );
};

export const PantallaCarga = ({ mensaje = 'Cargando...' }) => {
  return <Loading tipo="fullscreen" mensaje={mensaje} />;
};

export const SkeletonLoader = ({ count = 3, tipo = 'card' }) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  if (tipo === 'card') {
    return (
      <View>
        {Array.from({ length: count }).map((_, index) => (
          <Animated.View key={index} style={[estilos.skeletonCard, { opacity }]}>
            <View style={estilos.skeletonImage} />
            <View style={estilos.skeletonContent}>
              <View style={estilos.skeletonTitle} />
              <View style={estilos.skeletonText} />
              <View style={[estilos.skeletonText, { width: '60%' }]} />
            </View>
          </Animated.View>
        ))}
      </View>
    );
  }

  return null;
};

const estilos = StyleSheet.create({
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: DIMENSIONES.marginSmall,
  },

  mensajeInline: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoGris,
    marginLeft: DIMENSIONES.marginSmall,
  },

  normalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DIMENSIONES.paddingLarge,
  },

  mensajeNormal: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoGris,
    marginTop: DIMENSIONES.margin,
    textAlign: 'center',
  },

  fullscreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORES.primario,
  },

  fullscreenContent: {
    alignItems: 'center',
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: DIMENSIONES.marginLarge,
  },

  logoTexto: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORES.secundario,
    letterSpacing: 4,
  },

  indicator: {
    marginVertical: DIMENSIONES.marginLarge,
  },

  mensajeFullscreen: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoClaro,
    marginTop: DIMENSIONES.marginLarge,
    opacity: 0.8,
  },

  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DIMENSIONES.marginSmall,
    paddingVertical: DIMENSIONES.margin,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  skeletonCard: {
    backgroundColor: COLORES.fondoTarjeta,
    borderRadius: 12,
    marginBottom: DIMENSIONES.margin,
    padding: DIMENSIONES.padding,
    flexDirection: 'row',
  },

  skeletonImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORES.fondoGris,
  },

  skeletonContent: {
    flex: 1,
    marginLeft: DIMENSIONES.margin,
    justifyContent: 'center',
  },

  skeletonTitle: {
    height: 20,
    backgroundColor: COLORES.fondoGris,
    borderRadius: 4,
    marginBottom: DIMENSIONES.marginSmall,
  },

  skeletonText: {
    height: 14,
    backgroundColor: COLORES.fondoGris,
    borderRadius: 4,
    marginBottom: DIMENSIONES.marginSmall,
  },
});

export default Loading;
