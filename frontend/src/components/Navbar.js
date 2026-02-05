/**
 * NAVBAR COMPONENT - HOTEL LUNA SERENA
 * Header con logo, navegación y perfil de usuario
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORES, TIPOGRAFIA, ESPACIADO, BORDER_RADIUS, SOMBRAS } from '../constants/colores';

const { width } = Dimensions.get('window');

/**
 * Hook para simular autenticación (se reemplazará con Redux)
 */
const useUsuario = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const usuario = {
    nombre: 'Juan',
    rol: 'Huésped',
    fotoPerfil: 'https://via.placeholder.com/40',
    email: 'juan@example.com',
  };
  return { isAuthenticated, usuario, setIsAuthenticated };
};

const Navbar = ({ navigation }) => {
  const { isAuthenticated, usuario, setIsAuthenticated } = useUsuario();
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setMostrarMenuUsuario(false);
  };

  const navigateTo = (screen) => {
    if (navigation) {
      navigation.navigate(screen);
    }
    setMostrarMenuUsuario(false);
  };

  return (
    <>
      <View style={styles.navbar}>
        {/* SECCIÓN IZQUIERDA: Logo */}
        <View style={styles.seccionIzquierda}>
          <Image
            source={require('../assets/logo-blanco.png')}
            style={styles.logo}
            defaultSource={require('../assets/logo-placeholder.png')}
          />
          <View style={styles.hotelInfo}>
            <Text style={styles.hotelNombre}>Hotel Luna Serena</Text>
            <Text style={styles.hotelIcon}>🌙</Text>
          </View>
        </View>

        {/* SECCIÓN CENTRO: Navegación */}
        {width > 600 && (
          <View style={styles.seccionCentro}>
            <NavLink
              label="Home"
              icono="home-outline"
              onPress={() => navigateTo('Home')}
            />
            <NavLink
              label="Habitaciones"
              icono="bed-outline"
              onPress={() => navigateTo('Habitaciones')}
            />
            <NavLink
              label="Reservas"
              icono="calendar-outline"
              onPress={() => navigateTo('Reservas')}
            />
          </View>
        )}

        {/* SECCIÓN DERECHA: Usuario o Login */}
        <View style={styles.seccionDerecha}>
          {isAuthenticated ? (
            <TouchableOpacity
              style={styles.botonUsuario}
              onPress={() => setMostrarMenuUsuario(!mostrarMenuUsuario)}
            >
              <Image
                source={{ uri: usuario.fotoPerfil }}
                style={styles.fotoPerfil}
              />
              {width > 480 && (
                <View style={styles.datosUsuario}>
                  <Text style={styles.nombreUsuario}>{usuario.nombre}</Text>
                  <Text style={styles.rolUsuario}>{usuario.rol}</Text>
                </View>
              )}
              <Ionicons
                name={mostrarMenuUsuario ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORES.SECUNDARIO}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.botonLogin}
              onPress={() => navigateTo('Login')}
            >
              <Ionicons name="person-circle-outline" size={28} color={COLORES.SECUNDARIO} />
              {width > 480 && <Text style={styles.textoLogin}>Iniciar Sesión</Text>}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* MENÚ DESPLEGABLE DE USUARIO */}
      <Modal
        visible={mostrarMenuUsuario}
        transparent
        animationType="fade"
        onRequestClose={() => setMostrarMenuUsuario(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setMostrarMenuUsuario(false)}
        >
          <View style={styles.menuDropdown}>
            <View style={styles.menuHeader}>
              <Image
                source={{ uri: usuario.fotoPerfil }}
                style={styles.fotoPerfil}
              />
              <View style={styles.menuHeaderInfo}>
                <Text style={styles.menuNombre}>{usuario.nombre}</Text>
                <Text style={styles.menuEmail}>{usuario.email}</Text>
              </View>
            </View>

            <ScrollView style={styles.menuItems}>
              <MenuItem
                icono="person-outline"
                label="Mi Perfil"
                onPress={() => navigateTo('Profile')}
              />
              <MenuItem
                icono="bookmark-outline"
                label="Mis Reservas"
                onPress={() => navigateTo('Reservas')}
              />
              <MenuItem
                icono="heart-outline"
                label="Favoritos"
                onPress={() => navigateTo('Favoritos')}
              />
              <MenuItem
                icono="wallet-outline"
                label="Mis Puntos"
                subtext={usuario.puntos || '0 pts'}
                onPress={() => navigateTo('Puntos')}
              />
              <MenuItem
                icono="settings-outline"
                label="Configuración"
                onPress={() => navigateTo('Configuracion')}
              />

              <View style={styles.menuDivisor} />

              <MenuItem
                icono="log-out-outline"
                label="Cerrar Sesión"
                isRojo
                onPress={handleLogout}
              />
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

/**
 * Componente NavLink - Item de navegación en el centro
 */
const NavLink = ({ label, icono, onPress }) => (
  <TouchableOpacity style={styles.navLink} onPress={onPress}>
    <Ionicons name={icono} size={24} color={COLORES.SECUNDARIO} />
    <Text style={styles.navLinkText}>{label}</Text>
  </TouchableOpacity>
);

/**
 * Componente MenuItem - Item del menú desplegable
 */
const MenuItem = ({ icono, label, subtext, isRojo, onPress }) => (
  <TouchableOpacity
    style={[styles.menuItem, isRojo && styles.menuItemRojo]}
    onPress={onPress}
  >
    <Ionicons
      name={icono}
      size={20}
      color={isRojo ? COLORES.ERROR : COLORES.SECUNDARIO}
    />
    <View style={styles.menuItemTexto}>
      <Text style={[styles.menuItemLabel, isRojo && styles.menuItemLabelRojo]}>
        {label}
      </Text>
      {subtext && <Text style={styles.menuItemSubtext}>{subtext}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={20} color={COLORES.COMPLEMENTARIO} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // NAVBAR PRINCIPAL
  navbar: {
    height: 70,
    backgroundColor: COLORES.PRIMARIO,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ESPACIADO.L,
    ...SOMBRAS.NAVBAR,
  },

  // SECCIONES
  seccionIzquierda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.M,
    flex: 1,
  },

  seccionCentro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.XL,
    flex: 1.5,
    justifyContent: 'center',
  },

  seccionDerecha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.M,
    flex: 1,
    justifyContent: 'flex-end',
  },

  // LOGO E INFO HOTEL
  logo: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.MEDIUM,
  },

  hotelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.XS,
  },

  hotelNombre: {
    fontSize: TIPOGRAFIA.H4,
    color: COLORES.SECUNDARIO,
    fontWeight: TIPOGRAFIA.BOLD,
  },

  hotelIcon: {
    fontSize: 20,
  },

  // NAVEGACIÓN
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.XS,
    paddingHorizontal: ESPACIADO.M,
    paddingVertical: ESPACIADO.S,
    borderRadius: BORDER_RADIUS.MEDIUM,
  },

  navLinkText: {
    fontSize: TIPOGRAFIA.BODY_M,
    color: COLORES.ACENTO,
    fontWeight: TIPOGRAFIA.MEDIUM,
  },

  // BOTÓN USUARIO
  botonUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.S,
    paddingHorizontal: ESPACIADO.M,
    paddingVertical: ESPACIADO.XS,
    backgroundColor: 'rgba(201, 169, 97, 0.1)',
    borderRadius: BORDER_RADIUS.LARGE,
  },

  fotoPerfil: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.ROUND,
    borderWidth: 2,
    borderColor: COLORES.SECUNDARIO,
  },

  datosUsuario: {
    marginHorizontal: ESPACIADO.S,
  },

  nombreUsuario: {
    fontSize: TIPOGRAFIA.BODY_M,
    color: COLORES.ACENTO,
    fontWeight: TIPOGRAFIA.SEMIBOLD,
  },

  rolUsuario: {
    fontSize: TIPOGRAFIA.BODY_S,
    color: COLORES.SECUNDARIO,
    fontStyle: 'italic',
  },

  // BOTÓN LOGIN
  botonLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.S,
    paddingHorizontal: ESPACIADO.M,
    paddingVertical: ESPACIADO.XS,
  },

  textoLogin: {
    fontSize: TIPOGRAFIA.BODY_M,
    color: COLORES.SECUNDARIO,
    fontWeight: TIPOGRAFIA.MEDIUM,
  },

  // MENÚ DESPLEGABLE
  overlay: {
    flex: 1,
    backgroundColor: COLORES.OVERLAY_DARK,
    justifyContent: 'flex-start',
  },

  menuDropdown: {
    backgroundColor: COLORES.BLANCO,
    borderRadius: BORDER_RADIUS.LARGE,
    marginTop: 70,
    marginRight: ESPACIADO.L,
    marginLeft: 'auto',
    width: '90%',
    maxWidth: 320,
    maxHeight: '70%',
    ...SOMBRAS.LARGE,
  },

  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.M,
    paddingHorizontal: ESPACIADO.L,
    paddingVertical: ESPACIADO.L,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.GRIS_CLARO,
  },

  menuHeaderInfo: {
    flex: 1,
  },

  menuNombre: {
    fontSize: TIPOGRAFIA.BODY_L,
    fontWeight: TIPOGRAFIA.SEMIBOLD,
    color: COLORES.NEGRO,
  },

  menuEmail: {
    fontSize: TIPOGRAFIA.BODY_S,
    color: COLORES.COMPLEMENTARIO,
    marginTop: ESPACIADO.XS,
  },

  menuItems: {
    paddingVertical: ESPACIADO.S,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.M,
    paddingHorizontal: ESPACIADO.L,
    paddingVertical: ESPACIADO.M,
  },

  menuItemTexto: {
    flex: 1,
  },

  menuItemLabel: {
    fontSize: TIPOGRAFIA.BODY_M,
    color: COLORES.NEGRO,
    fontWeight: TIPOGRAFIA.MEDIUM,
  },

  menuItemRojo: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },

  menuItemLabelRojo: {
    color: COLORES.ERROR,
  },

  menuItemSubtext: {
    fontSize: TIPOGRAFIA.BODY_S,
    color: COLORES.COMPLEMENTARIO,
    marginTop: ESPACIADO.XS,
  },

  menuDivisor: {
    height: 1,
    backgroundColor: COLORES.GRIS_CLARO,
    marginVertical: ESPACIADO.S,
  },
});

export default Navbar;
