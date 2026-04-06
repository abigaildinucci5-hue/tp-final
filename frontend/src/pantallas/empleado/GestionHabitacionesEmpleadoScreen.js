// frontend/src/pantallas/empleado/GestionHabitacionesEmpleadoScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Modal, ScrollView } from 'react-native';
import { ESTILOS_GLOBALES, DIMENSIONES, TIPOGRAFIA } from '../../constantes/estilos';
import { useHabitaciones } from '../../hooks/useHabitaciones';
import NavbarEmpleado from '../../componentes/empleado/NavbarEmpleado';
import COLORES from '../../constantes/colores';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexto/AuthContext';
import habitacionesService from '../../servicios/habitacionesService';
import Boton from '../../componentes/comun/Boton';
import ModalConfirmacion from '../../componentes/comun/ModalConfirmacion';

const GestionHabitacionesEmpleadoScreen = ({ navigation }) => {
  const { usuario, logout } = useAuth();
  const { habitaciones, loading, cargarHabitaciones } = useHabitaciones();
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [modalVisible, setModalVisible] = useState(false);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);
  const [nuevoEstadoSeleccionado, setNuevoEstadoSeleccionado] = useState(null);
  const [actualizando, setActualizando] = useState(false);

  // ✅ Estados para ModalConfirmacion (reemplazan Alert)
  const [modalFeedback, setModalFeedback] = useState(null); // { tipo, titulo, mensaje }

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const habitacionesFiltradas =
    filtroEstado === 'todas'
      ? habitaciones
      : habitaciones.filter((h) => h.estado === filtroEstado);

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'disponible':   return 'check-circle';
      case 'ocupada':      return 'door-closed';
      case 'mantenimiento': return 'tools';
      case 'limpieza':     return 'broom';
      default:             return 'bed';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'disponible':   return COLORES.exito;
      case 'ocupada':      return COLORES.advertencia;
      case 'mantenimiento': return COLORES.error;
      case 'limpieza':     return COLORES.primario;
      default:             return COLORES.textoMedio;
    }
  };

  const abrirModalCambioEstado = (habitacion) => {
    setHabitacionSeleccionada(habitacion);
    setNuevoEstadoSeleccionado(habitacion.estado); // Inicializar con estado actual
    setModalVisible(true);
  };

  const confirmarCambioEstado = async () => {
    if (!habitacionSeleccionada || !nuevoEstadoSeleccionado) return;

    try {
      setActualizando(true);
      await habitacionesService.update(habitacionSeleccionada.id_habitacion, { estado: nuevoEstadoSeleccionado });
      setModalVisible(false);
      setNuevoEstadoSeleccionado(null);
      cargarHabitaciones();
      // ✅ Reemplaza Alert.alert('Éxito', ...)
      setModalFeedback({
        tipo: 'exito',
        titulo: 'Estado actualizado',
        mensaje: `La habitación ${habitacionSeleccionada.numero_habitacion} cambió a "${nuevoEstadoSeleccionado}"`,
      });
    } catch (error) {
      setModalVisible(false);
      // ✅ Reemplaza Alert.alert('Error', ...)
      setModalFeedback({
        tipo: 'error',
        titulo: 'Error',
        mensaje: 'No se pudo cambiar el estado: ' + error.message,
      });
    } finally {
      setActualizando(false);
    }
  };

  const cerrarModalCambioEstado = () => {
    setModalVisible(false);
    setNuevoEstadoSeleccionado(null);
  };

  // ✅ FIX: usa numero_habitacion (campo real del backend), no habitacion_numero ni numero
  const renderHabitacion = ({ item }) => (
    <TouchableOpacity
      style={estilos.habitacionCard}
      onPress={() => abrirModalCambioEstado(item)}
      activeOpacity={0.7}
    >
      <View style={[estilos.numeroBadge, { backgroundColor: getEstadoColor(item.estado) + '20' }]}>
        <Text style={[estilos.numeroTexto, { color: getEstadoColor(item.estado) }]}>
          {item.numero_habitacion}
        </Text>
      </View>

      <View style={estilos.habitacionInfo}>
        <Text style={estilos.tipoHabitacion}>{item.tipo_habitacion || 'Estándar'}</Text>
        <View style={estilos.detalles}>
          <View style={estilos.detalleItem}>
            <MaterialCommunityIcons name="bed" size={14} color={COLORES.textoMedio} />
            <Text style={estilos.detalleTexto}>{item.capacidad_personas || 2} huespedes</Text>
          </View>
          <View style={estilos.detalleItem}>
            <MaterialCommunityIcons name="cash" size={14} color={COLORES.textoMedio} />
            {/* ✅ FIX: usa precio_base (campo real del backend) y serializa como número */}
            <Text style={estilos.detalleTexto}>${Number(item.precio_base ?? 0).toFixed(2)}/noche</Text>
          </View>
        </View>
      </View>

      <View style={[estilos.estadoBadge, { backgroundColor: getEstadoColor(item.estado) + '20' }]}>
        <MaterialCommunityIcons name={getEstadoIcon(item.estado)} size={24} color={getEstadoColor(item.estado)} />
        <Text style={[estilos.estadoLabel, { color: getEstadoColor(item.estado) }]}>
          {item.estado?.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const estados = ['todas', 'disponible', 'ocupada', 'limpieza', 'mantenimiento'];
  const estadosCambio = ['disponible', 'ocupada', 'limpieza', 'mantenimiento'];

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <NavbarEmpleado usuario={usuario} onLogout={handleLogout} navigation={navigation} />

      <View style={{ flex: 1 }}>
        <FlatList
          data={habitacionesFiltradas}
          renderItem={renderHabitacion}
          // ✅ FIX: keyExtractor usa id_habitacion únicamente
          keyExtractor={(item) => item.id_habitacion?.toString()}
          numColumns={2}
          columnWrapperStyle={estilos.columnWrapper}
          contentContainerStyle={estilos.listContent}
          onRefresh={() => cargarHabitaciones()}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <View style={[estilos.heroSection, { marginHorizontal: -DIMENSIONES.padding }]}>
                <View>
                  <Text style={estilos.heroTitulo}>Gestión de Habitaciones</Text>
                  <Text style={estilos.heroSubtitulo}>
                    Estado actual de todas las habitaciones
                  </Text>
                </View>
                <View style={estilos.countBadge}>
                  {/* ✅ FIX: muestra habitacionesFiltradas.length correctamente 
                      porque ahora renderHabitacion no falla y la lista se llena */}
                  <Text style={estilos.countText}>{habitacionesFiltradas.length}</Text>
                </View>
              </View>

              <View style={estilos.filtrosContainer}>
                {estados.map((estado) => (
                  <TouchableOpacity
                    key={estado}
                    style={[
                      estilos.filtroTab,
                      filtroEstado === estado && estilos.filtroTabActivo,
                    ]}
                    onPress={() => setFiltroEstado(estado)}
                  >
                    <Text
                      style={[
                        estilos.filtroText,
                        filtroEstado === estado && estilos.filtroTextActivo,
                      ]}
                    >
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={estilos.emptyContainer}>
              <MaterialCommunityIcons
                name="bed-empty"
                size={48}
                color={COLORES.textoMedio}
              />
              <Text style={estilos.emptyText}>
                No hay habitaciones {filtroEstado !== 'todas' ? filtroEstado : ''}
              </Text>
            </View>
          }
        />
      </View>

      {/* Modal para cambiar estado - Centrado y con botones claros */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={cerrarModalCambioEstado}
      >
        <View style={estilosModal.overlay}>
          <View style={estilosModal.container}>
            <Text style={estilosModal.titulo}>
              Cambiar Estado - Habitación {habitacionSeleccionada?.numero_habitacion}
            </Text>

            <ScrollView style={estilosModal.contenido} showsVerticalScrollIndicator={false}>
              <Text style={estilosModal.labelEstado}>Selecciona el nuevo estado:</Text>

              {estadosCambio.map((estado) => (
                <TouchableOpacity
                  key={estado}
                  style={[
                    estilosModal.estadoOpcion,
                    nuevoEstadoSeleccionado === estado && estilosModal.estadoOpcionActivo,
                  ]}
                  onPress={() => setNuevoEstadoSeleccionado(estado)}
                  disabled={actualizando}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                    <View style={[estilosModal.estadoIcono, { backgroundColor: getEstadoColor(estado) + '20' }]}>
                      <MaterialCommunityIcons
                        name={getEstadoIcon(estado)}
                        size={20}
                        color={getEstadoColor(estado)}
                      />
                    </View>
                    <Text style={estilosModal.estadoTexto}>
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </Text>
                  </View>
                  {nuevoEstadoSeleccionado === estado && !actualizando && (
                    <MaterialCommunityIcons name="check-circle" size={24} color={COLORES.primario} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={estilosModal.footer}>
              <View style={estilosModal.botonesContainer}>
                <Boton
                  titulo="Cancelar"
                  onPress={cerrarModalCambioEstado}
                  tipo="secundario"
                  tamaño="mediano"
                  disabled={actualizando}
                  fullWidth
                />
                <Boton
                  titulo={actualizando ? "Cambiando..." : "Confirmar"}
                  onPress={confirmarCambioEstado}
                  tipo="primario"
                  tamaño="mediano"
                  disabled={actualizando}
                  loading={actualizando}
                  fullWidth
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ✅ ModalConfirmacion para feedback de éxito/error (reemplaza Alert) */}
      {modalFeedback && (
        <ModalConfirmacion
          visible={!!modalFeedback}
          titulo={modalFeedback.titulo}
          mensaje={modalFeedback.mensaje}
          iconName={modalFeedback.tipo === 'exito' ? 'check-circle' : 'alert-circle'}
          iconColor={modalFeedback.tipo === 'exito' ? COLORES.exito : COLORES.error}
          labelConfirmar="OK"
          labelCancelar=""
          onConfirmar={() => setModalFeedback(null)}
          onCancelar={() => setModalFeedback(null)}
        />
      )}
    </View>
  );
};

const estilosModal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: 16,
    maxHeight: '80%',
    width: '88%',
    maxWidth: 420,
    paddingVertical: 24,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  titulo: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    textAlign: 'center',
    marginBottom: 20,
  },
  contenido: {
    maxHeight: 300,
    marginBottom: 16,
  },
  labelEstado: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightSemibold,
    color: COLORES.textoOscuro,
    marginBottom: 12,
  },
  estadoOpcion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORES.borde,
    marginBottom: 10,
    backgroundColor: COLORES.fondoBlanco,
  },
  estadoOpcionActivo: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario + '12',
  },
  estadoIcono: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  estadoTexto: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightSemibold,
    color: COLORES.textoOscuro,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
    paddingTop: 16,
  },
  botonesContainer: {
    gap: 12,
  },
});

