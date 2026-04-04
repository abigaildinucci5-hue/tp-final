// frontend/src/pantallas/admin/GestionHabitacionesScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, Modal } from 'react-native'; 
import { useHabitaciones } from '../../hooks/useHabitaciones';
import AdminDropdownMenu from '../../componentes/admin/AdminDropdownMenu';
import ListaHabitaciones from '../../componentes/habitaciones/ListaHabitaciones';
import Boton from '../../componentes/comun/Boton';
import COLORES from '../../constantes/colores';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexto/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const GestionHabitacionesScreen = ({ navigation }) => {
  const { habitaciones, loading, cargarHabitaciones } = useHabitaciones();
  const { usuario, logout } = useAuth();

  // --- ESTADOS PARA EL CARTEL DE CONFIRMACIÓN ---
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

 useFocusEffect(
  React.useCallback(() => {
    cargarHabitaciones();
  }, [])
);

  // Esta es la función que vamos a pasarle al menú
  const abrirConfirmacionLogout = () => {
    setMostrarConfirmacion(true);
  };

  const confirmarLogout = async () => {
    setMostrarConfirmacion(false);
    await logout();
  };

  return (
    <View style={estilos.containerPrincipal}>
      {/* 1. HEADER: Le pasamos 'abrirConfirmacionLogout' en vez de 'logout' directamente */}
      <View style={estilos.headerContainer}>
        <AdminDropdownMenu 
          usuario={usuario} 
          onLogout={abrirConfirmacionLogout} 
          navigation={navigation} 
        />
      </View>

      {/* 2. CARTEL DE CONFIRMACIÓN (REEMPLAZO DE ALERT) */}
      <Modal
        visible={mostrarConfirmacion}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMostrarConfirmacion(false)}
      >
        <View style={estilos.overlay}>
          <View style={estilos.cartel}>
            <MaterialCommunityIcons name="logout" size={40} color={COLORES.primario} />
            <Text style={estilos.titulo}>¿Cerrar Sesión?</Text>
            <Text style={estilos.subtitulo}>¿Estás seguro de que deseas salir del panel de administración?</Text>
            
            <View style={estilos.filaBotones}>
              <TouchableOpacity 
                style={[estilos.botonModal, estilos.botonCancelar]} 
                onPress={() => setMostrarConfirmacion(false)}
              >
                <Text style={estilos.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[estilos.botonModal, estilos.botonAceptar]} 
                onPress={confirmarLogout}
              >
                <Text style={estilos.textoAceptar}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 3. LISTA */}
      <View style={estilos.listaContainer}>
        <ListaHabitaciones
          esAdmin={true}
          habitaciones={habitaciones}
          loading={loading}
          onHabitacionPress={(h) => navigation.navigate('EditarHabitacion', { habitacion: h })}
          onRefresh={cargarHabitaciones}
          refreshing={loading}
          ListHeaderComponent={
            <View style={estilos.heroSection}>
              <Text style={estilos.heroTitulo}>Gestión de Habitaciones</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  containerPrincipal: { 
    flex: 1, 
    backgroundColor: COLORES.fondo 
  },
  headerContainer: { 
    zIndex: 100, 
    width: '100%' 
  },
  // ESTILOS DEL CARTEL
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartel: {
    width: '85%',
    maxWidth: 380,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 20,
    
  },
  areaScroll: {
  flex: 1,
  // sin overflowY, sin height calc
},
  titulo: { fontSize: 20, fontWeight: 'bold', marginTop: 15, color: '#333' },
  subtitulo: { fontSize: 14, color: '#666', textAlign: 'center', marginVertical: 15, lineHeight: 20 },
  filaBotones: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 10 },
  botonModal: { flex: 1, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  botonCancelar: { backgroundColor: '#F0F0F0' },
  botonAceptar: { backgroundColor: COLORES.primario },
  textoCancelar: { color: '#666', fontWeight: '600' },
  textoAceptar: { color: '#FFF', fontWeight: 'bold' },

  listaContainer: { flex: 1 },
  heroSection: { padding: 20 },
  heroTitulo: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' }
});

export default GestionHabitacionesScreen;