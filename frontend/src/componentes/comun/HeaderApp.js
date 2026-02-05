import React, { useState } from 'react';
import { ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, SOMBRAS } from '../../constantes/estilos';
import { useAuth } from '../../contexto/AuthContext';
import NavbarModerna from './NavbarModerna';

const HeaderApp = ({
  title,
  subtitle,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
  rightComponent,
  variant = 'primary', // 'primary', 'transparent'
  showShadow = true,
  showLogo = false,
  logoSource,
  onProfilePress,
  onLoginPress,
  onRegisterPress,
  onLogoutPress,
  backgroundImage,
  showNavigation = true, // Nueva prop para mostrar botones de navegación
  navigation, // Para navegar
  activeRoute = 'Home', // Ruta activa
}) => {
  const { isAuthenticated, usuario } = useAuth();
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);

  const getHeaderStyle = () => {
    const styles = [estilos.header];

    if (variant === 'primary') {
      styles.push(estilos.headerPrimary);
    } else {
      styles.push(estilos.headerTransparent);
    }

    if (showShadow) {
      styles.push(SOMBRAS.small);
    }

    return styles;
  };

  const getTitleColor = () => {
    return variant === 'primary' ? COLORES.textoBlanco : COLORES.textoOscuro;
  };

  const handleProfilePress = () => {
    setProfileMenuVisible(false);
    
    if (isAuthenticated) {
      onProfilePress?.();
    }
  };

  const handleLoginPress = () => {
    setProfileMenuVisible(false);
    onLoginPress?.();
  };

  const handleRegisterPress = () => {
    setProfileMenuVisible(false);
    onRegisterPress?.();
  };

  const handleLogoutPress = () => {
    setProfileMenuVisible(false);
    onLogoutPress?.();
  };

  // Componente de perfil en el header
  const ProfileIcon = () => (
    <TouchableOpacity
      style={estilos.profileButton}
      onPress={() => setProfileMenuVisible(true)}
      activeOpacity={0.7}
    >
      {isAuthenticated && usuario?.avatar ? (
        <Image
          source={{ uri: usuario.avatar }}
          style={estilos.avatarImage}
        />
      ) : (
        <MaterialCommunityIcons
          name={isAuthenticated ? 'account-circle' : 'account-outline'}
          size={28}
          color={getTitleColor()}
        />
      )}
    </TouchableOpacity>
  );

  // Menú desplegable de perfil
  const renderProfileMenu = () => (
    <Modal
      transparent
      visible={profileMenuVisible}
      animationType="fade"
      onRequestClose={() => setProfileMenuVisible(false)}
    >
      <TouchableOpacity
        style={estilos.modalOverlay}
        activeOpacity={1}
        onPress={() => setProfileMenuVisible(false)}
      >
        <View style={estilos.profileMenu}>
          {isAuthenticated ? (
            <>
              {/* Encabezado del menú con info del usuario */}
              <View style={estilos.menuHeader}>
                {usuario?.avatar ? (
                  <Image
                    source={{ uri: usuario.avatar }}
                    style={estilos.menuAvatar}
                  />
                ) : (
                  <View style={estilos.menuAvatarPlaceholder}>
                    <MaterialCommunityIcons
                      name="account-circle"
                      size={48}
                      color={COLORES.primario}
                    />
                  </View>
                )}
                <View style={estilos.menuUserInfo}>
                  <Text style={estilos.menuUserName}>{usuario?.nombre || 'Usuario'}</Text>
                  <Text style={estilos.menuUserEmail}>{usuario?.email || ''}</Text>
                </View>
              </View>

              {/* Separador */}
              <View style={estilos.menuDivider} />

              {/* Opciones de menú */}
              <TouchableOpacity
                style={estilos.menuItem}
                onPress={() => {
                  handleProfilePress();
                }}
              >
                <MaterialCommunityIcons
                  name="account-outline"
                  size={20}
                  color={COLORES.primario}
                />
                <Text style={estilos.menuItemText}>Mi Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity style={estilos.menuItem} onPress={handleLogoutPress}>
                <MaterialCommunityIcons
                  name="logout"
                  size={20}
                  color={COLORES.error}
                />
                <Text style={[estilos.menuItemText, { color: COLORES.error }]}>
                  Cerrar Sesión
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Mensaje y opciones para invitado */}
              <View style={[estilos.menuItem, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                <Text style={[estilos.menuUserName, { marginBottom: 8 }]}>Hola! estás en modo invitado</Text>
                <Text style={[estilos.menuUserEmail, { marginBottom: 12 }]}>¿Te gustaría:</Text>
                <View style={{ width: '100%' }}>
                  <TouchableOpacity style={estilos.menuItem} onPress={handleLoginPress}>
                    <MaterialCommunityIcons
                      name="login"
                      size={20}
                      color={COLORES.primario}
                    />
                    <Text style={estilos.menuItemText}>Iniciar Sesión</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={estilos.menuItem} onPress={handleRegisterPress}>
                    <MaterialCommunityIcons
                      name="account-plus"
                      size={20}
                      color={COLORES.primario}
                    />
                    <Text style={estilos.menuItemText}>Registrarme</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={estilos.menuItem} onPress={() => { setProfileMenuVisible(false); onProfilePress?.(); }}>
                    <MaterialCommunityIcons
                      name="account-arrow-right"
                      size={20}
                      color={COLORES.secundario}
                    />
                    <Text style={estilos.menuItemText}>Seguir como invitado</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Función para renderizar el contenido del header (DEFINIDA ANTES DEL RETURN)
  const renderHeaderContent = () => (
    <>
      {/* Botón izquierdo o logo */}
      <View style={estilos.leftContainer}>
        {showLogo && logoSource ? (
          <Image
            source={logoSource}
            style={estilos.logo}
            resizeMode="contain"
          />
        ) : leftIcon ? (
          <TouchableOpacity onPress={onLeftPress} style={estilos.iconButton}>
            <MaterialCommunityIcons
              name={leftIcon}
              size={24}
              color={getTitleColor()}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Título y subtítulo */}
      <View style={estilos.centerContainer}>
        <Text
          style={[estilos.title, { color: getTitleColor() }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[estilos.subtitle, { color: getTitleColor() }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Botón derecho o componente personalizado o ícono de perfil */}
      <View style={estilos.rightContainer}>
        {rightComponent ? (
          rightComponent
        ) : rightIcon ? (
          <TouchableOpacity onPress={onRightPress} style={estilos.iconButton}>
            <MaterialCommunityIcons
              name={rightIcon}
              size={24}
              color={getTitleColor()}
            />
          </TouchableOpacity>
        ) : (
          <ProfileIcon />
        )}
      </View>
    </>
  );

  // Si se provee backgroundImage, envolver el header en ImageBackground
  const HeaderWrapper = backgroundImage ? ImageBackground : View;

  return (
    <>
      {/* USAR NAVBAR MODERNA */}
      <NavbarModerna 
        navigation={navigation}
        usuario={usuario}
        isAuthenticated={isAuthenticated}
        onLogout={onLogoutPress}
        activeRoute={activeRoute}
      />
    </>
  );
};

export default HeaderApp;