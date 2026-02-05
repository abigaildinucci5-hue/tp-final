// frontend/src/hooks/useLocation.js
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { obtenerUbicacionActual } from '../utils/permisos';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permiso, setPermiso] = useState(false);

  // Verificar permisos al montar
  useEffect(() => {
    verificarPermisos();
  }, []);

  // Verificar si tiene permisos de ubicación
  const verificarPermisos = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setPermiso(status === 'granted');
    } catch (err) {
      console.error('Error al verificar permisos:', err);
      setPermiso(false);
    }
  };

  // Solicitar permisos de ubicación
  const solicitarPermisos = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermiso(status === 'granted');
      return status === 'granted';
    } catch (err) {
      console.error('Error al solicitar permisos:', err);
      setError('No se pudieron solicitar los permisos de ubicación');
      return false;
    }
  };

  // Obtener ubicación actual
  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      // Verificar permisos
      if (!permiso) {
        const granted = await solicitarPermisos();
        if (!granted) {
          throw new Error('Permisos de ubicación denegados');
        }
      }

      // Obtener ubicación
      const ubicacion = await obtenerUbicacionActual();
      
      if (ubicacion) {
        setLocation(ubicacion);
        return ubicacion;
      } else {
        throw new Error('No se pudo obtener la ubicación');
      }
    } catch (err) {
      console.error('Error al obtener ubicación:', err);
      setError(err.message || 'Error al obtener ubicación');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Calcular distancia entre dos coordenadas (en km)
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c;
    
    return distancia;
  };

  // Convertir grados a radianes
  const toRad = (value) => {
    return (value * Math.PI) / 180;
  };

  // Obtener dirección desde coordenadas (geocodificación inversa)
  const getDireccionFromCoords = async (latitude, longitude) => {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        return addresses[0];
      }
      return null;
    } catch (err) {
      console.error('Error al obtener dirección:', err);
      return null;
    }
  };

  // Obtener coordenadas desde dirección (geocodificación)
  const getCoordsFromDireccion = async (direccion) => {
    try {
      const locations = await Location.geocodeAsync(direccion);

      if (locations && locations.length > 0) {
        return {
          latitude: locations[0].latitude,
          longitude: locations[0].longitude,
        };
      }
      return null;
    } catch (err) {
      console.error('Error al obtener coordenadas:', err);
      return null;
    }
  };

  // Watch position (actualización continua de ubicación)
  const watchLocation = async (callback) => {
    try {
      if (!permiso) {
        await solicitarPermisos();
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // 5 segundos
          distanceInterval: 10, // 10 metros
        },
        (newLocation) => {
          const coords = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };
          setLocation(coords);
          if (callback) callback(coords);
        }
      );

      return subscription;
    } catch (err) {
      console.error('Error al observar ubicación:', err);
      setError('Error al observar ubicación');
      return null;
    }
  };

  return {
    // Estado
    location,
    loading,
    error,
    permiso,
    
    // Funciones
    getCurrentLocation,
    solicitarPermisos,
    verificarPermisos,
    calcularDistancia,
    getDireccionFromCoords,
    getCoordsFromDireccion,
    watchLocation,
  };
};

export default useLocation;