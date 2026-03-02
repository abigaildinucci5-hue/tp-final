// frontend/src/pantallas/admin/GestionUsuariosScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import usuariosService from '../../servicios/usuariosService';
import HeaderApp from '../../componentes/comun/HeaderApp';
import Loading from '../../componentes/comun/Loading';
import ErrorMensaje from '../../componentes/comun/ErrorMensaje';
import { formatearRol, obtenerIniciales } from '../../utils/formatters';

const GestionUsuariosScreen = ({ navigation }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await usuariosService.getAll();
      // El response puede tener formato { usuarios: [...] } o directamente array
      const usuariosData = response.data || response.usuarios || response;
      setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError(error.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await usuariosService.getAll();
      const usuariosData = response.data || response.usuarios || response;
      setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError(error.message || 'Error al cargar usuarios');
    } finally {
      setRefreshing(false);
    }
  };

  const renderUsuario = ({ item }) => (
    <TouchableOpacity
      style={estilos.usuarioCard}
      onPress={() => navigation.navigate('DetalleUsuario', { usuario: item })}
    >
      <View style={estilos.avatar}>
        <Text style={estilos.avatarTexto}>{obtenerIniciales(item.nombre || '')}</Text>
      </View>
      
      <View style={estilos.usuarioInfo}>
        <Text style={estilos.usuarioNombre}>{item.nombre || 'Sin nombre'}</Text>
        <Text style={estilos.usuarioEmail}>{item.email || 'Sin email'}</Text>
        <View style={estilos.rolBadge}>
          <Text style={estilos.rolTexto}>{formatearRol(item.rol)}</Text>
        </View>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={20} color={COLORES.textoMedio} />
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return <Loading />;
  }

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Gestión de Usuarios"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      {error && (
        <View style={estilos.errorContainer}>
          <ErrorMensaje mensaje={error} tipo="error" />
        </View>
      )}

      <FlatList
        data={usuarios}
        renderItem={renderUsuario}
        keyExtractor={(item) => (item.id_usuario || item.id || Math.random()).toString()}
        contentContainerStyle={estilos.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={estilos.emptyContainer}>
              <MaterialCommunityIcons name="account-multiple" size={48} color={COLORES.textoMedio} />
              <Text style={estilos.emptyTexto}>No hay usuarios</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const estilos = StyleSheet.create({
  listContent: {
    padding: DIMENSIONES.padding,
  },
  errorContainer: {
    padding: DIMENSIONES.padding,
  },
  usuarioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    marginBottom: 12,
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORES.primario,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTexto: {
    color: COLORES.fondoBlanco,
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
  },
  usuarioInfo: {
    flex: 1,
  },
  usuarioNombre: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
  },
  usuarioEmail: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    marginVertical: 4,
  },
  rolBadge: {
    backgroundColor: COLORES.primario,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  rolTexto: {
    color: COLORES.fondoBlanco,
    fontSize: 10,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTexto: {
    marginTop: 12,
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoMedio,
  },
});

export default GestionUsuariosScreen;