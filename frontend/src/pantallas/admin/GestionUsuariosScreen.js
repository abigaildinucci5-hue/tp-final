import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import AdminDropdownMenu from '../../componentes/admin/AdminDropdownMenu';
import { useAuth } from '../../contexto/AuthContext';
import Loading from '../../componentes/comun/Loading';
import { formatearFecha } from '../../utils/dateFormatter';
import api from '../../servicios/api'; // ✅ usar api directamente
import { useFocusEffect } from '@react-navigation/native'; // ✅ para recargar al volver

const GestionUsuariosScreen = ({ navigation }) => {
  const { usuario: adminUsuario, logout } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Recargar al volver a esta pantalla
  useFocusEffect(
    React.useCallback(() => {
      cargarUsuarios();
    }, [])
  );

  const handleLogout = async () => {
    await logout();
  };

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      // ✅ Usar api directamente, el interceptor extrae .data
      // Backend devuelve { exito, data: [], paginacion }
      const response = await api.get('/usuarios');
      console.log('📱 Respuesta getAll():', response);

      let listaUsuarios = [];
      if (Array.isArray(response?.data)) {
        listaUsuarios = response.data;
      } else if (Array.isArray(response)) {
        listaUsuarios = response;
      }

      console.log('📱 Lista final:', listaUsuarios.length, 'usuarios');
      setUsuarios(listaUsuarios);
    } catch (error) {
      console.error('❌ Error al cargar usuarios:', error);
      Alert.alert('Error', 'No se pudieron cargar los usuarios: ' + (error.message || 'Error desconocido'));
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const getRolColor = (rol) => {
    switch (rol) {
      case 'admin':    return COLORES.error;
      case 'empleado': return COLORES.advertencia;
      case 'cliente':  return COLORES.exito;
      default:         return COLORES.primario;
    }
  };

  const obtenerIniciales = (nombre) => {
    if (!nombre) return '?';
    return nombre.split(' ').map((p) => p[0]).join('').substring(0, 2).toUpperCase();
  };

  const renderUsuario = ({ item }) => (
    <TouchableOpacity
      style={estilos.usuarioCard}
      onPress={() => navigation.navigate('DetalleUsuario', { usuario: item })}
      activeOpacity={0.7}
    >
      <View style={[estilos.avatar, { backgroundColor: getRolColor(item.rol) + '20' }]}>
        <Text style={[estilos.avatarTexto, { color: getRolColor(item.rol) }]}>
          {obtenerIniciales(item.nombre)}
        </Text>
      </View>

      <View style={estilos.usuarioInfo}>
        <View style={estilos.usuarioHeader}>
          <Text style={estilos.usuarioNombre}>{item.nombre}</Text>
          <View style={[estilos.statsButton, { backgroundColor: getRolColor(item.rol) + '15' }]}>
            <MaterialCommunityIcons name="calendar-check" size={14} color={getRolColor(item.rol)} />
            <Text style={[estilos.statsText, { color: getRolColor(item.rol) }]}>
              {item.reservas_count || 0}
            </Text>
          </View>
        </View>

        <Text style={estilos.usuarioEmail}>{item.email}</Text>

        <View style={estilos.rolAndDateContainer}>
          <View style={[estilos.rolBadge, { backgroundColor: getRolColor(item.rol) + '20' }]}>
            <Text style={[estilos.rolTexto, { color: getRolColor(item.rol) }]}>
              {item.rol?.charAt(0).toUpperCase() + (item.rol?.slice(1) || '')}
            </Text>
          </View>
          {item.fecha_registro && (
            <Text style={estilos.fechaTexto}>
              <MaterialCommunityIcons name="calendar" size={12} color={COLORES.textoMedio} />{' '}
              {formatearFecha(item.fecha_registro)}
            </Text>
          )}
        </View>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={24} color={COLORES.textoMedio} />
    </TouchableOpacity>
  );

  if (loading) return <Loading />;

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <AdminDropdownMenu usuario={adminUsuario} onLogout={handleLogout} navigation={navigation} />

      <View style={{ flex: 1 }}>
        <FlatList
          data={usuarios}
          renderItem={renderUsuario}
          keyExtractor={(item) => (item.id_usuario || item.id).toString()}
          contentContainerStyle={estilos.listContent}
          onRefresh={cargarUsuarios}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={estilos.heroSection}>
              <View>
                <Text style={estilos.heroTitulo}>Usuarios del Sistema</Text>
                <Text style={estilos.heroSubtitulo}>
                  Administra todos los usuarios registrados
                </Text>
              </View>
              <View style={estilos.countBadge}>
                <Text style={estilos.countText}>{usuarios.length}</Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={estilos.emptyContainer}>
              <MaterialCommunityIcons name="account-multiple" size={48} color={COLORES.textoMedio} />
              <Text style={estilos.emptyText}>No hay usuarios registrados</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  heroSection: {
    backgroundColor: COLORES.fondoBlanco,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: DIMENSIONES.padding,
    marginHorizontal: DIMENSIONES.padding,
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
  listContent: {
    paddingHorizontal: DIMENSIONES.padding,
    paddingBottom: DIMENSIONES.padding,
  },
  usuarioCard: {
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTexto: {
    fontWeight: TIPOGRAFIA.fontWeightBold,
    fontSize: TIPOGRAFIA.fontSizeMedium,
  },
  usuarioInfo: { flex: 1 },
  usuarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  usuarioNombre: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
  },
  statsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statsText: {
    fontSize: TIPOGRAFIA.fontSizeExtraSmall,
    fontWeight: TIPOGRAFIA.fontWeightBold,
  },
  usuarioEmail: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    marginBottom: 6,
  },
  rolAndDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rolBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  rolTexto: {
    fontSize: TIPOGRAFIA.fontSizeExtraSmall,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },
  fechaTexto: {
    fontSize: TIPOGRAFIA.fontSizeExtraSmall,
    color: COLORES.textoMedio,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    color: COLORES.textoMedio,
    marginTop: DIMENSIONES.padding,
  },
});

export default GestionUsuariosScreen;