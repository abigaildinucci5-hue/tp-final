/**
 * NAVBAR MODERNA - HOTEL LUNA SERENA
 * Barra de navegación superior con logo, menú y perfil de usuario
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORES } from '../../constantes/colores';

const { width } = Dimensions.get('window');

const NavbarModerna = ({ 
  navigation, 
  usuario, 
  isAuthenticated, 
  onLogout,
  activeRoute = 'Home' 
}) => {
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);

  const navigateTo = (screen, params = {}) => {
    if (navigation) {
      // Para los stacks principales, especificar el screen inicial
      if (screen === 'Home') {
        navigation.navigate('Home', { screen: 'HomeMain', ...params });
      } else if (screen === 'Habitaciones') {
        navigation.navigate('Habitaciones', { screen: 'ListaHabitaciones', ...params });
      } else if (screen === 'Reservas') {
        navigation.navigate('Reservas', { screen: 'MisReservas', ...params });
      } else if (screen === 'Perfil') {
        navigation.navigate('Perfil', { screen: 'PerfilMain', ...params });
      } else {
        // Para otras pantallas, navegar directamente
        navigation.navigate(screen, params);
      }
    }
    setMostrarMenuUsuario(false);
  };

  const handleLogout = () => {
    setMostrarMenuUsuario(false);
    if (onLogout) onLogout();
  };

  return (
    <>
      {/* NAVBAR PRINCIPAL */}
      <View style={styles.navbar}>
        {/* IZQUIERDA: Logo */}
        <View style={styles.seccionIzquierda}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons 
              name="moon-waning-crescent" 
              size={28} 
              color={COLORES.SECUNDARIO} 
            />
          </View>
          <View>
            <Text style={styles.hotelNombre}>Hotel Luna Serena</Text>
            <Text style={styles.hotelSubtitulo}>Lujo & Confort</Text>
          </View>
        </View>

        {/* CENTRO: Navegación (mostrar en pantallas grandes) */}
        {width > 600 && (
          <View style={styles.seccionCentro}>
            <NavLink
              label="Home"
              icono="home-outline"
              activo={activeRoute === 'Home'}
              onPress={() => navigateTo('Home')}
            />
            <NavLink
              label="Habitaciones"
              icono="bed-outline"
              activo={activeRoute === 'Habitaciones'}
              onPress={() => navigateTo('Habitaciones')}
            />
            <NavLink
              label="Reservas"
              icono="calendar-outline"
              activo={activeRoute === 'Reservas'}
              onPress={() => navigateTo('Reservas')}
            />
            <NavLink
              label="Contacto"
              icono="phone-outline"
              activo={activeRoute === 'Contacto'}
              onPress={() => navigateTo('Contacto')}
            />
          </View>
        )}

        {/* DERECHA: Usuario o Login */}
        <View style={styles.seccionDerecha}>
          {isAuthenticated && usuario ? (
            <TouchableOpacity
              style={styles.botonUsuario}
              onPress={() => setMostrarMenuUsuario(!mostrarMenuUsuario)}
            >
              <Image
                source={{ uri: usuario.fotoPerfil || 'https://via.placeholder.com/40' }}
                style={styles.fotoPerfil}
              />
              {width > 480 && (
                <View style={styles.datosUsuario}>
                  <Text style={styles.nombreUsuario} numberOfLines={1}>
                    {usuario.nombre || 'Usuario'}
                  </Text>
                  <Text style={styles.rolUsuario} numberOfLines={1}>
                    {usuario.rol || 'Huésped'}
                  </Text>
                </View>
              )}
              <MaterialCommunityIcons
                name={mostrarMenuUsuario ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORES.SECUNDARIO}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.botonLogin}
              onPress={() => {
                if (navigation) {
                  navigation.navigate('Auth', {
                    screen: 'Login',
                  });
                }
                setMostrarMenuUsuario(false);
              }}
            >
              <MaterialCommunityIcons 
                name="account-circle-outline" 
                size={28} 
                color={COLORES.SECUNDARIO} 
              />
              {width > 480 && (
                <Text style={styles.textoLogin}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* MENÚ DESPLEGABLE */}
      <Modal
        visible={mostrarMenuUsuario}
        transparent
        animationType="fade"
        onRequestClose={() => setMostrarMenuUsuario(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setMostrarMenuUsuario(false)}
          activeOpacity={1}
        >
          <View style={styles.menuDropdown}>
            {/* Header menú */}
            <View style={styles.menuHeader}>
              <Image
                source={{ uri: usuario?.fotoPerfil || 'https://via.placeholder.com/50' }}
                style={styles.menuAvatar}
              />
              <View style={styles.menuHeaderInfo}>
                <Text style={styles.menuNombre}>{usuario?.nombre || 'Usuario'}</Text>
                <Text style={styles.menuEmail}>{usuario?.email || 'correo@example.com'}</Text>
              </View>
            </View>

            <ScrollView style={styles.menuItems}>
              <MenuItem
                icono="account-outline"
                label="Mi Perfil"
                onPress={() => {
                  navigateTo('Perfil');
                }}
              />
              <MenuItem
                icono="bookmark-outline"
                label="Mis Reservas"
                onPress={() => navigateTo('Reservas')}
              />
              <MenuItem
                icono="heart-outline"
                label="Favoritos"
                onPress={() => {
                  setMostrarMenuUsuario(false);
                  // Navegar a favoritos
                }}
              />
              <MenuItem
                icono="star-outline"
                label="Mis Puntos"
                subtext={`${usuario?.puntos || 0} pts`}
                onPress={() => {
                  setMostrarMenuUsuario(false);
                  // Navegar a puntos
                }}
              />
              <MenuItem
                icono="cog-outline"
                label="Configuración"
                onPress={() => {
                  setMostrarMenuUsuario(false);
                  // Navegar a configuración
                }}
              />

              <View style={styles.menuDivisor} />

              <MenuItem
                icono="logout"
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
 * Componente NavLink - Item de navegación
 */
const NavLink = ({ label, icono, activo, onPress }) => (
  <TouchableOpacity 
    style={[styles.navLink, activo && styles.navLinkActivo]} 
    onPress={onPress}
  >
    <MaterialCommunityIcons 
      name={icono} 
      size={22} 
      color={activo ? COLORES.SECUNDARIO : COLORES.ACENTO} 
    />
    <Text style={[styles.navLinkText, activo && styles.navLinkTextActivo]}>
      {label}
    </Text>
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
    <MaterialCommunityIcons
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
    <MaterialCommunityIcons 
      name="chevron-right" 
      size={20} 
      color={COLORES.grisTexto} 
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // ===== NAVBAR PRINCIPAL =====
  navbar: {
    height: 70,
    backgroundColor: COLORES.PRIMARIO,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },

  // SECCIONES
  seccionIzquierda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(201, 169, 97, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  hotelNombre: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORES.SECUNDARIO,
  },

  hotelSubtitulo: {
    fontSize: 11,
    color: COLORES.ACENTO,
    opacity: 0.8,
    marginTop: 2,
  },

  seccionCentro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1.5,
    justifyContent: 'center',
  },

  seccionDerecha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'flex-end',
  },

  // NAVEGACIÓN
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  navLinkActivo: {
    borderBottomColor: COLORES.SECUNDARIO,
  },

  navLinkText: {
    fontSize: 13,
    color: COLORES.ACENTO,
    fontWeight: '500',
  },

  navLinkTextActivo: {
    color: COLORES.SECUNDARIO,
    fontWeight: '600',
  },

  // BOTÓN USUARIO
  botonUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(201, 169, 97, 0.12)',
    borderRadius: 12,
  },

  fotoPerfil: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: COLORES.SECUNDARIO,
  },

  datosUsuario: {
    marginHorizontal: 8,
    maxWidth: 120,
  },

  nombreUsuario: {
    fontSize: 13,
    color: COLORES.ACENTO,
    fontWeight: '600',
  },

  rolUsuario: {
    fontSize: 10,
    color: COLORES.SECUNDARIO,
    fontStyle: 'italic',
    marginTop: 2,
  },

  // BOTÓN LOGIN
  botonLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  textoLogin: {
    fontSize: 13,
    color: COLORES.SECUNDARIO,
    fontWeight: '600',
  },

  // ===== MENÚ DESPLEGABLE =====
  overlay: {
    flex: 1,
    backgroundColor: COLORES.OVERLAY_DARK,
    justifyContent: 'flex-start',
  },

  menuDropdown: {
    backgroundColor: COLORES.BLANCO,
    borderRadius: 12,
    marginTop: 70,
    marginRight: 16,
    marginLeft: 'auto',
    width: '88%',
    maxWidth: 300,
    maxHeight: '70%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.grisClaro,
  },

  menuAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORES.SECUNDARIO,
  },

  menuHeaderInfo: {
    flex: 1,
  },

  menuNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORES.NEGRO,
  },

  menuEmail: {
    fontSize: 12,
    color: COLORES.grisTexto,
    marginTop: 3,
  },

  menuItems: {
    paddingVertical: 6,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },

  menuItemTexto: {
    flex: 1,
  },

  menuItemLabel: {
    fontSize: 14,
    color: COLORES.NEGRO,
    fontWeight: '500',
  },

  menuItemRojo: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },

  menuItemLabelRojo: {
    color: COLORES.ERROR,
  },

  menuItemSubtext: {
    fontSize: 11,
    color: COLORES.grisTexto,
    marginTop: 3,
  },

  menuDivisor: {
    height: 1,
    backgroundColor: COLORES.grisClaro,
    marginVertical: 8,
  },
});

export default NavbarModerna;