const estilos = StyleSheet.create({
  listContent: {
    padding: DIMENSIONES.padding,
  },
  columnWrapper: {
    gap: 12,
  },
  heroSection: {
    backgroundColor: COLORES.fondoBlanco,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: DIMENSIONES.padding,
    marginBottom: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
  },
  heroTitulo: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
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
  },
  countText: {
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
  },
  filtrosContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: DIMENSIONES.padding,
    justifyContent: 'space-between',
  },
  filtroTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORES.borde,
    alignItems: 'center',
  },
  filtroTabActivo: {
    backgroundColor: COLORES.primario,
  },
  filtroText: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  filtroTextActivo: {
    color: COLORES.textoBlanco,
    fontWeight: TIPOGRAFIA.fontWeightBold,
  },
  habitacionCard: {
    flex: 1,
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    borderWidth: 1,
    borderColor: COLORES.borde,
    padding: 12,
  },
  numeroBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  numeroTexto: {
    fontSize: TIPOGRAFIA.fontSizeDisplay,
    fontWeight: TIPOGRAFIA.fontWeightBold,
  },
  habitacionInfo: {
    marginBottom: 12,
  },
  tipoHabitacion: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 4,
  },
  detalles: {
    gap: 4,
  },
  detalleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detalleTexto: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  estadoBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  estadoLabel: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightBold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoMedio,
    marginTop: 12,
  },
});

export default GestionHabitacionesEmpleadoScreen;