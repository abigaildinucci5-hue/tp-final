// frontend/src/pantallas/admin/DetalleUsuarioScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import HeaderApp from '../../componentes/comun/HeaderApp';
import Boton from '../../componentes/comun/Boton';
import usuariosService from '../../servicios/usuariosService';
import reservasService from '../../servicios/reservasService';
import { formatearFecha } from '../../utils/dateFormatter';

const DetalleUsuarioScreen = ({ navigation, route }) => {
  const { usuario } = route.params;
  const [loading, setLoading] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(true);

  useEffect(() => {
    cargarReservasUsuario();
  }, []);

  const cargarReservasUsuario = async () => {
    try {
      setLoadingReservas(true);
      // Intentar cargar las reservas del usuario
      // Si existe un endpoint específico, usarlo
      const respuesta = await reservasService.listar({ id_usuario: usuario.id_usuario });
      setReservas(respuesta || []);
    } catch (error) {
      console.log('No se pudieron cargar las reservas:', error.message);
      setReservas([]);
    } finally {
      setLoadingReservas(false);
    }
  };

  const handleEliminarUsuario = () => {
    Alert.alert(
      'Eliminar Usuario',
      `¿Estás seguro de que deseas eliminar a ${usuario.nombre}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await usuariosService.delete(usuario.id_usuario);
              Alert.alert('Éxito', 'Usuario eliminado', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar: ' + error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCambiarRol = () => {
    const nuevosRoles = usuario.rol === 'cliente' ? ['empleado', 'admin'] : 
                       usuario.rol === 'empleado' ? ['cliente', 'admin'] :
                       ['cliente', 'empleado'];

    Alert.alert(
      'Cambiar Rol',
      `Rol actual: ${usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        ...nuevosRoles.map((rol) => ({
          text: rol.charAt(0).toUpperCase() + rol.slice(1),
          onPress: async () => {
            try {
              setLoading(true);
              await usuariosService.updateRole(usuario.id_usuario, rol);
              Alert.alert('Éxito', 'Rol actualizado', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert('Error', 'No se pudo cambiar el rol: ' + error.message);
            } finally {
              setLoading(false);
            }
          },
        })),
      ]
    );
  };

  const tiempoDesdeRegistro = () => {
    const fecha = new Date(usuario.fecha_creacion);
    const ahora = new Date();
    const diferencia = Math.floor((ahora - fecha) / (1000 * 60 * 60 * 24));
    
    if (diferencia === 0) return 'Hoy';
    if (diferencia === 1) return 'Hace 1 día';
    if (diferencia < 7) return `Hace ${diferencia} días`;
    if (diferencia < 30) return `Hace ${Math.floor(diferencia / 7)} semanas`;
    return `Hace ${Math.floor(diferencia / 30)} meses`;
  };

  const getRolColor = (rol) => {
    switch (rol) {
      case 'admin':
        return COLORES.error;
      case 'empleado':
        return COLORES.advertencia;
      case 'cliente':
        return COLORES.exito;
      default:
        return COLORES.primario;
    }
  };

  const renderReserva = ({ item }) => (
    <TouchableOpacity style={estilos.reservaCard}>
      <View style={estilos.reservaHeader}>
        <Text style={estilos.reservaNumero}>Reserva #{item.id_reserva}</Text>
        <View style={[estilos.estadoBadge, { backgroundColor: item.estado === 'confirmada' ? COLORES.exito : COLORES.advertencia }]}>
          <Text style={estilos.estadoBadgeTexto}>
            {item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}
          </Text>
        </View>
      </View>
      <View style={estilos.reservaInfo}>
        <Text style={estilos.reservaFechas}>
          {formatearFecha(item.fecha_entrada)} → {formatearFecha(item.fecha_salida)}
        </Text>
        <Text style={estilos.reservaPrecio}>
          ${parseFloat(item.precio_total).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Detalle de Usuario"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      {loading ? (
        <ActivityIndicator size="large" color={COLORES.primario} style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={{ flex: 1 }} scrollEnabled={true} nestedScrollEnabled={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: DIMENSIONES.padding, paddingVertical: DIMENSIONES.padding }}>
          {/* Información Básica */}
          <View style={estilos.section}>
            <View style={estilos.profileHeader}>
              <View style={estilos.avatar}>
                <Text style={estilos.avatarTexto}>
                  {usuario.nombre?.[0]?.toUpperCase()}
                </Text>
              </View>
              <View style={estilos.profileInfo}>
                <Text style={estilos.nombreUsuario}>
                  {usuario.nombre} {usuario.apellido}
                </Text>
                <View style={[estilos.rolBadge, { backgroundColor: getRolColor(usuario.rol) + '20' }]}>
                  <Text style={[estilos.rolTexto, { color: getRolColor(usuario.rol) }]}>
                    {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Contacto */}
          <View style={estilos.section}>
            <Text style={estilos.sectionTitle}>Contacto</Text>
            <View style={estilos.card}>
              <View style={estilos.infoRow}>
                <MaterialCommunityIcons
                  name="email"
                  size={20}
                  color={COLORES.primario}
                />
                <View>
                  <Text style={estilos.infoLabel}>Email</Text>
                  <Text style={estilos.infoValue}>{usuario.email}</Text>
                </View>
              </View>
              {usuario.telefono && (
                <View style={estilos.infoRow}>
                  <MaterialCommunityIcons
                    name="phone"
                    size={20}
                    color={COLORES.primario}
                  />
                  <View>
                    <Text style={estilos.infoLabel}>Teléfono</Text>
                    <Text style={estilos.infoValue}>{usuario.telefono}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Estadísticas */}
          <View style={estilos.section}>
            <Text style={estilos.sectionTitle}>Información</Text>
            <View style={estilos.statsContainer}>
              <View style={estilos.statCard}>
                <Text style={estilos.statValor}>{reservas.length}</Text>
                <Text style={estilos.statLabel}>Reservas</Text>
              </View>
              <View style={estilos.statCard}>
                <Text style={estilos.statValor}>{tiempoDesdeRegistro()}</Text>
                <Text style={estilos.statLabel}>En el hotel</Text>
              </View>
            </View>
            <View style={[estilos.card, { marginTop: DIMENSIONES.padding }]}>
              <View style={estilos.infoRow}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color={COLORES.textoMedio}
                />
                <View>
                  <Text style={estilos.infoLabel}>Se unió</Text>
                  <Text style={estilos.infoValue}>
                    {formatearFecha(usuario.fecha_creacion)}
                  </Text>
                </View>
              </View>
              <View style={[estilos.infoRow, { marginTop: DIMENSIONES.padding }]}>
                <MaterialCommunityIcons
                  name={usuario.activo ? 'account-check' : 'account-off'}
                  size={20}
                  color={usuario.activo ? COLORES.exito : COLORES.error}
                />
                <View>
                  <Text style={estilos.infoLabel}>Estado</Text>
                  <Text style={estilos.infoValue}>
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Historial de Reservas */}
          <View style={estilos.section}>
            <Text style={estilos.sectionTitle}>Historial de Reservas</Text>
            {loadingReservas ? (
              <ActivityIndicator size="small" color={COLORES.primario} />
            ) : reservas.length > 0 ? (
              <FlatList
                data={reservas}
                renderItem={renderReserva}
                keyExtractor={(item) => item.id_reserva.toString()}
                scrollEnabled={false}
                contentContainerStyle={{ gap: 8 }}
              />
            ) : (
              <View style={estilos.sinDatos}>
                <MaterialCommunityIcons
                  name="calendar-blank"
                  size={40}
                  color={COLORES.textoMedio}
                />
                <Text style={estilos.sinDatosTexto}>Sin reservas</Text>
              </View>
            )}
          </View>

          {/* Acciones */}
          <View style={estilos.section}>
            <Text style={estilos.sectionTitle}>Acciones</Text>
            
            <Boton
              onPress={handleCambiarRol}
              fullWidth
              style={estilos.btnRol}
            >
              <MaterialCommunityIcons name="shield-account" size={20} color={COLORES.textoBlanco} />
              <Text style={estilos.btnTexto}>Cambiar Rol</Text>
            </Boton>

            <Boton
              onPress={handleEliminarUsuario}
              fullWidth
              variant="destructive"
              style={estilos.btnEliminar}
            >
              <MaterialCommunityIcons name="delete" size={20} color={COLORES.textoBlanco} />
              <Text style={estilos.btnTexto}>Eliminar Usuario</Text>
            </Boton>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  scrollContent: {
    paddingVertical: DIMENSIONES.padding,
  },
  section: {
    marginBottom: DIMENSIONES.padding * 1.5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DIMENSIONES.padding,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORES.primario,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTexto: {
    fontSize: TIPOGRAFIA.fontSizeDisplay,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoBlanco,
  },
  profileInfo: {
    flex: 1,
  },
  nombreUsuario: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 6,
  },
  rolBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rolTexto: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },
  sectionTitle: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: DIMENSIONES.padding,
  },
  card: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    padding: DIMENSIONES.padding,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabel: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: DIMENSIONES.padding,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    padding: DIMENSIONES.padding,
    borderWidth: 1,
    borderColor: COLORES.borde,
    alignItems: 'center',
  },
  statValor: {
    fontSize: TIPOGRAFIA.fontSizeDisplay,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    textAlign: 'center',
  },
  reservaCard: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    padding: DIMENSIONES.padding,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  reservaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reservaNumero: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoBadgeTexto: {
    fontSize: TIPOGRAFIA.fontSizeExtraSmall,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoBlanco,
  },
  reservaInfo: {
    gap: 4,
  },
  reservaFechas: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  reservaPrecio: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
  },
  sinDatos: {
    alignItems: 'center',
    paddingVertical: DIMENSIONES.padding * 2,
  },
  sinDatosTexto: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    color: COLORES.textoMedio,
    marginTop: DIMENSIONES.padding,
  },
  btnRol: {
    marginBottom: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  btnEliminar: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  btnTexto: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoBlanco,
  },
});

export default DetalleUsuarioScreen;
