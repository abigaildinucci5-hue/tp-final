// frontend/src/componentes/comun/CustomNavBar.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';
import { useAuth } from '../../contexto/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CustomNavBar = ({
  navigation,
  activeRoute = 'Home',
  onProfilePress,
  onLoginPress,
  onRegisterPress,
  onLogoutPress,
}) => {
  const { isAuthenticated, usuario } = useAuth();
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);

  const handleNavigation = (route) => {
    switch (route) {
      case 'Home':
        navigation.navigate('Home', { screen: 'HomeMain' });
        break;
      case 'Habitaciones':
        navigation.navigate('Habitaciones', { screen: 'ListaHabitaciones' });
        break;
      case 'Reservas':
        navigation.navigate('Reservas', { screen: 'MisReservas' });
        break;
      case 'Perfil':
        navigation.navigate('Perfil', { screen: 'PerfilMain' });
        break;
      default:
        break;
    }
  };

  const handleProfileMenuPress = () => {
    if (isAuthenticated) {
      setProfileMenuVisible(true);
    } else {
      setProfileMenuVisible(true);
    }
  };

  const handleLogin = () => {
    setProfileMenuVisible(false);
    onLoginPress?.();
  };

  const handleRegister = () => {
    setProfileMenuVisible(false);
    onRegisterPress?.();
  };

  const handleProfile = () => {
    setProfileMenuVisible(false);
    onProfilePress?.();
  };

  const handleLogout = async () => {
    setProfileMenuVisible(false);
    onLogoutPress?.();
  };

  const navItems = ['Home', 'Habitaciones', 'Reservas'];

  return (
    <>
      <LinearGradient
        colors={[COLORES.dorado, COLORES.doradoOscuro]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.navBarContainer}
      >
        <View style={styles.navBarContent}>
          {/* Botones de navegación */}
          <View style={styles.navItemsContainer}>
            {navItems.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => handleNavigation(item)}
                style={[
                  styles.navItem,
                  activeRoute === item && styles.navItemActive,
                ]}
              >
                <MaterialCommunityIcons
                  name={
                    item === 'Home'
                      ? 'home'
                      : item === 'Habitaciones'
                      ? 'bed-double'
                      : 'calendar-multiple'
                  }
                  size={24}
                  color={activeRoute === item ? COLORES.negro : COLORES.blanco}
                />
                <Text
                  style={[
                    styles.navItemText,
                    activeRoute === item && styles.navItemTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Botón de usuario/perfil */}
          <TouchableOpacity
            onPress={handleProfileMenuPress}
            style={styles.profileButton}
          >
            <MaterialCommunityIcons
              name="account-circle"
              size={28}
              color={COLORES.blanco}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Modal de perfil/login */}
      <Modal
        visible={profileMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setProfileMenuVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {isAuthenticated ? (
              <>
                <View style={styles.userHeader}>
                  <MaterialCommunityIcons
                    name="account-circle"
                    size={48}
                    color={COLORES.dorado}
                  />
                  <Text style={styles.userName}>
                    {usuario?.nombre || 'Usuario'}
                  </Text>
                  <Text style={styles.userEmail}>
                    {usuario?.email || 'email@example.com'}
                  </Text>
                </View>

                <View style={styles.divider} />

                <TouchableOpacity
                  onPress={handleProfile}
                  style={styles.menuItem}
                >
                  <MaterialCommunityIcons
                    name="account-edit"
                    size={24}
                    color={COLORES.dorado}
                  />
                  <Text style={styles.menuItemText}>Mi Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setProfileMenuVisible(false);
                    navigation.navigate('Perfil', {
                      screen: 'Notificaciones',
                    });
                  }}
                  style={styles.menuItem}
                >
                  <MaterialCommunityIcons
                    name="bell"
                    size={24}
                    color={COLORES.dorado}
                  />
                  <Text style={styles.menuItemText}>Notificaciones</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setProfileMenuVisible(false);
                    navigation.navigate('Perfil', {
                      screen: 'Favoritos',
                    });
                  }}
                  style={styles.menuItem}
                >
                  <MaterialCommunityIcons
                    name="heart"
                    size={24}
                    color={COLORES.dorado}
                  />
                  <Text style={styles.menuItemText}>Favoritos</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                  onPress={handleLogout}
                  style={[styles.menuItem, styles.logoutItem]}
                >
                  <MaterialCommunityIcons
                    name="logout"
                    size={24}
                    color={COLORES.error}
                  />
                  <Text style={[styles.menuItemText, styles.logoutText]}>
                    Cerrar Sesión
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.guestHeader}>
                  <MaterialCommunityIcons
                    name="account-question"
                    size={48}
                    color={COLORES.dorado}
                  />
                  <Text style={styles.guestTitle}>
                    Bienvenido a Hotel Luna Serena
                  </Text>
                  <Text style={styles.guestSubtitle}>
                    Inicia sesión para acceder a todas las funciones
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleLogin}
                  style={[styles.authButton, styles.loginButton]}
                >
                  <MaterialCommunityIcons
                    name="login"
                    size={24}
                    color={COLORES.blanco}
                  />
                  <Text style={styles.authButtonText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleRegister}
                  style={[styles.authButton, styles.registerButton]}
                >
                  <MaterialCommunityIcons
                    name="account-plus"
                    size={24}
                    color={COLORES.dorado}
                  />
                  <Text style={[styles.authButtonText, styles.registerButtonText]}>
                    Crear Cuenta
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={() => setProfileMenuVisible(false)}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={COLORES.textoGris}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  navBarContainer: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: DIMENSIONES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.doradoOscuro,
  },
  navBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
  },
  navItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  navItemText: {
    fontSize: 10,
    color: COLORES.blanco,
    marginTop: 4,
    fontFamily: TIPOGRAFIA.fontMontserratRegular,
  },
  navItemTextActive: {
    color: COLORES.negro,
    fontFamily: TIPOGRAFIA.fontMontserratBold,
  },
  profileButton: {
    padding: 8,
    marginLeft: 'auto',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORES.blanco,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: DIMENSIONES.padding,
    paddingVertical: 24,
    maxHeight: '80%',
  },
  userHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontSize: 18,
    fontFamily: TIPOGRAFIA.fontMerriweatherBold,
    color: COLORES.negro,
    marginTop: 12,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: TIPOGRAFIA.fontMontserratRegular,
    color: COLORES.textoGris,
    marginTop: 4,
  },
  guestHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  guestTitle: {
    fontSize: 18,
    fontFamily: TIPOGRAFIA.fontMerriweatherBold,
    color: COLORES.negro,
    marginTop: 12,
    textAlign: 'center',
  },
  guestSubtitle: {
    fontSize: 13,
    fontFamily: TIPOGRAFIA.fontMontserratRegular,
    color: COLORES.textoGris,
    marginTop: 8,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORES.grisClaro,
    marginVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 15,
    fontFamily: TIPOGRAFIA.fontMontserratMedium,
    color: COLORES.negro,
    marginLeft: 16,
  },
  logoutItem: {
    marginTop: 8,
  },
  logoutText: {
    color: COLORES.error,
  },
  authButton: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  loginButton: {
    backgroundColor: COLORES.dorado,
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORES.dorado,
  },
  authButtonText: {
    fontSize: 14,
    fontFamily: TIPOGRAFIA.fontMontserratBold,
    color: COLORES.blanco,
    marginLeft: 12,
  },
  registerButtonText: {
    color: COLORES.dorado,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
});

export default CustomNavBar;
