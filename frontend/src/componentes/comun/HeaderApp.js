import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORES } from '../../constantes/colores';
import { useAuth } from '../../contexto/AuthContext';

const estilos = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 16,
  },

  leftContainer: {
    flex: 0.2,
    alignItems: 'flex-start',
  },

  centerContainer: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightContainer: {
    flex: 0.2,
    alignItems: 'flex-end',
  },

  iconButton: {
    padding: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORES.BLANCO,
  },

  subtitle: {
    fontSize: 12,
    color: COLORES.BLANCO,
  },

  profileButton: {
    padding: 6,
  },

  profileMenu: {
    position: 'absolute',
    top: 60,
    right: 10,
    width: 260,
    backgroundColor: COLORES.BLANCO,
    borderRadius: 8,
    paddingVertical: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

  menuHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.GRIS_CLARO,
  },

  menuUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORES.NEGRO,
  },

  menuUserEmail: {
    fontSize: 12,
    color: COLORES.GRIS_OSCURO,
    marginTop: 4,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  menuItemText: {
    marginLeft: 12,
    fontSize: 14,
    color: COLORES.NEGRO,
  },
});

const HeaderApp = ({
  title,
  subtitle,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
  onProfilePress,
  onLoginPress,
  onRegisterPress,
  onLogoutPress,
}) => {
  const { isAuthenticated, usuario } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const closeMenu = () => setMenuVisible(false);

  const ProfileIcon = () => (
    <TouchableOpacity
      style={estilos.profileButton}
      onPress={() => setMenuVisible(true)}
    >
      <MaterialCommunityIcons
        name={isAuthenticated ? 'account-circle' : 'account-outline'}
        size={28}
        color={COLORES.BLANCO}
      />
    </TouchableOpacity>
  );

  return (
    <>
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity
          style={estilos.modalOverlay}
          activeOpacity={1}
          onPress={closeMenu}
        >
          <View style={estilos.profileMenu}>
            {isAuthenticated ? (
              <>
                <View style={estilos.menuHeader}>
                  <Text style={estilos.menuUserName}>
                    {usuario?.nombre || 'Usuario'}
                  </Text>
                  <Text style={estilos.menuUserEmail}>
                    {usuario?.email || ''}
                  </Text>
                </View>

                <TouchableOpacity
                  style={estilos.menuItem}
                  onPress={() => {
                    closeMenu();
                    onProfilePress?.();
                  }}
                >
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={20}
                    color={COLORES.SECUNDARIO}
                  />
                  <Text style={estilos.menuItemText}>
                    Mi Perfil
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={estilos.menuItem}
                  onPress={() => {
                    closeMenu();
                    onLogoutPress?.();
                  }}
                >
                  <MaterialCommunityIcons
                    name="logout"
                    size={20}
                    color={COLORES.ERROR}
                  />
                  <Text
                    style={[
                      estilos.menuItemText,
                      { color: COLORES.ERROR },
                    ]}
                  >
                    Cerrar Sesión
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={estilos.menuItem}
                  onPress={() => {
                    closeMenu();
                    onLoginPress?.();
                  }}
                >
                  <MaterialCommunityIcons
                    name="login"
                    size={20}
                    color={COLORES.SECUNDARIO}
                  />
                  <Text style={estilos.menuItemText}>
                    Iniciar Sesión
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={estilos.menuItem}
                  onPress={() => {
                    closeMenu();
                    onRegisterPress?.();
                  }}
                >
                  <MaterialCommunityIcons
                    name="account-plus"
                    size={20}
                    color={COLORES.SECUNDARIO}
                  />
                  <Text style={estilos.menuItemText}>
                    Registrarme
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      <LinearGradient
        colors={[COLORES.PRIMARIO, COLORES.SECUNDARIO]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={estilos.header}
      >
        <View style={estilos.leftContainer}>
          {leftIcon && (
            <TouchableOpacity
              onPress={onLeftPress}
              style={estilos.iconButton}
            >
              <MaterialCommunityIcons
                name={leftIcon}
                size={24}
                color={COLORES.BLANCO}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={estilos.centerContainer}>
          <Text style={estilos.title}>{title}</Text>
          {subtitle && (
            <Text style={estilos.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={estilos.rightContainer}>
          {rightIcon ? (
            <TouchableOpacity
              onPress={onRightPress}
              style={estilos.iconButton}
            >
              <MaterialCommunityIcons
                name={rightIcon}
                size={24}
                color={COLORES.BLANCO}
              />
            </TouchableOpacity>
          ) : (
            <ProfileIcon />
          )}
        </View>
      </LinearGradient>
    </>
  );
};

export default HeaderApp;