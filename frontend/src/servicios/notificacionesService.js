// src/servicios/notificacionesService.js - Servicios de notificaciones
import api from './api';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Configurar notificaciones
 */
export const configurarNotificaciones = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};

/**
 * Registrar para notificaciones push
 */
export const registrarParaPush = async () => {
  try {
    if (!Device.isDevice) {
      console.warn('Las notificaciones push solo funcionan en dispositivos físicos');
      return null;
    }

    // Pedir permisos
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permisos de notificación denegados');
      return null;
    }

    // Obtener token de Expo
    const token = (await Notifications.getExpoPushTokenAsync()).data;

    // Configurar canal para Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Guardar token en el backend
    await guardarTokenPush(token);

    return token;
  } catch (error) {
    console.error('Error al registrar para push:', error);
    return null;
  }
};

/**
 * Guardar token push en el backend
 */
const guardarTokenPush = async (token) => {
  try {
    await api.post('/notificaciones/token', { token, tipo: 'expo' });
  } catch (error) {
    console.error('Error al guardar token push:', error);
  }
};

/**
 * Obtener notificaciones
 */
export const obtenerNotificaciones = async (params = {}) => {
  const response = await api.get('/notificaciones', { params });
  return response;
};

/**
 * Obtener notificaciones no leídas
 */
export const obtenerNoLeidas = async () => {
  const response = await api.get('/notificaciones/no-leidas');
  return response;
};

/**
 * Obtener cantidad de notificaciones no leídas
 */
export const obtenerCantidadNoLeidas = async () => {
  const response = await api.get('/notificaciones/cantidad-no-leidas');
  return response;
};

/**
 * Marcar notificación como leída
 */
export const marcarLeida = async (idNotificacion) => {
  const response = await api.put(`/notificaciones/${idNotificacion}/marcar-leida`);
  return response;
};

/**
 * Marcar todas las notificaciones como leídas
 */
export const marcarTodasLeidas = async () => {
  const response = await api.put('/notificaciones/marcar-todas-leidas');
  return response;
};

/**
 * Eliminar notificación
 */
export const eliminarNotificacion = async (idNotificacion) => {
  const response = await api.delete(`/notificaciones/${idNotificacion}`);
  return response;
};

/**
 * Limpiar todas las notificaciones
 */
export const limpiarTodas = async () => {
  const response = await api.delete('/notificaciones/limpiar-todas');
  return response;
};

/**
 * Programar notificación local
 */
export const programarNotificacionLocal = async (titulo, mensaje, segundos = 0) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: mensaje,
      sound: true,
    },
    trigger: segundos > 0 ? { seconds: segundos } : null,
  });
};

/**
 * Cancelar todas las notificaciones programadas
 */
export const cancelarNotificaciones = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

/**
 * Agregar listener para notificaciones recibidas
 */
export const agregarListenerNotificaciones = (callback) => {
  return Notifications.addNotificationReceivedListener(callback);
};

/**
 * Agregar listener para cuando se toca una notificación
 */
export const agregarListenerRespuesta = (callback) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};