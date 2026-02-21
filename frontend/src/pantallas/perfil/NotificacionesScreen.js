// frontend/src/pantallas/perfil/NotificacionesScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA } from '../../constantes/estilos';
import HeaderApp from '../../componentes/comun/HeaderApp';

const NotificacionesScreen = ({ navigation }) => {
  // Notificaciones deshabilitadas - Pantalla vacía informativa
  return (
    <View style={estilos.container}>
      <HeaderApp 
        title="Notificaciones" 
        navigation={navigation}
        showNavigation={false}
      />
      <View style={estilos.emptyContainer}>
        <MaterialCommunityIcons name="bell-off-outline" size={80} color={COLORES.textoClaro} />
        <Text style={estilos.emptyText}>Notificaciones deshabilitadas</Text>
        <Text style={estilos.emptySubtext}>
          Las notificaciones no están disponibles en esta versión de la aplicación
        </Text>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORES.fondoClaro,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: TIPOGRAFIA.body?.fontSize || 16,
    fontWeight: '600',
    color: COLORES.textoOscuro,
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: TIPOGRAFIA.small?.fontSize || 14,
    color: COLORES.textoClaro,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default NotificacionesScreen;
