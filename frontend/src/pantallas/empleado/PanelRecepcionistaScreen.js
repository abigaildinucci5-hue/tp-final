// frontend/src/pantallas/empleado/PanelRecepcionistaScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useEmpleado from '../../hooks/useEmpleado';
import { useAuth } from '../../contexto/AuthContext';

const PanelRecepcionistaScreen = ({ navigation }) => {
  const { usuario, logout } = useAuth();

  const {
    reservasHoy,
    estadoHabitaciones,
    solicitudes,
    loading,
    refreshing,
    hacerCheckIn,
    hacerCheckOut,
    resolverSolicitud,
    refrescaRTodos,
  } = useEmpleado();

  const [seccionActiva, setSeccionActiva] = useState('reservas');
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);

  const checkInsCompletados = reservasHoy.filter((r) => r.tieneCheckin)?.length || 0;
  const habitacionesDisponibles = estadoHabitaciones.filter((h) => h.estado === 'disponible')?.length || 0;
  const habitacionesOcupadas = estadoHabitaciones.filter((h) => h.estado === 'ocupada')?.length || 0;
  const solicitudesPendientes = solicitudes.filter((s) => s.estado === 'pendiente')?.length || 0;

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'disponible': return '#4CAF50';
      case 'ocupada': return '#FF6B6B';
      case 'limpieza': return '#FFC107';
      case 'mantenimiento': return '#FF9800';
      default: return '#999';
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'baja': return '#4CAF50';
      case 'media': return '#FFC107';
      case 'alta': return '#FF6B6B';
      case 'urgente': return '#D32F2F';
      default: return '#999';
    }
  };

  const handleLogout = () => {
    setMostrarMenuUsuario(false);
    setTimeout(() => {
      Alert.alert(
        'Cerrar Sesión',
        '¿Estás seguro que querés salir?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Salir',
            style: 'destructive',
            onPress: async () => {
              await logout();
            },
          },
        ],
        { cancelable: false }
      );
    }, 100);
  };

  if (loading && !reservasHoy.length) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refrescaRTodos} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.encabezado}>
          <View style={{ flex: 1 }}>
            <Text style={styles.tituloEncabezado}>Panel de Recepción</Text>
            <Text style={styles.subtituloEncabezado}>
              Hoy - {new Date().toLocaleDateString()}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.avatarUsuario}
            onPress={() => setMostrarMenuUsuario(true)}
          >
            <Text style={styles.iniciales}>
              {usuario?.nombre?.[0]}
              {usuario?.apellido?.[0]}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Estadísticas */}
        <View style={styles.gridEstadisticas}>
          <View style={styles.cardEstadistica}>
            <MaterialCommunityIcons name="door-open" size={28} color="#4CAF50" />
            <Text style={styles.numeroEstadistica}>
              {checkInsCompletados}/{reservasHoy.length}
            </Text>
            <Text style={styles.labelEstadistica}>Check-ins</Text>
          </View>

          <View style={styles.cardEstadistica}>
            <MaterialCommunityIcons name="bed" size={28} color="#4CAF50" />
            <Text style={styles.numeroEstadistica}>{habitacionesDisponibles}</Text>
            <Text style={styles.labelEstadistica}>Disponibles</Text>
          </View>

          <View style={styles.cardEstadistica}>
            <MaterialCommunityIcons name="door-closed" size={28} color="#FF6B6B" />
            <Text style={styles.numeroEstadistica}>{habitacionesOcupadas}</Text>
            <Text style={styles.labelEstadistica}>Ocupadas</Text>
          </View>

          <View style={styles.cardEstadistica}>
            <MaterialCommunityIcons name="alert-circle" size={28} color="#FF9800" />
            <Text style={styles.numeroEstadistica}>{solicitudesPendientes}</Text>
            <Text style={styles.labelEstadistica}>Solicitudes</Text>
          </View>
        </View>
      </ScrollView>

      {/* MENU USUARIO - SIN MODAL */}
      {mostrarMenuUsuario && (
        <TouchableOpacity 
          style={styles.menuOverlayFull}
          onPress={() => setMostrarMenuUsuario(false)}
          activeOpacity={1}
        >
          <View style={styles.menuContainer} pointerEvents="box-none">
            <View style={styles.menuDropdown} pointerEvents="auto">
              <View style={styles.menuHeader}>
                <View style={styles.menuAvatar}>
                  <Text style={styles.menuAvatarText}>
                    {usuario?.nombre?.[0]}
                    {usuario?.apellido?.[0]}
                  </Text>
                </View>

                <View style={styles.menuHeaderInfo}>
                  <Text style={styles.menuNombre}>{usuario?.nombre}</Text>
                  <Text style={styles.menuEmail}>{usuario?.email}</Text>
                  <Text style={styles.menuRol}>{usuario?.rol}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.menuItem, styles.menuItemRojo]}
                onPress={handleLogout}
              >
                <MaterialCommunityIcons name="logout" size={20} color="#FF6B6B" />
                <Text style={[styles.menuItemLabel, { color: '#FF6B6B' }]}>
                  Cerrar Sesión
                </Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  tituloEncabezado: { fontSize: 22, fontWeight: 'bold' },
  subtituloEncabezado: { fontSize: 12, color: '#999' },
  avatarUsuario: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iniciales: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  gridEstadisticas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
  },
  cardEstadistica: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  numeroEstadistica: { fontSize: 22, fontWeight: 'bold' },
  labelEstadistica: { fontSize: 12, color: '#999' },

  menuOverlayFull: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1000,
  },
  menuContainer: {
    position: 'absolute',
    top: 70,
    right: 16,
    width: '85%',
    maxWidth: 280,
  },
  menuDropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuAvatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  menuHeaderInfo: { marginLeft: 10 },
  menuNombre: { fontWeight: '600' },
  menuEmail: { fontSize: 12, color: '#999' },
  menuRol: { fontSize: 11, color: '#007AFF' },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  menuItemLabel: { flex: 1, fontWeight: '500' },
  menuItemRojo: { backgroundColor: 'rgba(255,107,107,0.05)' },
});

export default PanelRecepcionistaScreen;