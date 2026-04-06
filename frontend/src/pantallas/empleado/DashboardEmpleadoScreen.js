// frontend/src/pantallas/empleado/DashboardEmpleadoScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import NavbarEmpleado from '../../componentes/empleado/NavbarEmpleado';
import { useAuth } from '../../contexto/AuthContext';
import { useReservas } from '../../hooks/useReservas';
import { useHabitaciones } from '../../hooks/useHabitaciones';

const DashboardEmpleadoScreen = ({ navigation }) => {
  const { usuario, logout } = useAuth();
  const { reservas, cargarReservas } = useReservas();
  const { habitaciones, cargarHabitaciones } = useHabitaciones();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      await cargarReservas();
      await cargarHabitaciones();
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  // Calcular estadísticas
  const reservasHoy = reservas.filter(r => {
    const hoy = new Date().toISOString().split('T')[0];
    return r.fecha_reserva?.includes(hoy);
  }).length;

  const habitacionesOcupadas = habitaciones.filter(h => h.estado === 'ocupada').length;
  const habitacionesLibres = habitaciones.filter(h => h.estado === 'disponible').length;
  const habitacionesMantenimiento = habitaciones.filter(h => h.estado === 'mantenimiento').length;

  const menuOpciones = [
    {
      id: 'reservas',
      titulo: 'Gestión de Reservas',
      pantalla: 'GestionReservasEmpleado',
      icon: 'calendar-multiple-check',
      color: COLORES.primario,
      descripcion: 'Ver y gestionar todas las reservas',
      count: reservas.length,
    },
    {
      id: 'habitaciones',
      titulo: 'Gestión de Habitaciones',
      pantalla: 'GestionHabitacionesEmpleado',
      icon: 'bed-king',
      color: COLORES.exito,
      descripcion: 'Ver estado de habitaciones',
      count: habitacionesOcupadas,
    },
    {
      id: 'checkin',
      titulo: 'Check-in/Check-out',
      pantalla: 'CheckInOut',
      icon: 'login',
      color: COLORES.advertencia,
      descripcion: 'Procesar entrada y salida',
    },
  ];

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <NavbarEmpleado usuario={usuario} onLogout={handleLogout} navigation={navigation} />

      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilos.scrollContent}>
          {/* Hero Section */}
          <View style={estilos.heroSection}>
            <Text style={estilos.heroTitulo}>Panel de Recepción</Text>
            <Text style={estilos.heroSubtitulo}>
              Bienvenido, {usuario?.nombre || 'Empleado'}
            </Text>
          </View>

          {/* Estadísticas Rápidas */}
          <View style={estilos.statsContainer}>
            <View style={[estilos.statCard, { backgroundColor: COLORES.primario + '15' }]}>
              <MaterialCommunityIcons name="calendar-check" size={32} color={COLORES.primario} />
              <Text style={estilos.statNumber}>{reservas.length}</Text>
              <Text style={estilos.statLabel}>Reservas Totales</Text>
            </View>

            <View style={[estilos.statCard, { backgroundColor: COLORES.exito + '15' }]}>
              <MaterialCommunityIcons name="bed" size={32} color={COLORES.exito} />
              <Text style={estilos.statNumber}>{habitacionesLibres}</Text>
              <Text style={estilos.statLabel}>Disponibles</Text>
            </View>

            <View style={[estilos.statCard, { backgroundColor: COLORES.advertencia + '15' }]}>
              <MaterialCommunityIcons name="door-closed" size={32} color={COLORES.advertencia} />
              <Text style={estilos.statNumber}>{habitacionesOcupadas}</Text>
              <Text style={estilos.statLabel}>Ocupadas</Text>
            </View>

            <View style={[estilos.statCard, { backgroundColor: COLORES.error + '15' }]}>
              <MaterialCommunityIcons name="tools" size={32} color={COLORES.error} />
              <Text style={estilos.statNumber}>{habitacionesMantenimiento}</Text>
              <Text style={estilos.statLabel}>Mantenimiento</Text>
            </View>
          </View>

          {/* Menú Principal */}
          <View style={estilos.menuContainer}>
            <Text style={estilos.seccionTitulo}>Gestión</Text>

            {menuOpciones.map((opcion) => (
              <TouchableOpacity
                key={opcion.id}
                style={estilos.menuItem}
                onPress={() => navigation.navigate(opcion.pantalla)}
                activeOpacity={0.7}
              >
                <View style={[estilos.iconContainer, { backgroundColor: opcion.color + '15' }]}>
                  <MaterialCommunityIcons
                    name={opcion.icon}
                    size={28}
                    color={opcion.color}
                  />
                </View>
                <View style={estilos.menuInfo}>
                  <Text style={estilos.menuTexto}>{opcion.titulo}</Text>
                  <Text style={estilos.menuDescripcion}>{opcion.descripcion}</Text>
                </View>
                {opcion.count !== undefined && (
                  <View style={[estilos.badge, { backgroundColor: opcion.color }]}>
                    <Text style={estilos.badgeText}>{opcion.count}</Text>
                  </View>
                )}
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={COLORES.textoMedio}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  scrollContent: {
    paddingBottom: DIMENSIONES.padding,
  },
  heroSection: {
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding * 1.5,
    marginHorizontal: DIMENSIONES.padding,
    marginTop: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    marginBottom: DIMENSIONES.padding * 1.5,
  },
  heroTitulo: {
    fontSize: TIPOGRAFIA.fontSizeDisplay,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 8,
  },
  heroSubtitulo: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    color: COLORES.textoMedio,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: DIMENSIONES.padding,
    marginBottom: DIMENSIONES.padding * 2,
    gap: 12,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    padding: DIMENSIONES.padding,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  statNumber: {
    fontSize: TIPOGRAFIA.fontSizeDisplay,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: DIMENSIONES.padding,
    marginBottom: DIMENSIONES.padding * 2,
  },
  seccionTitulo: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: DIMENSIONES.padding,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: DIMENSIONES.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuInfo: {
    flex: 1,
  },
  menuTexto: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
    marginBottom: 2,
  },
  menuDescripcion: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  badge: {
    backgroundColor: COLORES.primario,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  badgeText: {
    color: COLORES.textoBlanco,
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightBold,
  },
});

export default DashboardEmpleadoScreen;
