// frontend/src/pantallas/empleado/PanelRecepcionistaScreen.js - Panel principal del recepcionista

import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useEmpleado from '../../hooks/useEmpleado';
import { useAuth } from '../../hooks/useAuth';

/**
 * Panel Principal de Recepcionista/Empleado
 * Muestra:
 * - Reservas de hoy
 * - Estado de habitaciones
 * - Solicitudes pendientes
 * - Calendario de disponibilidad
 */
const PanelRecepcionistaScreen = ({ navigation }) => {
  const { usuario } = useAuth();
  const {
    reservasHoy,
    estadoHabitaciones,
    solicitudes,
    loading,
    error,
    refreshing,
    hacerCheckIn,
    hacerCheckOut,
    cambiarEstadoHabitacion,
    resolverSolicitud,
    refrescaRTodos,
  } = useEmpleado();

  const [seccionActiva, setSeccionActiva] = useState('reservas'); // 'reservas', 'habitaciones', 'solicitudes'

  // Estadísticas
  const checkInsCompletados = reservasHoy.filter((r) => r.tieneCheckin)?.length || 0;
  const habitacionesDisponibles = estadoHabitaciones.filter((h) => h.estado === 'disponible')?.length || 0;
  const habitacionesOcupadas = estadoHabitaciones.filter((h) => h.estado === 'ocupada')?.length || 0;
  const solicitudesPendientes = solicitudes.filter((s) => s.estado === 'pendiente')?.length || 0;

  // Colores por estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'disponible':
        return '#4CAF50';
      case 'ocupada':
        return '#FF6B6B';
      case 'limpieza':
        return '#FFC107';
      case 'mantenimiento':
        return '#FF9800';
      default:
        return '#999';
    }
  };

  // Manejo de check-in
  const handleCheckIn = async (reservaId) => {
    Alert.alert(
      'Confirmar Check-in',
      '¿Deseas realizar el check-in de esta reserva?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            const resultado = await hacerCheckIn(reservaId);
            if (resultado.success) {
              Alert.alert('Éxito', 'Check-in completado');
            } else {
              Alert.alert('Error', resultado.error);
            }
          },
          style: 'default',
        },
      ]
    );
  };

  // Manejo de check-out
  const handleCheckOut = async (reservaId) => {
    Alert.alert(
      'Confirmar Check-out',
      '¿Deseas realizar el check-out de esta reserva?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            const resultado = await hacerCheckOut(reservaId);
            if (resultado.success) {
              Alert.alert('Éxito', `${resultado.mensaje}\nPuntos ganados: ${resultado.puntosGanados}`);
            } else {
              Alert.alert('Error', resultado.error);
            }
          },
          style: 'default',
        },
      ]
    );
  };

  // Tarjeta de reserva para hoy
  const CardReserva = ({ reserva }) => (
    <View style={styles.cardReserva}>
      <View style={styles.encabezadoCard}>
        <Text style={styles.nombreHuesped}>
          {reserva.nombre_huesped} {reserva.apellido_huesped}
        </Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: reserva.tieneCheckin ? '#4CAF50' : '#FF9800',
            },
          ]}
        >
          <Text style={styles.badgeText}>
            {reserva.tieneCheckin ? 'Check-in OK' : 'Pendiente'}
          </Text>
        </View>
      </View>

      <View style={styles.detallesCard}>
        <View style={styles.detalle}>
          <MaterialCommunityIcons name="door" size={20} color="#666" />
          <Text style={styles.textoDetalle}>Hab. {reserva.numero_habitacion}</Text>
        </View>
        <View style={styles.detalle}>
          <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
          <Text style={styles.textoDetalle}>{reserva.hora_llegada_estimada}</Text>
        </View>
        <View style={styles.detalle}>
          <MaterialCommunityIcons name="account-multiple" size={20} color="#666" />
          <Text style={styles.textoDetalle}>{reserva.noches} noches</Text>
        </View>
      </View>

      <View style={styles.botonesCard}>
        {!reserva.tieneCheckin && (
          <TouchableOpacity
            style={[styles.boton, styles.botonCheckIn]}
            onPress={() => handleCheckIn(reserva.id_reserva)}
          >
            <MaterialCommunityIcons name="login" size={18} color="#fff" />
            <Text style={styles.textoBoton}>Check-in</Text>
          </TouchableOpacity>
        )}
        {reserva.tieneCheckin && (
          <TouchableOpacity
            style={[styles.boton, styles.botonCheckOut]}
            onPress={() => handleCheckOut(reserva.id_reserva)}
          >
            <MaterialCommunityIcons name="logout" size={18} color="#fff" />
            <Text style={styles.textoBoton}>Check-out</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.boton, styles.botonDetalle]}
          onPress={() => navigation.navigate('DetalleReserva', { reservaId: reserva.id_reserva })}
        >
          <MaterialCommunityIcons name="eye" size={18} color="#fff" />
          <Text style={styles.textoBoton}>Ver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Tarjeta de habitación
  const CardHabitacion = ({ habitacion }) => (
    <TouchableOpacity
      style={[
        styles.cardHabitacion,
        { borderColor: getEstadoColor(habitacion.estado) },
      ]}
      onPress={() => navigation.navigate('DetalleHabitacion', { habitacionId: habitacion.id_habitacion })}
    >
      <Text style={styles.numeroHabitacion}>Hab. {habitacion.numero_habitacion}</Text>
      <Text style={styles.tipoHabitacion}>{habitacion.tipo_habitacion}</Text>
      <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(habitacion.estado) }]}>
        <Text style={styles.estadoTexto}>{habitacion.estado}</Text>
      </View>
    </TouchableOpacity>
  );

  // Tarjeta de solicitud
  const CardSolicitud = ({ solicitud }) => (
    <View style={styles.cardSolicitud}>
      <View style={styles.encabezadoSolicitud}>
        <Text style={styles.tipoSolicitud}>{solicitud.tipo}</Text>
        <View style={[styles.prioridadBadge, { backgroundColor: getPrioridadColor(solicitud.prioridad) }]}>
          <Text style={styles.textoBoton}>{solicitud.prioridad}</Text>
        </View>
      </View>
      <Text style={styles.descripcionSolicitud} numberOfLines={2}>
        {solicitud.descripcion}
      </Text>
      <View style={styles.infoSolicitud}>
        <Text style={styles.textoInfo}>Hab. {solicitud.numero_habitacion}</Text>
        <Text style={styles.textoInfo}>{solicitud.minutos_espera} min esperando</Text>
      </View>
      <TouchableOpacity
        style={styles.botonResolver}
        onPress={() =>
          Alert.alert('Resolver Solicitud', '¿Marcar esta solicitud como resuelta?', [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Resolver',
              onPress: async () => {
                const resultado = await resolverSolicitud(solicitud.id);
                if (resultado.success) {
                  Alert.alert('Éxito', resultado.mensaje);
                } else {
                  Alert.alert('Error', resultado.error);
                }
              },
            },
          ])
        }
      >
        <MaterialCommunityIcons name="check-circle" size={18} color="#fff" />
        <Text style={styles.textoBoton}>Resolver</Text>
      </TouchableOpacity>
    </View>
  );

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'baja':
        return '#4CAF50';
      case 'media':
        return '#FFC107';
      case 'alta':
        return '#FF6B6B';
      case 'urgente':
        return '#D32F2F';
      default:
        return '#999';
    }
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
        {/* Encabezado */}
        <View style={styles.encabezado}>
          <View>
            <Text style={styles.tituloEncabezado}>Panel de Recepción</Text>
            <Text style={styles.subtituloEncabezado}>Hoy - {new Date().toLocaleDateString()}</Text>
          </View>
          <View style={styles.avatarUsuario}>
            <Text style={styles.iniciales}>{usuario?.nombre?.[0]}{usuario?.apellido?.[0]}</Text>
          </View>
        </View>

        {/* Tarjetas de estadísticas rápidas */}
        <View style={styles.gridEstadisticas}>
          <View style={styles.cardEstadistica}>
            <MaterialCommunityIcons name="door-open" size={28} color="#4CAF50" />
            <Text style={styles.numeroEstadistica}>{checkInsCompletados}/{reservasHoy.length}</Text>
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

        {/* Pestañas de secciones */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, seccionActiva === 'reservas' && styles.tabActivo]}
            onPress={() => setSeccionActiva('reservas')}
          >
            <MaterialCommunityIcons
              name="calendar-check"
              size={20}
              color={seccionActiva === 'reservas' ? '#007AFF' : '#999'}
            />
            <Text
              style={[
                styles.tabTexto,
                seccionActiva === 'reservas' && styles.tabTextoActivo,
              ]}
            >
              Reservas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, seccionActiva === 'habitaciones' && styles.tabActivo]}
            onPress={() => setSeccionActiva('habitaciones')}
          >
            <MaterialCommunityIcons
              name="home-group"
              size={20}
              color={seccionActiva === 'habitaciones' ? '#007AFF' : '#999'}
            />
            <Text
              style={[
                styles.tabTexto,
                seccionActiva === 'habitaciones' && styles.tabTextoActivo,
              ]}
            >
              Habitaciones
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, seccionActiva === 'solicitudes' && styles.tabActivo]}
            onPress={() => setSeccionActiva('solicitudes')}
          >
            <MaterialCommunityIcons
              name="bell"
              size={20}
              color={seccionActiva === 'solicitudes' ? '#007AFF' : '#999'}
            />
            <Text
              style={[
                styles.tabTexto,
                seccionActiva === 'solicitudes' && styles.tabTextoActivo,
              ]}
            >
              Solicitudes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contenido de secciones */}
        {seccionActiva === 'reservas' && (
          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>
              Reservas de Hoy ({reservasHoy.length})
            </Text>
            {reservasHoy.length > 0 ? (
              <FlatList
                data={reservasHoy}
                renderItem={({ item }) => <CardReserva reserva={item} />}
                keyExtractor={(item) => `${item.id_reserva}`}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.sinDatos}>
                <MaterialCommunityIcons name="inbox" size={48} color="#CCC" />
                <Text style={styles.textoSinDatos}>No hay reservas para hoy</Text>
              </View>
            )}
          </View>
        )}

        {seccionActiva === 'habitaciones' && (
          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>
              Estado de Habitaciones ({estadoHabitaciones.length})
            </Text>
            <View style={styles.gridHabitaciones}>
              {estadoHabitaciones.map((hab) => (
                <CardHabitacion key={hab.id_habitacion} habitacion={hab} />
              ))}
            </View>
            <View style={styles.leyenda}>
              <View style={styles.itemLeyenda}>
                <View style={[styles.colorBox, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.textoLeyenda}>Disponible</Text>
              </View>
              <View style={styles.itemLeyenda}>
                <View style={[styles.colorBox, { backgroundColor: '#FF6B6B' }]} />
                <Text style={styles.textoLeyenda}>Ocupada</Text>
              </View>
              <View style={styles.itemLeyenda}>
                <View style={[styles.colorBox, { backgroundColor: '#FFC107' }]} />
                <Text style={styles.textoLeyenda}>Limpieza</Text>
              </View>
            </View>
          </View>
        )}

        {seccionActiva === 'solicitudes' && (
          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>
              Solicitudes Pendientes ({solicitudesPendientes})
            </Text>
            {solicitudes.filter((s) => s.estado === 'pendiente').length > 0 ? (
              <FlatList
                data={solicitudes.filter((s) => s.estado === 'pendiente')}
                renderItem={({ item }) => <CardSolicitud solicitud={item} />}
                keyExtractor={(item) => `${item.id}`}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.sinDatos}>
                <MaterialCommunityIcons name="check-all" size={48} color="#CCC" />
                <Text style={styles.textoSinDatos}>No hay solicitudes pendientes</Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tituloEncabezado: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtituloEncabezado: {
    fontSize: 12,
    color: '#999',
  },
  avatarUsuario: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iniciales: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gridEstadisticas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 16,
    gap: 8,
  },
  cardEstadistica: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  numeroEstadistica: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  labelEstadistica: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  tabActivo: {
    borderBottomWidth: 3,
    borderBottomColor: '#007AFF',
  },
  tabTexto: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  tabTextoActivo: {
    color: '#007AFF',
    fontWeight: '700',
  },
  seccion: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tituloSeccion: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  cardReserva: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  encabezadoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nombreHuesped: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  detallesCard: {
    gap: 8,
    marginBottom: 12,
  },
  detalle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textoDetalle: {
    fontSize: 12,
    color: '#666',
  },
  botonesCard: {
    flexDirection: 'row',
    gap: 8,
  },
  boton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  botonCheckIn: {
    backgroundColor: '#4CAF50',
  },
  botonCheckOut: {
    backgroundColor: '#FF6B6B',
  },
  botonDetalle: {
    backgroundColor: '#007AFF',
  },
  textoBoton: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  gridHabitaciones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardHabitacion: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numeroHabitacion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  tipoHabitacion: {
    fontSize: 10,
    color: '#999',
    marginBottom: 8,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  estadoTexto: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  leyenda: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  itemLeyenda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  textoLeyenda: {
    fontSize: 12,
    color: '#666',
  },
  cardSolicitud: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  encabezadoSolicitud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipoSolicitud: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
    textTransform: 'capitalize',
  },
  prioridadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  descripcionSolicitud: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  infoSolicitud: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  textoInfo: {
    fontSize: 11,
    color: '#999',
  },
  botonResolver: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  sinDatos: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  textoSinDatos: {
    fontSize: 14,
    color: '#999',
  },
});

export default PanelRecepcionistaScreen;
