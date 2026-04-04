// frontend/src/pantallas/admin/DashboardScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import AdminDropdownMenu from '../../componentes/admin/AdminDropdownMenu';
import Card from '../../componentes/comun/Card';
import { useAuth } from '../../contexto/AuthContext';

const DashboardScreen = ({ navigation }) => {
  const { usuario, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  // Solo opciones principales, sin gestión de usuarios
  const menuOpciones = [
    {
      id: 'habitaciones',
      titulo: 'Gestión de Habitaciones',
      pantalla: 'GestionHabitaciones',
      icon: 'bed-king',
      color: COLORES.primario,
      descripcion: 'Ver, editar y crear habitaciones',
    },
    {
      id: 'reservas',
      titulo: 'Gestión de Reservas',
      pantalla: 'GestionReservas',
      icon: 'calendar-multiple-check',
      color: COLORES.exito,
      descripcion: 'Gestionar todas las reservas',
    },
    {
      id: 'estadisticas',
      titulo: 'Estadísticas',
      pantalla: 'Estadisticas',
      icon: 'chart-line',
      color: COLORES.error,
      descripcion: 'Ver reportes y análisis',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <AdminDropdownMenu usuario={usuario} onLogout={handleLogout} navigation={navigation} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: DIMENSIONES.padding }}>
        <View style={{ width: '100%', maxWidth: Platform.select({ web: 1200, default: 420 }) }}>
          {/* Hero */}
          <View style={estilos.heroSection}>
            <Text style={estilos.heroTitulo}>Panel de Administración</Text>
            <Text style={estilos.heroSubtitulo}>
              Bienvenido, administra tu hotel desde aquí
            </Text>
          </View>

          {/* Menú de Opciones */}
          <View style={estilos.menuContainer}>
            <Text style={estilos.seccionTitulo}>Gestión Principal</Text>
            {menuOpciones.map((opcion) => (
              <TouchableOpacity
                key={opcion.id}
                style={estilos.menuItem}
                onPress={() => navigation.navigate(opcion.pantalla)}
                activeOpacity={0.7}
              >
                <View style={[estilos.iconContainer, { backgroundColor: opcion.color + '15' }]}> 
                  <MaterialCommunityIcons
                    name={opcion.icon}
                    size={28}
                    color={opcion.color}
                  />
                </View>
                <View style={estilos.menuInfo}>
                  <Text style={estilos.menuTexto}>{opcion.titulo}</Text>
                  <Text style={estilos.menuDescripcion}>{opcion.descripcion}</Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={COLORES.textoMedio}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={estilos.quickActionsContainer}>
            <Text style={estilos.seccionTitulo}>Acciones Rápidas</Text>
            <View style={[estilos.quickActionsGrid, { flexWrap: 'wrap', justifyContent: 'center' }]}> 
              <TouchableOpacity
                style={estilos.quickAction}
                onPress={() => navigation.navigate('CrearHabitacion')}
              >
                <View style={[estilos.qaIcon, { backgroundColor: COLORES.primario + '20' }]}> 
                  <MaterialCommunityIcons
                    name="plus"
                    size={24}
                    color={COLORES.primario}
                  />
                </View>
                <Text style={estilos.qaText}>Nueva Habitación</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={estilos.quickAction}
                onPress={() => navigation.navigate('GestionReservas')}
              >
                <View style={[estilos.qaIcon, { backgroundColor: COLORES.exito + '20' }]}> 
                  <MaterialCommunityIcons
                    name="calendar-check"
                    size={24}
                    color={COLORES.exito}
                  />
                </View>
                <Text style={estilos.qaText}>Reservas Hoy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: DIMENSIONES.padding,
  },
  heroSection: {
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding * 1.5,
    marginHorizontal: DIMENSIONES.padding,
    marginTop: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    marginBottom: DIMENSIONES.padding * 1.5,
  },
  heroTitulo: {
    fontSize: TIPOGRAFIA.fontSizeDisplay,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 8,
  },
  heroSubtitulo: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    color: COLORES.textoMedio,
    lineHeight: 20,
  },
  menuContainer: {
    paddingHorizontal: DIMENSIONES.padding,
    marginBottom: DIMENSIONES.padding * 2,
  },
  seccionTitulo: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: DIMENSIONES.padding,
  },
  menuItem: {
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
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: DIMENSIONES.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuInfo: {
    flex: 1,
  },
  menuTexto: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
    marginBottom: 2,
  },
  menuDescripcion: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  quickActionsContainer: {
    paddingHorizontal: DIMENSIONES.padding,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: DIMENSIONES.padding,
  },
  quickAction: {
    flex: 1,
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    padding: DIMENSIONES.padding,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  qaIcon: {
    width: 50,
    height: 50,
    borderRadius: DIMENSIONES.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  qaText: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
    textAlign: 'center',
  },
});

export default DashboardScreen;