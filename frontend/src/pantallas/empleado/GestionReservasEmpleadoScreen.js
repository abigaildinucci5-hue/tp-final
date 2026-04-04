// frontend/src/pantallas/empleado/GestionReservasEmpleadoScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ESTILOS_GLOBALES, DIMENSIONES, TIPOGRAFIA } from '../../constantes/estilos';
import { useReservas } from '../../hooks/useReservas';
import NavbarEmpleado from '../../componentes/empleado/NavbarEmpleado';
import COLORES from '../../constantes/colores';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexto/AuthContext';
import { formatearFecha } from '../../utils/dateFormatter';
import { useFocusEffect } from '@react-navigation/native';

const GestionReservasEmpleadoScreen = ({ navigation }) => {
  const { usuario, logout } = useAuth();
  const { reservas, loading, cargarReservas } = useReservas();
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [reservasFiltradas, setReservasFiltradas] = useState([]);

  useFocusEffect(
  React.useCallback(() => {
    cargarReservas();
  }, [cargarReservas, filtroEstado])
);

  useEffect(() => {
    // Filtrar reservas según estado
    if (filtroEstado === 'todas') {
      setReservasFiltradas(reservas);
    } else {
      setReservasFiltradas(
        reservas.filter((r) => r.estado === filtroEstado)
      );
    }
  }, [reservas, filtroEstado]);

  const handleLogout = async () => {
    await logout();
  };

  const handleReservaPress = (reserva) => {
    navigation.navigate('DetalleReservaEmpleado', { reserva });
  };

  const renderReserva = ({ item }) => (
    <TouchableOpacity
      style={estilos.reservaCard}
      onPress={() => handleReservaPress(item)}
      activeOpacity={0.7}
    >
      {/* Header con cliente y estado */}
      <View style={estilos.reservaHeader}>
        <View>
          <Text style={estilos.clienteNombre}>{`${item.nombre_usuario || ''} ${item.apellido_usuario || ''}`.trim() || 'Cliente'}</Text>
          <Text style={estilos.clienteEmail}>{item.email_usuario || 'N/A'}</Text>
        </View>
        <View style={[estilos.estadoBadge, { backgroundColor: getEstadoColor(item.estado) + '20' }]}>
          <Text style={[estilos.estadoText, { color: getEstadoColor(item.estado) }]}>
            {item.estado?.toUpperCase() || 'PENDIENTE'}
          </Text>
        </View>
      </View>

      {/* Detalles de reserva */}
      <View style={estilos.reservaDetalles}>
        <View style={estilos.detalleRow}>
          <MaterialCommunityIcons name="bed" size={16} color={COLORES.textoMedio} />
          <Text style={estilos.detalleTexto}>
            Hab. {item.numero_habitacion || 'N/A'} - {item.tipo_habitacion || 'Estándar'}
          </Text>
        </View>

        <View style={estilos.detalleRow}>
          <MaterialCommunityIcons name="calendar" size={16} color={COLORES.textoMedio} />
          <Text style={estilos.detalleTexto}>
            {formatearFecha(item.fecha_entrada)} a {formatearFecha(item.fecha_salida)}
          </Text>
        </View>

        <View style={estilos.detalleRow}>
          <MaterialCommunityIcons name="account-circle" size={16} color={COLORES.textoMedio} />
          <Text style={estilos.detalleTexto}>
            Huéspedes: {item.cantidad_huespedes || 1}
          </Text>
        </View>

        <View style={estilos.detalleRow}>
          <MaterialCommunityIcons name="clock" size={16} color={COLORES.textoMedio} />
          <Text style={estilos.detalleTexto}>
            Reservado: {formatearFecha(item.fecha_creacion)}
          </Text>
        </View>

        <View style={[estilos.detalleRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORES.borde }]}>
          <MaterialCommunityIcons name="cash" size={16} color={COLORES.primario} />
          <Text style={[estilos.detalleTexto, { fontWeight: TIPOGRAFIA.fontWeightBold, color: COLORES.primario }]}>
            ${item.precio_total || 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return COLORES.advertencia;
      case 'confirmada':
        return COLORES.exito;
      case 'cancelada':
        return COLORES.error;
      case 'completada':
        return COLORES.primario;
      default:
        return COLORES.textoMedio;
    }
  };

  const estados = ['todas', 'pendiente', 'confirmada', 'cancelada', 'completada'];

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <NavbarEmpleado usuario={usuario} onLogout={handleLogout} navigation={navigation} />

      <View style={{ flex: 1 }}>
        <FlatList
          data={reservasFiltradas}
          renderItem={renderReserva}
          keyExtractor={(item) => item.id_reserva?.toString() || Math.random().toString()}
          contentContainerStyle={estilos.listContent}
          onRefresh={() => cargarReservas()}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* Hero Section */}
              <View style={estilos.heroSection}>
                <View>
                  <Text style={estilos.heroTitulo}>Gestión de Reservas</Text>
                  <Text style={estilos.heroSubtitulo}>
                    Visualiza y administra todas las reservas
                  </Text>
                </View>
                <View style={estilos.countBadge}>
                  <Text style={estilos.countText}>{reservasFiltradas.length}</Text>
                </View>
              </View>

              {/* Filtros en línea */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={estilos.filtrosContainer}
              >
                {estados.map((estado) => (
                  <TouchableOpacity
                    key={estado}
                    style={[
                      estilos.filtroBtn,
                      filtroEstado === estado && estilos.filtroBtnActivo,
                    ]}
                    onPress={() => setFiltroEstado(estado)}
                  >
                    <Text
                      style={[
                        estilos.filtroBtnTexto,
                        filtroEstado === estado && estilos.filtroBtnTextoActivo,
                      ]}
                    >
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </Text>
                    {filtroEstado === estado && (
                      <View
                        style={[
                          estilos.filtroBtnDot,
                          { backgroundColor: getEstadoColor(estado) },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Botón crear reserva */}
              <TouchableOpacity
                style={estilos.crearBtn}
                onPress={() => navigation.navigate('CrearReservaEmpleado')}
              >
                <MaterialCommunityIcons name="plus" size={20} color={COLORES.textoBlanco} />
                <Text style={estilos.crearBtnText}>Crear Nueva Reserva</Text>
              </TouchableOpacity>
            </>
          }
          ListEmptyComponent={
            <View style={estilos.emptyContainer}>
              <MaterialCommunityIcons
                name="calendar-blank"
                size={48}
                color={COLORES.textoMedio}
              />
              <Text style={estilos.emptyText}>
                No hay reservas{filtroEstado !== 'todas' ? ` ${filtroEstado}` : ''}
              </Text>
              <Text style={estilos.emptySubtext}>
                Las reservas aparecerán aquí
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  listContent: {
    padding: DIMENSIONES.padding,
  },
  heroSection: {
    backgroundColor: COLORES.fondoBlanco,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: DIMENSIONES.padding,
    marginHorizontal: 0,
    marginBottom: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
  },
  heroTitulo: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 4,
  },
  heroSubtitulo: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  countBadge: {
    backgroundColor: COLORES.primario + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
  },
  countText: {
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
    fontSize: TIPOGRAFIA.fontSizeDisplay,
  },
  filtrosContainer: {
    paddingVertical: DIMENSIONES.padding,
    paddingHorizontal: 0,
    gap: 8,
    marginBottom: DIMENSIONES.padding,
  },
  filtroBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: 20,
    backgroundColor: COLORES.fondoBlanco,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filtroBtnActivo: {
    backgroundColor: COLORES.primario + '15',
    borderColor: COLORES.primario,
  },
  filtroBtnTexto: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  filtroBtnTextoActivo: {
    color: COLORES.primario,
    fontWeight: TIPOGRAFIA.fontWeightBold,
  },
  filtroBtnDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  crearBtn: {
    backgroundColor: COLORES.exito,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    marginBottom: DIMENSIONES.padding,
  },
  crearBtnText: {
    color: COLORES.textoBlanco,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    fontSize: TIPOGRAFIA.fontSizeBase,
  },
  reservaCard: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    borderWidth: 1,
    borderColor: COLORES.borde,
    padding: DIMENSIONES.padding,
    marginBottom: 12,
  },
  reservaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clienteNombre: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 4,
  },
  clienteEmail: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightBold,
  },
  reservaDetalles: {
    gap: 8,
  },
  detalleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detalleTexto: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoOscuro,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
});

export default GestionReservasEmpleadoScreen;
