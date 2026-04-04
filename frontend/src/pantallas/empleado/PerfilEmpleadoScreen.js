// frontend/src/pantallas/empleado/PerfilEmpleadoScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert, Modal } from 'react-native';
import { ESTILOS_GLOBALES, DIMENSIONES, TIPOGRAFIA } from '../../constantes/estilos';
import NavbarEmpleado from '../../componentes/empleado/NavbarEmpleado';
import COLORES from '../../constantes/colores';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexto/AuthContext';
import { API_CONFIG } from '../../constantes/config';

const PerfilEmpleadoScreen = ({ navigation }) => {
  const { usuario, logout } = useAuth();
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [cargandoEliminar, setCargandoEliminar] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Cambiar Contraseña',
      'Se abrirá un formulario para cambiar tu contraseña',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          onPress: () => {
            Alert.alert('Info', 'Función en desarrollo');
          },
        },
      ]
    );
  };

  const handleEliminarCuenta = async () => {
    setCargandoEliminar(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/usuarios/cuenta`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usuario?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la cuenta');
      }

      setMostrarModalEliminar(false);
      await logout();
    } catch (error) {
      console.error('Error eliminando cuenta:', error);
      Alert.alert('Error', 'Error al eliminar la cuenta. Intenta de nuevo.');
    } finally {
      setCargandoEliminar(false);
    }
  };

  const getRolDisplay = (rol) => {
    const rolesMap = {
      'empleado': 'Empleado',
      'admin': 'Administrador',
      'gerente': 'Gerente',
      'recepcion': 'Recepcionista',
    };
    return rolesMap[rol?.toLowerCase()] || rol || 'Empleado';
  };

  const displayData = {
    nombre: usuario?.nombre || 'Empleado',
    email: usuario?.email || 'empleado@hotel.com',
    rol: getRolDisplay(usuario?.rol),
    descuento: '30%',
    rangoDescuento: 'Descuento especial para empleados',
    telefono: usuario?.telefono || '+56 9 1234 5678',
    estado: 'Activo',
    ultimoAcceso: new Date().toLocaleDateString(),
    permisosNivel: 'Gestión Parcial - Hotel Control',
  };

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <NavbarEmpleado usuario={usuario} onLogout={handleLogout} navigation={navigation} />

      <ScrollView style={estilos.container} contentContainerStyle={estilos.scroll}>
        {/* Avatar Section */}
        <View style={estilos.avatarSection}>
          <View style={estilos.avatar}>
            <MaterialCommunityIcons name="account" size={56} color={COLORES.fondoBlanco} />
          </View>
          <Text style={estilos.nombrePerfil}>{displayData.nombre}</Text>
          <View style={estilos.estatusBadge}>
            <MaterialCommunityIcons name="check-circle" size={16} color={COLORES.exito} />
            <Text style={estilos.estatusText}>{displayData.estado}</Text>
          </View>
        </View>

        {/* Información de Contacto */}
        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Información de Contacto</Text>
          <View style={estilos.card}>
            <View style={estilos.infoRow}>
              <MaterialCommunityIcons name="email" size={20} color={COLORES.primario} />
              <View style={estilos.infoContent}>
                <Text style={estilos.infoLabel}>Email</Text>
                <Text style={estilos.infoValue}>{displayData.email}</Text>
              </View>
            </View>

            <View style={[estilos.infoRow, { borderTopWidth: 1, borderTopColor: COLORES.borde }]}>
              <MaterialCommunityIcons name="briefcase" size={20} color={COLORES.primario} />
              <View style={estilos.infoContent}>
                <Text style={estilos.infoLabel}>Telefono</Text>
                <Text style={estilos.infoValue}>{displayData.telefono}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Información Laboral */}
        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Información Laboral</Text>
          <View style={estilos.card}>
            <View style={estilos.infoRow}>
              <MaterialCommunityIcons name="briefcase" size={20} color={COLORES.primario} />
              <View style={estilos.infoContent}>
                <Text style={estilos.infoLabel}>Rol</Text>
                <Text style={estilos.infoValue}>{displayData.rol}</Text>
              </View>
            </View>

            <View style={[estilos.infoRow, { borderTopWidth: 1, borderTopColor: COLORES.borde }]}>
              <MaterialCommunityIcons name="security" size={20} color={COLORES.primario} />
              <View style={estilos.infoContent}>
                <Text style={estilos.infoLabel}>Acceso de Sistema</Text>
                <Text style={estilos.infoValue}>{displayData.permisosNivel}</Text>
              </View>
            </View>

            <View style={[estilos.infoRow, { borderTopWidth: 1, borderTopColor: COLORES.borde }]}>
              <MaterialCommunityIcons name="calendar" size={20} color={COLORES.primario} />
              <View style={estilos.infoContent}>
                <Text style={estilos.infoLabel}>Último Acceso</Text>
                <Text style={estilos.infoValue}>{displayData.ultimoAcceso}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Beneficios */}
        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Beneficios de Empleado</Text>
          <View style={estilos.card}>
            <View style={estilos.beneficioBox}>
              <View style={estilos.beneficioIconBox}>
                <MaterialCommunityIcons name="percent" size={32} color={COLORES.exito} />
              </View>
              <View style={estilos.beneficioContent}>
                <Text style={estilos.beneficioLabel}>Descuento Especial</Text>
                <Text style={estilos.beneficioValue}>{displayData.descuento}</Text>
                <Text style={estilos.beneficioDescription}>{displayData.rangoDescuento}</Text>
              </View>
            </View>

            <View style={[estilos.beneficioBox, { borderTopWidth: 1, borderTopColor: COLORES.borde, paddingTop: 16 }]}>
              <View style={estilos.beneficioIconBox}>
                <MaterialCommunityIcons name="tools" size={32} color={COLORES.primario} />
              </View>
              <View style={estilos.beneficioContent}>
                <Text style={estilos.beneficioLabel}>Acceso Completo</Text>
                <Text style={estilos.beneficioValue}>Gestión Total</Text>
                <Text style={estilos.beneficioDescription}>Acceso a todas las funciones del hotel</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Eliminar Cuenta */}
        <View style={estilos.section}>
          <TouchableOpacity 
            style={[estilos.card, estilos.eliminarCuentaBtn]}
            onPress={() => setMostrarModalEliminar(true)}
          >
            <View style={estilos.optionLeft}>
              <MaterialCommunityIcons name="delete" size={20} color={COLORES.error} />
              <Text style={[estilos.optionText, { color: COLORES.error }]}>Eliminar Cuenta</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={COLORES.error} />
          </TouchableOpacity>
        </View>

        {/* Versión */}
        <View style={estilos.versionBox}>
          <Text style={estilos.versionText}>Sistema de Gestión Hotelera</Text>
          <Text style={estilos.versionNumber}>Versión 2.0.0</Text>
        </View>
      </ScrollView>

      {/* Modal de confirmación eliminar cuenta */}
      <Modal
        visible={mostrarModalEliminar}
        transparent
        animationType="fade"
        onRequestClose={() => setMostrarModalEliminar(false)}
      >
        <View style={estilos.modalOverlay}>
          <View style={estilos.modalContainer}>
            <View style={estilos.modalHeader}>
              <MaterialCommunityIcons name="alert" size={32} color={COLORES.error} />
              <Text style={estilos.modalTitle}>Eliminar Cuenta</Text>
            </View>

            <Text style={estilos.modalMessage}>
              ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible y se eliminarán todos tus datos.
            </Text>

            <View style={estilos.modalButtonContainer}>
              <TouchableOpacity 
                style={[estilos.modalButton, estilos.modalButtonCancel]}
                onPress={() => setMostrarModalEliminar(false)}
                disabled={cargandoEliminar}
              >
                <Text style={estilos.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[estilos.modalButton, estilos.modalButtonConfirm]}
                onPress={handleEliminarCuenta}
                disabled={cargandoEliminar}
              >
                <Text style={estilos.modalButtonConfirmText}>
                  {cargandoEliminar ? 'Eliminando...' : 'Eliminar Definitivamente'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: DIMENSIONES.padding,
    paddingBottom: DIMENSIONES.padding * 2,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: DIMENSIONES.padding * 3,
    paddingTop: DIMENSIONES.padding * 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORES.exito,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DIMENSIONES.padding,
  },
  nombrePerfil: {
    fontSize: TIPOGRAFIA.fontSizeDisplay,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 8,
  },
  estatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORES.exito + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  estatusText: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.exito,
  },
  section: {
    marginBottom: DIMENSIONES.padding * 2,
  },
  sectionTitle: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: DIMENSIONES.padding,
  },
  card: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    borderWidth: 1,
    borderColor: COLORES.borde,
    padding: DIMENSIONES.padding,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
  },
  beneficioBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  beneficioIconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORES.fondo,
    justifyContent: 'center',
    alignItems: 'center',
  },
  beneficioContent: {
    flex: 1,
  },
  beneficioLabel: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    marginBottom: 2,
  },
  beneficioValue: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 2,
  },
  beneficioDescription: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
  },
  versionBox: {
    alignItems: 'center',
    marginTop: DIMENSIONES.padding * 2,
    paddingVertical: DIMENSIONES.padding * 2,
  },
  versionText: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    marginBottom: 4,
  },
  versionNumber: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoMedio,
  },
  eliminarCuentaBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: DIMENSIONES.padding,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: DIMENSIONES.padding,
  },
  modalContainer: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginTop: 12,
  },
  modalMessage: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    color: COLORES.textoMedio,
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: DIMENSIONES.borderRadius,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: COLORES.borde,
  },
  modalButtonCancelText: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoMedio,
  },
  modalButtonConfirm: {
    backgroundColor: COLORES.error,
  },
  modalButtonConfirmText: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoBlanco,
  },
});

export default PerfilEmpleadoScreen;
