// frontend/src/pantallas/admin/GestionUsuariosScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import usuariosService from '../../servicios/usuariosService';
import HeaderApp from '../../componentes/comun/HeaderApp';
import Loading from '../../componentes/comun/Loading';
import { formatearRol, obtenerIniciales } from '../../utils/formatters';

const GestionUsuariosScreen = ({ navigation }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await usuariosService.getAll();
      setUsuarios(response.usuarios || response);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderUsuario = ({ item }) => (
    <TouchableOpacity
      style={estilos.usuarioCard}
      onPress={() => navigation.navigate('DetalleUsuario', { usuario: item })}
    >
      <View style={estilos.avatar}>
        <Text style={estilos.avatarTexto}>{obtenerIniciales(item.nombre)}</Text>
      </View>
      
      <View style={estilos.usuarioInfo}>
        <Text style={estilos.usuarioNombre}>{item.nombre}</Text>
        <Text style={estilos.usuarioEmail}>{item.email}</Text>
        <View style={estilos.rolBadge}>
          <Text style={estilos.rolTexto}>{formatearRol(item.rol)}</Text>
        </View>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={20} color={COLORES.textoMedio} />
    </TouchableOpacity>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Gestión de Usuarios"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      <FlatList
        data={usuarios}
        renderItem={renderUsuario}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={estilos.listContent}
        onRefresh={cargarUsuarios}
        refreshing={loading}
      />
    </View>
  );
};

const estilos = StyleSheet.create({
  listContent: {
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
    color: COLORES.textoBlanco,
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
    marginBottom: 2,
  },
  usuarioEmail: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    marginBottom: 6,
  },
  rolBadge: {
    backgroundColor: COLORES.primario + '20',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  rolTexto: {
    fontSize: TIPOGRAFIA.fontSizeExtraSmall,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.primario,
  },
});

export default GestionUsuariosScreen;