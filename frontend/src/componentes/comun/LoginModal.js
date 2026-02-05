// frontend/src/componentes/comun/LoginModal.js
import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, SOMBRAS } from '../../constantes/estilos';

/**
 * Modal reutilizable para login cuando se intenta una acción protegida
 * No rompe la navegación actual, solo muestra un modal
 */
const LoginModal = ({
  visible,
  onClose,
  onLoginPress,
  onRegisterPress,
  actionMessage = 'Para continuar, inicia sesión o crea una cuenta',
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'overFullScreen'}
    >
      <View style={estilos.container}>
        {/* Header modal con navegación */}
        <View style={estilos.header}>
          <TouchableOpacity
            style={estilos.backButton}
            onPress={onClose}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color={COLORES.primario}
            />
            <Text style={estilos.backButtonText}>Atrás</Text>
          </TouchableOpacity>
          <Text style={estilos.headerTitle}>Acceso Requerido</Text>
          <TouchableOpacity
            style={estilos.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={COLORES.textoOscuro}
            />
          </TouchableOpacity>
        </View>

        {/* Contenido scrollable */}
        <ScrollView
          style={estilos.content}
          contentContainerStyle={estilos.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Ícono decorativo */}
          <View style={estilos.iconContainer}>
            <View
              style={[
                estilos.iconBg,
                { backgroundColor: COLORES.primario + '20' },
              ]}
            >
              <MaterialCommunityIcons
                name="account-check"
                size={48}
                color={COLORES.primario}
              />
            </View>
          </View>

          {/* Mensaje */}
          <Text style={estilos.message}>{actionMessage}</Text>

          <Text style={estilos.subtitle}>
            Accede a todas las funciones: reservar, favoritos, perfil y más.
          </Text>

          {/* Botones de acción */}
          <View style={estilos.buttonsContainer}>
            <TouchableOpacity
              style={estilos.loginButton}
              onPress={onLoginPress}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="login"
                size={20}
                color={COLORES.fondoBlanco}
              />
              <Text style={estilos.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.registerButton}
              onPress={onRegisterPress}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="account-plus"
                size={20}
                color={COLORES.primario}
              />
              <Text style={estilos.registerButtonText}>Crear Cuenta</Text>
            </TouchableOpacity>
          </View>

          {/* Footer con opción de continuar como invitado */}
          <View style={estilos.footer}>
            <Text style={estilos.footerText}>
              ¿Prefieres continuar explorando?
            </Text>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={estilos.footerLink}>Volver atrás</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DIMENSIONES.padding,
    paddingVertical: 12,
    backgroundColor: COLORES.fondoBlanco,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.bordeGris,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 0,
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
  },
  headerTitle: {
    flex: 1,
    fontSize: TIPOGRAFIA.fontSizeHeading,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
  },
  content: {
    flex: 1,
    backgroundColor: COLORES.fondoBlanco,
  },
  contentContainer: {
    paddingHorizontal: DIMENSIONES.padding,
    paddingVertical: 32,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: TIPOGRAFIA.fontSizeHeading,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoGris,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: COLORES.primario,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...SOMBRAS.small,
  },
  loginButtonText: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.fondoBlanco,
  },
  registerButton: {
    flexDirection: 'row',
    backgroundColor: COLORES.fondoBlanco,
    borderWidth: 2,
    borderColor: COLORES.primario,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  registerButtonText: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORES.bordeGris,
  },
  footerText: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoGris,
    marginBottom: 8,
  },
  footerLink: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
  },
});

export default LoginModal;
