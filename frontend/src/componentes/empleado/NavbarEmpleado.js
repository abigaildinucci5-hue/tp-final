// frontend/src/componentes/empleado/NavbarEmpleado.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import ModalConfirmacion from '../comun/ModalConfirmacion';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';

const NavbarEmpleado = ({ usuario, onLogout, navigation }) => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [confirmarLogout, setConfirmarLogout] = useState(false);

  const handleLogoutPress = () => {
    setMostrarMenu(false);
    setConfirmarLogout(true);
  };

  const procederLogout = async () => {
    setConfirmarLogout(false);
    if (onLogout) {
      try {
        await onLogout();
      } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
        Alert.alert('Error', 'No se pudo cerrar la sesión');
      }
    }
  };

  const MenuItem = ({ icono, label, onPress, isRojo = false }) => (
    <TouchableOpacity
      style={estilos.menuItem}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <MaterialCommunityIcons
        name={icono}
        size={20}
        color={isRojo ? COLORES.error : COLORES.textoMedio}
      />
      <Text style={[estilos.menuItemLabel, isRojo && { color: COLORES.error }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={estilos.container}>
      {/* NAVBAR SUPERIOR */}
      <View style={estilos.navbar}>
        <View style={estilos.logoSection}>
          <MaterialCommunityIcons
            name="moon-waning-crescent"
            size={24}
            color={COLORES.textoBlanco}
          />
          <Text style={estilos.hotelNombre}>Hotel Luna Serena</Text>
        </View>

        <TouchableOpacity
          style={estilos.botonUsuario}
          onPress={() => setMostrarMenu(!mostrarMenu)}
          activeOpacity={0.7}
        >
          <View style={[estilos.avatarContainer, { backgroundColor: COLORES.exito + '30' }]}>
            <Text style={estilos.avatarTexto}>
              {usuario?.nombre?.[0]?.toUpperCase() || 'E'}
            </Text>
          </View>
          <View style={estilos.userInfoSection}>
            <Text style={estilos.nombreUsuario} numberOfLines={1}>
              {usuario?.nombre || 'Empleado'}
            </Text>
            <Text style={estilos.rolUsuario}>Recepcionista</Text>
          </View>
          <MaterialCommunityIcons
            name={mostrarMenu ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={COLORES.textoBlanco}
          />
        </TouchableOpacity>
      </View>

      {/* DROPDOWN MENU */}
      {mostrarMenu && (
        <>
          <TouchableOpacity
            style={estilos.overlay}
            activeOpacity={1}
            onPress={() => setMostrarMenu(false)}
          />
          
          <View style={estilos.menuDropdown}>
            <View style={estilos.menuHeader}>
              <View style={[estilos.menuAvatar, { backgroundColor: COLORES.exito + '30' }]}>
                <Text style={estilos.menuAvatarTexto}>
                  {usuario?.nombre?.[0]?.toUpperCase() || 'E'}
                </Text>
              </View>
              <View style={estilos.menuHeaderInfo}>
                <Text style={estilos.menuNombre} numberOfLines={1}>
                  {usuario?.nombre || 'Empleado'}
                </Text>
                <Text style={estilos.menuEmail} numberOfLines={1}>
                  {usuario?.email || 'recepcion@hotel.com'}
                </Text>
              </View>
            </View>

            <ScrollView style={estilos.menuItems}>
              <MenuItem
                icono="home-outline"
                label="Dashboard"
                onPress={() => { setMostrarMenu(false); navigation?.navigate('DashboardEmpleado'); }}
              />
              <MenuItem
                icono="calendar-check-outline"
                label="Gestión Reservas"
                onPress={() => { setMostrarMenu(false); navigation?.navigate('GestionReservasEmpleado'); }}
              />
              <MenuItem
                icono="bed-outline"
                label="Gestión Habitaciones"
                onPress={() => { setMostrarMenu(false); navigation?.navigate('GestionHabitacionesEmpleado'); }}
              />
              <MenuItem
                icono="login"
                label="Check-in/Check-out"
                onPress={() => { setMostrarMenu(false); navigation?.navigate('CheckInOut'); }}
              />
              <MenuItem
                icono="account-outline"
                label="Mi Perfil"
                onPress={() => { setMostrarMenu(false); navigation?.navigate('PerfilEmpleado'); }}
              />

              <View style={estilos.menuDivisor} />

              <MenuItem
                icono="logout"
                label="Cerrar Sesión"
                isRojo
                onPress={handleLogoutPress}
              />
            </ScrollView>
          </View>
        </>
      )}

      <ModalConfirmacion
        visible={confirmarLogout}
        titulo="Cerrar sesión"
        mensaje="¿Querés cerrar sesión realmente?"
        iconName="logout"
        iconColor={COLORES.error}
        labelConfirmar="Salir"
        labelCancelar="Cancelar"
        variant="destructive"
        compact
        confirmButtonStyle={{ backgroundColor: COLORES.error }}
        cancelButtonStyle={{ backgroundColor: COLORES.blanco, borderColor: COLORES.borde }}
        cancelTextStyle={{ color: COLORES.textoOscuro }}
        onConfirmar={procederLogout}
        onCancelar={() => setConfirmarLogout(false)}
      />
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 100,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORES.negroElegante,
    paddingHorizontal: DIMENSIONES.padding,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    elevation: 5,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  hotelNombre: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoBlanco,
  },
  botonUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(201, 169, 97, 0.2)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(201, 169, 97, 0.4)',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTexto: {
    color: COLORES.textoBlanco,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    fontSize: TIPOGRAFIA.fontSizeSmall,
  },
  userInfoSection: {
    maxWidth: 100,
  },
  nombreUsuario: {
    fontSize: 12,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoBlanco,
  },
  rolUsuario: {
    fontSize: 10,
    color: COLORES.exito + '90',
    marginTop: 2,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999,
  },
  menuDropdown: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 75,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    width: 280,
    maxHeight: 450,
    zIndex: 1001,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde,
    backgroundColor: '#f9f9f9',
  },
  menuAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuAvatarTexto: {
    color: COLORES.exito,
    fontWeight: 'bold',
    fontSize: 18,
  },
  menuHeaderInfo: {
    flex: 1,
  },
  menuNombre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORES.textoOscuro,
  },
  menuEmail: {
    fontSize: 12,
    color: COLORES.textoMedio,
  },
  menuItems: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemLabel: {
    fontSize: 14,
    color: COLORES.textoOscuro,
    fontWeight: '600',
  },
  menuDivisor: {
    height: 1,
    backgroundColor: COLORES.borde,
    marginVertical: 6,
  },
});

export default NavbarEmpleado;