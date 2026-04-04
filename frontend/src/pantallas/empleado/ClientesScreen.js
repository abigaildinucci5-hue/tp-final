// frontend/src/pantallas/empleado/ClientesScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { ESTILOS_GLOBALES, DIMENSIONES, TIPOGRAFIA } from '../../constantes/estilos';
import NavbarEmpleado from '../../componentes/empleado/NavbarEmpleado';
import COLORES from '../../constantes/colores';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexto/AuthContext';
import usuariosService from '../../servicios/usuariosService';
import Loading from '../../componentes/comun/Loading';

const ClientesScreen = ({ navigation }) => {
  const { usuario, logout } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setLoading(true);
    try {
      // Llamar con parámetros: rol=cliente y activo=true
      const response = await usuariosService.getAll({ 
        rol: 'cliente',
        activo: 1  // Mostrar solo usuarios activos
      });
      
      console.log('📡 Respuesta completa de clientes:', response);
      
      let listaClientes = [];
      // Verificar en qué nivel vienen los datos
      if (response?.data?.usuarios) {
        listaClientes = response.data.usuarios;
      } else if (response?.usuarios) {
        listaClientes = response.usuarios;
      } else if (Array.isArray(response?.data)) {
        listaClientes = response.data;
      } else if (Array.isArray(response)) {
        listaClientes = response;
      }
      
      console.log('📋 Clientes filtrados:', listaClientes);
      
      // Asegurar que es un array
      if (!Array.isArray(listaClientes)) {
        listaClientes = [];
      }
      
      setClientes(listaClientes);
    } catch (error) {
      console.error('❌ Error cargando clientes:', error);
      Alert.alert('Error', error?.message || 'No se pudieron cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const renderCliente = ({ item }) => (
    <TouchableOpacity
      style={estilos.clienteCard}
      onPress={() => {
        Alert.alert(
          item.nombre,
          `Email: ${item.email}\nDescuento: 5%\nReservas: ${item.reservas_count || 0}`,
          [{ text: 'OK' }]
        );
      }}
      activeOpacity={0.7}
    >
      <View style={[estilos.avatar, { backgroundColor: COLORES.primario + '20' }]}>
        <Text style={[estilos.avatarTexto, { color: COLORES.primario }]}>
          {item.nombre?.[0]?.toUpperCase() || 'C'}
        </Text>
      </View>

      <View style={estilos.clienteInfo}>
        <Text style={estilos.nombre}>{item.nombre}</Text>
        <Text style={estilos.email}>{item.email}</Text>
        <View style={estilos.stats}>
          <View style={estilos.stat}>
            <MaterialCommunityIcons name="calendar-check" size={14} color={COLORES.textoMedio} />
            <Text style={estilos.statTexto}>{item.reservas_count || 0} reservas</Text>
          </View>
          <View style={estilos.stat}>
            <MaterialCommunityIcons name="percent" size={14} color={COLORES.primario} />
            <Text style={[estilos.statTexto, { color: COLORES.primario }]}>5% desc.</Text>
          </View>
        </View>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={24} color={COLORES.textoMedio} />
    </TouchableOpacity>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <NavbarEmpleado usuario={usuario} onLogout={handleLogout} navigation={navigation} />

      <View style={{ flex: 1 }}>
        <FlatList
          data={clientes}
          renderItem={renderCliente}
          keyExtractor={(item) => (item.id_usuario || item.id).toString()}
          contentContainerStyle={estilos.listContent}
          onRefresh={cargarClientes}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={estilos.heroSection}>
              <View>
                <Text style={estilos.heroTitulo}>Clientes</Text>
                <Text style={estilos.heroSubtitulo}>
                  Lista de todos los clientes registrados
                </Text>
              </View>
              <View style={estilos.countBadge}>
                <Text style={estilos.countText}>{clientes.length}</Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={estilos.emptyContainer}>
              <MaterialCommunityIcons
                name="account-multiple"
                size={48}
                color={COLORES.textoMedio}
              />
              <Text style={estilos.emptyText}>No hay clientes registrados</Text>
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
  clienteCard: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    borderWidth: 1,
    borderColor: COLORES.borde,
    padding: DIMENSIONES.padding,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTexto: {
    fontSize: TIPOGRAFIA.fontSizeDisplay,
    fontWeight: TIPOGRAFIA.fontWeightBold,
  },
  clienteInfo: {
    flex: 1,
  },
  nombre: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 2,
  },
  email: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    marginBottom: 6,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statTexto: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
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

export default ClientesScreen;
