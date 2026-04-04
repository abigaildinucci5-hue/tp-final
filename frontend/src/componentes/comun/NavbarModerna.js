/**
 * NAVBAR MODERNA - HOTEL LUNA SERENA
 * Barra de navegación superior con logo, menú y perfil de usuario
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { COLORES } from '../../constantes/colores';

const NavbarModerna = ({ 
  usuario, 
  isAuthenticated, 
  onLogout,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute();
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);
  const [mostrarMenuNav, setMostrarMenuNav] = useState(false);
  const [activeRoute, setActiveRoute] = useState('Home');

  // Monitorear cambios de ruta
  useEffect(() => {
    if (route?.name) {
      setActiveRoute(route.name);
    }
  }, [route?.name]);

  // Navegación usando la estructura de MainNavigator
  const navigateTo = (screen) => {

  let action;

  switch (screen) {

    case 'Home':
      action = CommonActions.navigate({
        name: 'Home',
        params: { screen: 'HomeMain' },
      });
      break;

    case 'ListaHabitaciones':
      action = CommonActions.navigate({
        name: 'Habitaciones',
        params: { screen: 'ListaHabitaciones' },
      });
      break;

    case 'Reservas':
      if (!isAuthenticated) {
        action = CommonActions.navigate({ name: 'Auth' });
      } else {
        action = CommonActions.navigate({
          name: 'Reservas',
          params: { screen: 'MisReservas' },
        });
      }
      break;

    case 'PerfilMain':
      if (!isAuthenticated) {
        action = CommonActions.navigate({ name: 'Auth' });
      } else {
        action = CommonActions.navigate({
          name: 'Perfil',
          params: { screen: 'PerfilMain' },
        });
      }
      break;

    case 'Contacto':
      action = CommonActions.navigate({ name: 'Contacto' });
      break;
  }

  if (action) {
    navigation.dispatch(action);
  }

  setMostrarMenuNav(false);
};

  const handleLogout = () => {
    setMostrarMenuUsuario(false);
    if (onLogout) onLogout();
  };

  const openAuthModal = () => {
  navigation.getParent()?.navigate('Auth');
};

  return (

    <>
      {/* NAVBAR PRINCIPAL */}
      <View style={styles.navbar}>
        {/* IZQUIERDA: Hamburguesa (solo mobile) o vacío */}
        {windowWidth <= 600 ? (
          <TouchableOpacity
            style={styles.hamburgerButton}
            onPress={() => setMostrarMenuNav(true)}
          >
            <MaterialCommunityIcons name="menu" size={32} color={COLORES.blanco} />
          </TouchableOpacity>
        ) : (
          <View style={styles.seccionIzquierda} />
        )}

        {/* CENTRO: Nombre del hotel o menú en desktop */}
        {windowWidth > 600 ? (
          <View style={styles.seccionCentroDesktop}>
            <NavLink
              label="Home"
              activo={activeRoute === 'Home'}
              onPress={() => navigateTo('Home')}
            />
            <NavLink
              label="Habitaciones"
              activo={activeRoute === 'Habitaciones'}
              onPress={() => navigateTo('ListaHabitaciones')}
            />
            <NavLink
              label="Reservas"
              activo={activeRoute === 'Reservas'}
              onPress={() => navigateTo('Reservas')}
            />
            <NavLink
              label="Contacto"
              activo={activeRoute === 'Contacto'}
              onPress={() => navigateTo('Contacto')}
            />
          </View>
        ) : (
          <View style={styles.seccionCentroMobile}>
            <MaterialCommunityIcons 
              name="moon-waning-crescent" 
              size={20} 
              color={COLORES.blanco} 
            />
            <Text style={styles.hotelNombreMobile}>Hotel Luna Serena</Text>
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
              {windowWidth > 480 && (
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
                color={COLORES.blanco}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.botonUsuario}
              onPress={() => setMostrarMenuUsuario(!mostrarMenuUsuario)}
            >
              <MaterialCommunityIcons 
                name="account-circle-outline" 
                size={28} 
                color={COLORES.blanco} 
              />
              {windowWidth > 480 && (
                <View style={styles.datosUsuario}>
                  <Text style={styles.nombreUsuario}>Modo Invitado</Text>
                  <Text style={styles.rolUsuario}>Usuario Anónimo</Text>
                </View>
              )}
              <MaterialCommunityIcons
                name={mostrarMenuUsuario ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORES.blanco}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* MENÚ LATERAL HAMBURGUESA (pantallas chicas) - Panel lateral transparente */}
        <Modal
  visible={mostrarMenuNav}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setMostrarMenuNav(false)}
>
  <View style={styles.sidebarContainer}>

    {/* Panel lateral */}
    <View style={styles.sidebarPanel}>
      <ScrollView style={styles.menuItems}>
        <MenuItem
          icono="home-outline"
          label="Home"
          onPress={() => { setMostrarMenuNav(false); navigateTo('Home'); }}
        />
        <MenuItem
          icono="bed-outline"
          label="Habitaciones"
          onPress={() => { setMostrarMenuNav(false); navigateTo('ListaHabitaciones'); }}
        />
        <MenuItem
          icono="calendar-outline"
          label="Reservas"
          onPress={() => { setMostrarMenuNav(false); navigateTo('Reservas'); }}
        />
      </ScrollView>
    </View>

    {/* Overlay */}
    <TouchableOpacity
      style={styles.sidebarOverlay}
      onPress={() => setMostrarMenuNav(false)}
      activeOpacity={1}
    />
  </View>
</Modal>

      {/* MENÚ DESPLEGABLE */}
      {mostrarMenuUsuario && (
        <TouchableOpacity
          style={styles.overlayAbsolute}
          onPress={() => setMostrarMenuUsuario(false)}
          activeOpacity={1}
        >
          <View style={[{ pointerEvents: 'auto' }, styles.menuDropdownAbsolute]}> 
            {isAuthenticated && usuario ? (
              <>
                {/* Header menú - Usuario autenticado */}
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
                      setMostrarMenuUsuario(false);
                      navigateTo('PerfilMain');
                    }}
                  />
                  <MenuItem
                    icono="bookmark-outline"
                    label="Mis Reservas"
                    onPress={() => {
                      setMostrarMenuUsuario(false);
                      navigateTo('MisReservas');
                    }}
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
              </>
            ) : (
              <>
                {/* Header menú - Modo invitado */}
                <View style={[styles.menuHeader, { justifyContent: 'center', alignItems: 'center' }]}>
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={40}
                    color={COLORES.blanco}
                  />
                  <Text style={styles.menuNombre}>Modo Invitado</Text>
                </View>

                <ScrollView style={styles.menuItems}>
                  <MenuItem
                    icono="home-outline"
                    label="Explorar Hotel"
                    onPress={() => {
                      setMostrarMenuUsuario(false);
                      navigateTo('Home');
                    }}
                  />
                  <MenuItem
                    icono="bed-outline"
                    label="Ver Habitaciones"
                    onPress={() => {
                      setMostrarMenuUsuario(false);
                      navigateTo('ListaHabitaciones');
                    }}
                  />
                  <MenuItem
                    icono="phone-outline"
                    label="Contacto"
                    onPress={() => {
                      setMostrarMenuUsuario(false);
                      navigateTo('Contacto');
                    }}
                  />
                  <View style={styles.menuDivisor} />

                  <TouchableOpacity
                    style={styles.menuItemLogin}
                    onPress={() => {
                      setMostrarMenuUsuario(false);
                      navigation.getParent()?.navigate('Auth');
                    }}
                  >
                    <MaterialCommunityIcons
                      name="account-circle-outline"
                      size={20}
                      color={COLORES.PRIMARIO}
                    />
                    <Text style={[styles.menuItemLabel, { color: COLORES.PRIMARIO }]}>
                      Iniciar Sesión
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </>
            )}
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

/**
 * Componente NavLink - Item de navegación sin iconos para mejor legibilidad en móvil
 */
import { Animated } from 'react-native';
const NavLink = ({ label, activo, onPress }) => (
  <TouchableOpacity 
    style={[styles.navLink]}
    onPress={onPress}
  >
    <View style={{ alignItems: 'center' }}>
      <Text style={[styles.navLinkText, activo && styles.navLinkTextActivo]}>
        {label}
      </Text>
      {activo && (
        <Animated.View style={styles.activeUnderline} />
      )}
    </View>
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
      size={24}
      color={isRojo ? '#ff6b6b' : COLORES.dorado}
      style={{ opacity: 1 }}
    />
    <View style={styles.menuItemTexto}>
      <Text style={[styles.menuItemLabel, { color: isRojo ? '#ff6b6b' : COLORES.blanco }]}> 
        {label}
      </Text>
      {subtext && <Text style={[styles.menuItemSubtext, { color: COLORES.blanco }]}>{subtext}</Text>}
    </View>
    <MaterialCommunityIcons 
      name="chevron-right" 
      size={24} 
      color={isRojo ? '#ff6b6b' : COLORES.dorado}
      style={{ opacity: 1 }}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  activeUnderline: {
    height: 3,
    width: '100%',
    backgroundColor: COLORES.blanco,
    borderRadius: 2,
    marginTop: 2,
  },
    hamburgerButton: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
  // ===== NAVBAR PRINCIPAL =====
  navbar: {
    height: 70,
    backgroundColor: COLORES.negroElegante, // Fondo negro elegante
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.10,
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
    minWidth: 50,
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
    color: COLORES.blanco, // Texto blanco
  },

  hotelSubtitulo: {
    fontSize: 11,
    color: COLORES.ACENTO,
    opacity: 0.8,
    marginTop: 2,
  },

  seccionCentroDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1.5,
    justifyContent: 'center',
  },

  seccionCentroMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },

  hotelNombreMobile: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORES.blanco, // Texto blanco
  },

  seccionDerecha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 50,
    justifyContent: 'flex-end',
  },

  // NAVEGACIÓN
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },

  navLinkActivo: {
    borderBottomColor: COLORES.SECUNDARIO,
  },

  navLinkText: {
    fontSize: 13,
    color: COLORES.blanco, // Texto blanco
    fontWeight: '500',
  },

  navLinkTextActivo: {
    color: COLORES.dorado, // Gold accent for active
    fontWeight: '600',
  },

  // BOTÓN USUARIO
  botonUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(201, 169, 97, 0.25)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(201, 169, 97, 0.4)',
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
    color: COLORES.blanco,
    fontWeight: '600',
  },

  rolUsuario: {
    fontSize: 11,
    color: COLORES.dorado,
    fontStyle: 'italic',
    marginTop: 2,
    fontWeight: '700',
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
    color: COLORES.negroElegante,
    fontWeight: '600',
  },

  // ===== MENÚ DESPLEGABLE =====
  sidebarContainer: {
  flex: 1,
  flexDirection: 'row',
},

  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9998,
  },

  sidebarPanel: {
    width: '70%',
    maxWidth: 280,
    height: '100%',
    backgroundColor: 'rgba(20,20,20,0.99)', // negro sólido para mejor visibilidad
    paddingTop: 60,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.1)',
    zIndex: 10000,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10000,
  },

  overlay: {
    flex: 1,
    backgroundColor: COLORES.OVERLAY_DARK,
    justifyContent: 'flex-start',
  },

  menuDropdown: {
    backgroundColor: COLORES.negroElegante,
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
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: COLORES.negroElegante,
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
    color: COLORES.blanco,
  },

  menuEmail: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 3,
  },

  menuItems: {
    paddingVertical: 6,
    flex: 1,
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
    fontSize: 15,
    fontWeight: '700',
    color: COLORES.blanco,
    letterSpacing: 0.3,
  },

  menuItemRojo: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },

  menuItemLabelRojo: {
    color: '#ff6b6b',
  },

  menuItemSubtext: {
    fontSize: 11,
    marginTop: 3,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  menuDivisor: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },

  menuItemLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 8,
  },

  overlayAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },

  menuDropdownAbsolute: {
    position: 'absolute',
    top: 70,
    right: 16,
    backgroundColor: COLORES.negroElegante,
    borderRadius: 12,
    width: '88%',
    maxWidth: 320,
    maxHeight: 500,
    zIndex: 1001,
    opacity: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
});

export default NavbarModerna;
