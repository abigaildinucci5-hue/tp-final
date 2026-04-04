// frontend/src/componentes/admin/AdminDropdownMenu.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';

const AdminDropdownMenu = ({ usuario, onLogout, navigation }) => {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  // AHORA: El menú solo cierra el dropdown y dispara la prop onLogout.
  // La pantalla (el padre) será la encargada de mostrar el cartel lindo.
  const handleLogoutPress = () => {
    setMostrarMenu(false);
    if (onLogout) onLogout(); 
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
          <View style={[estilos.avatarContainer, { backgroundColor: COLORES.error + '30' }]}>
            <Text style={estilos.avatarTexto}>
              {usuario?.nombre?.[0]?.toUpperCase() || 'A'}
            </Text>
          </View>
          <View style={estilos.userInfoSection}>
            <Text style={estilos.nombreUsuario} numberOfLines={1}>
              {usuario?.nombre || 'Admin'}
            </Text>
            <Text style={estilos.rolUsuario}>Administrador</Text>
          </View>
          <MaterialCommunityIcons
            name={mostrarMenu ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={COLORES.textoBlanco}
          />
        </TouchableOpacity>
      </View>

      {mostrarMenu && (
        <Modal
          visible={mostrarMenu}
          transparent={true}
          animationType="none"
          onRequestClose={() => setMostrarMenu(false)}
        >
          <TouchableOpacity
            style={estilos.overlayFull}
            onPress={() => setMostrarMenu(false)}
            activeOpacity={1}
          >
            <View style={estilos.menuDropdownContainer}>
              <View style={estilos.menuDropdown}>
                <View style={estilos.menuHeader}>
                  <View style={[estilos.menuAvatar, { backgroundColor: COLORES.error + '30' }]}>
                    <Text style={estilos.menuAvatarTexto}>
                      {usuario?.nombre?.[0]?.toUpperCase() || 'A'}
                    </Text>
                  </View>
                  <View style={estilos.menuHeaderInfo}>
                    <Text style={estilos.menuNombre} numberOfLines={1}>
                      {usuario?.nombre || 'Administrador'}
                    </Text>
                    <Text style={estilos.menuEmail} numberOfLines={1}>
                      {usuario?.email || 'admin@hotel.com'}
                    </Text>
                  </View>
                </View>

                <ScrollView style={estilos.menuItems} bounces={false}>
                  <MenuItem
                    icono="home-outline"
                    label="Dashboard"
                    onPress={() => { setMostrarMenu(false); navigation?.navigate('Dashboard'); }}
                  />
                  <MenuItem
                    icono="bed-outline"
                    label="Gestión Habitaciones"
                    onPress={() => { setMostrarMenu(false); navigation?.navigate('GestionHabitaciones'); }}
                  />
                  <MenuItem
                    icono="calendar-check-outline"
                    label="Gestión Reservas"
                    onPress={() => { setMostrarMenu(false); navigation?.navigate('GestionReservas'); }}
                  />
                  <MenuItem
                    icono="chart-line"
                    label="Estadísticas"
                    onPress={() => { setMostrarMenu(false); navigation?.navigate('Estadisticas'); }}
                  />
                  <View style={estilos.menuDivisor} />
                  <MenuItem
                    icono="logout"
                    label="Cerrar Sesión"
                    isRojo
                    onPress={handleLogoutPress} // USAMOS LA NUEVA FUNCIÓN
                  />
                </ScrollView>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

// ... los estilos se mantienen igual a como los tenías ...
const estilos = StyleSheet.create({
  container: { zIndex: 1000, width: '100%', pointerEvents: 'box-none', },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: DIMENSIONES.padding,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    elevation: 5,
  },
  logoSection: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  hotelNombre: { fontSize: TIPOGRAFIA.fontSizeMedium, fontWeight: TIPOGRAFIA.fontWeightBold, color: COLORES.textoBlanco },
  botonUsuario: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(231, 76, 60, 0.15)', borderRadius: 12 },
  avatarContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  avatarTexto: { color: COLORES.textoBlanco, fontWeight: TIPOGRAFIA.fontWeightBold, fontSize: TIPOGRAFIA.fontSizeSmall },
  userInfoSection: { maxWidth: 100 },
  nombreUsuario: { fontSize: 12, fontWeight: TIPOGRAFIA.fontWeightSemiBold, color: COLORES.textoBlanco },
  rolUsuario: { fontSize: 10, color: COLORES.error + '90', marginTop: 2 },
  overlayFull: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.select({ web: 70, ios: 60, android: 20 }),
    paddingRight: 16,
  },
  menuDropdownContainer: { width: '100%', maxWidth: 320, alignItems: 'flex-end' },
  menuDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    maxHeight: 450,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 10 },
      web: { boxShadow: '0px 8px 16px rgba(0,0,0,0.2)' }
    }),
  },
  menuHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: DIMENSIONES.padding, borderBottomWidth: 1, borderBottomColor: COLORES.borde, backgroundColor: '#FFFFFF' },
  menuAvatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  menuAvatarTexto: { color: COLORES.error, fontWeight: TIPOGRAFIA.fontWeightBold, fontSize: TIPOGRAFIA.fontSizeMedium },
  menuHeaderInfo: { flex: 1 },
  menuNombre: { fontSize: 13, fontWeight: TIPOGRAFIA.fontWeightBold, color: COLORES.textoOscuro, marginBottom: 2 },
  menuEmail: { fontSize: 11, color: COLORES.textoMedio },
  menuItems: { paddingVertical: 8, backgroundColor: '#FFFFFF' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: DIMENSIONES.padding, paddingVertical: 12 },
  menuItemLabel: { fontSize: 14, color: COLORES.textoOscuro, fontWeight: TIPOGRAFIA.fontWeightSemiBold },
  menuDivisor: { height: 1, backgroundColor: COLORES.borde, marginVertical: 6 },
});

export default AdminDropdownMenu;