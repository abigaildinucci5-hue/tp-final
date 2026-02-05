// frontend/src/utils/permisos.js
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Alert, Linking, Platform } from 'react-native';

// ============ PERMISOS DE CÁMARA ============

// Solicitar permiso de cámara
export const solicitarPermisoCamara = async () => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      mostrarAlertaPermisoDenegado(
        'Permiso de Cámara',
        'Necesitamos acceso a la cámara para tomar fotos.'
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error al solicitar permiso de cámara:', error);
    return false;
  }
};

// Verificar si tiene permiso de cámara
export const tienePermisoCamara = async () => {
  try {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error al verificar permiso de cámara:', error);
    return false;
  }
};

// ============ PERMISOS DE GALERÍA ============

// Solicitar permiso de galería/librería de fotos
export const solicitarPermisoGaleria = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      mostrarAlertaPermisoDenegado(
        'Permiso de Galería',
        'Necesitamos acceso a tu galería de fotos.'
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error al solicitar permiso de galería:', error);
    return false;
  }
};

// Verificar si tiene permiso de galería
export const tienePermisoGaleria = async () => {
  try {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error al verificar permiso de galería:', error);
    return false;
  }
};

// ============ PERMISOS DE UBICACIÓN ============

// Solicitar permiso de ubicación
export const solicitarPermisoUbicacion = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      mostrarAlertaPermisoDenegado(
        'Permiso de Ubicación',
        'Necesitamos acceso a tu ubicación para mostrarte hoteles cercanos.'
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error al solicitar permiso de ubicación:', error);
    return false;
  }
};

// Verificar si tiene permiso de ubicación
export const tienePermisoUbicacion = async () => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error al verificar permiso de ubicación:', error);
    return false;
  }
};

// Obtener ubicación actual
export const obtenerUbicacionActual = async () => {
  try {
    const tienePermiso = await tienePermisoUbicacion();
    
    if (!tienePermiso) {
      const permisoOtorgado = await solicitarPermisoUbicacion();
      if (!permisoOtorgado) return null;
    }
    
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error al obtener ubicación:', error);
    return null;
  }
};

// ============ PERMISOS DE NOTIFICACIONES ============

// Solicitar permiso de notificaciones
export const solicitarPermisoNotificaciones = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      mostrarAlertaPermisoDenegado(
        'Permiso de Notificaciones',
        'Necesitamos enviar notificaciones para recordatorios de reservas.'
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error al solicitar permiso de notificaciones:', error);
    return false;
  }
};

// Verificar si tiene permiso de notificaciones
export const tienePermisoNotificaciones = async () => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error al verificar permiso de notificaciones:', error);
    return false;
  }
};

// ============ FUNCIONES AUXILIARES ============

// Mostrar alerta cuando se deniega un permiso
const mostrarAlertaPermisoDenegado = (titulo, mensaje) => {
  Alert.alert(
    titulo,
    `${mensaje}\n\nPuedes habilitar el permiso desde la configuración de la aplicación.`,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Abrir Configuración',
        onPress: () => abrirConfiguracion(),
      },
    ]
  );
};

// Abrir configuración del sistema
export const abrirConfiguracion = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};

// Solicitar todos los permisos necesarios
export const solicitarPermisosIniciales = async () => {
  const permisos = {
    notificaciones: false,
    ubicacion: false,
  };
  
  // Solicitar notificaciones
  permisos.notificaciones = await solicitarPermisoNotificaciones();
  
  // Solicitar ubicación (opcional, no bloquear si no se otorga)
  const ubicacion = await solicitarPermisoUbicacion();
  permisos.ubicacion = ubicacion;
  
  return permisos;
};

// Verificar todos los permisos
export const verificarTodosLosPermisos = async () => {
  const permisos = {
    camara: await tienePermisoCamara(),
    galeria: await tienePermisoGaleria(),
    ubicacion: await tienePermisoUbicacion(),
    notificaciones: await tienePermisoNotificaciones(),
  };
  
  return permisos;
};

// ============ SELECCIONAR IMAGEN ============

// Seleccionar imagen de la cámara
export const seleccionarImagenCamara = async () => {
  try {
    const tienePermiso = await tienePermisoCamara();
    
    if (!tienePermiso) {
      const permisoOtorgado = await solicitarPermisoCamara();
      if (!permisoOtorgado) return null;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      return result.assets[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error al seleccionar imagen de cámara:', error);
    return null;
  }
};

// Seleccionar imagen de la galería
export const seleccionarImagenGaleria = async () => {
  try {
    const tienePermiso = await tienePermisoGaleria();
    
    if (!tienePermiso) {
      const permisoOtorgado = await solicitarPermisoGaleria();
      if (!permisoOtorgado) return null;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      return result.assets[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error al seleccionar imagen de galería:', error);
    return null;
  }
};

// Mostrar opciones para seleccionar imagen (cámara o galería)
export const mostrarOpcionesImagen = () => {
  return new Promise((resolve) => {
    Alert.alert(
      'Seleccionar Imagen',
      'Elige una opción',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => resolve(null),
        },
        {
          text: 'Tomar Foto',
          onPress: async () => {
            const imagen = await seleccionarImagenCamara();
            resolve(imagen);
          },
        },
        {
          text: 'Elegir de Galería',
          onPress: async () => {
            const imagen = await seleccionarImagenGaleria();
            resolve(imagen);
          },
        },
      ]
    );
  });
};

export default {
  solicitarPermisoCamara,
  tienePermisoCamara,
  solicitarPermisoGaleria,
  tienePermisoGaleria,
  solicitarPermisoUbicacion,
  tienePermisoUbicacion,
  obtenerUbicacionActual,
  solicitarPermisoNotificaciones,
  tienePermisoNotificaciones,
  abrirConfiguracion,
  solicitarPermisosIniciales,
  verificarTodosLosPermisos,
  seleccionarImagenCamara,
  seleccionarImagenGaleria,
  mostrarOpcionesImagen,
};