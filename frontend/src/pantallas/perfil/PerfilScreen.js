// frontend/src/pantallas/perfil/PerfilScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import { useAuth } from '../../hooks/useAuth';
import { useAuth as useAuthContext } from '../../contexto/AuthContext';
import HeaderApp from '../../componentes/comun/HeaderApp';
import InfoPerfil from '../../componentes/perfil/InfoPerfil';
import Loading from '../../componentes/comun/Loading';

const PerfilScreen = ({ navigation }) => {
  const { usuario, logout } = useAuth();
  const { isAuthenticated } = useAuthContext();

  // Proteger acceso: redirigir si es invitado
  useEffect(() => {
    if (!isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth', params: { screen: 'Login' } }],
      });
    }
  }, [isAuthenticated, navigation]);

  const opcionesMenu = [
    { id: 'editar', titulo: 'Editar Perfil', icono: 'account-outline', pantalla: 'EditarPerfil' },
    { id: 'password', titulo: 'Cambiar Contraseña', icono: 'lock-outline', pantalla: 'CambiarPassword' },
    { id: 'reservas', titulo: 'Mis Reservas', icono: 'calendar-outline', pantalla: 'MisReservas' },
    { id: 'favoritos', titulo: 'Favoritos', icono: 'heart-outline', pantalla: 'Favoritos' },
    { id: 'notificaciones', titulo: 'Notificaciones', icono: 'bell-outline', pantalla: 'Notificaciones' },
    { id: 'configuracion', titulo: 'Configuración', icono: 'cog-outline', pantalla: 'Configuracion' },
  ];

  const handleLogout = async () => {
    await logout();
    // No need to navigate, AuthContext will handle state change
  };

  if (!isAuthenticated) {
    return <Loading />;
  }

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp 
        title="Mi Perfil"
        showNavigation={true}
        navigation={navigation}
        activeRoute="Perfil"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={estilos.perfilContainer}>
          <InfoPerfil
            usuario={usuario}
            onEditarFoto={() => navigation.navigate('EditarPerfil')}
            editable
          />
        </View>

        <View style={estilos.menuContainer}>
          {opcionesMenu.map((opcion) => (
            <TouchableOpacity
              key={opcion.id}
              style={estilos.menuItem}
              onPress={() => navigation.navigate(opcion.pantalla)}
            >
              <View style={estilos.menuIcono}>
                <MaterialCommunityIcons name={opcion.icono} size={24} color={COLORES.primario} />
              </View>
              <Text style={estilos.menuTexto}>{opcion.titulo}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={COLORES.textoMedio} />
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={[estilos.menuItem, estilos.logoutItem]} onPress={handleLogout}>
            <View style={estilos.menuIcono}>
              <MaterialCommunityIcons name="logout" size={24} color={COLORES.error} />
            </View>
            <Text style={[estilos.menuTexto, estilos.logoutTexto]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const estilos = StyleSheet.create({
  perfilContainer: {
    padding: DIMENSIONES.padding,
  },
  menuContainer: {
    padding: DIMENSIONES.padding,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    gap: 12,
  },
  menuIcono: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORES.primario + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTexto: {
    flex: 1,
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightMedium,
    color: COLORES.textoOscuro,
  },
  logoutItem: {
    marginTop: 16,
  },
  logoutTexto: {
    color: COLORES.error,
  },
});

export default PerfilScreen;