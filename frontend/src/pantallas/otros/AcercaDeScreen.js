// frontend/src/pantallas/otros/AcercaDeScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import { HOTEL_INFO } from '../../constantes/config';
import HeaderApp from '../../componentes/comun/HeaderApp';
import { IMAGENES_LOCALES } from '../../constantes/imagenes';

const AcercaDeScreen = ({ navigation }) => {
  const servicios = [
    { icono: 'wifi', titulo: 'WiFi Gratuito', descripcion: 'En todas las áreas' },
    { icono: 'silverware-fork-knife', titulo: 'Restaurante', descripcion: 'Cocina gourmet' },
    { icono: 'dumbbell', titulo: 'Gimnasio', descripcion: 'Equipamiento completo' },
    { icono: 'water', titulo: 'Piscina', descripcion: 'Climatizada' },
    { icono: 'car', titulo: 'Estacionamiento', descripcion: 'Privado y seguro' },
    { icono: 'account-group', titulo: 'Room Service', descripcion: '24/7' },
  ];

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Acerca del Hotel"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Logo y nombre */}
        <View style={estilos.headerContainer}>
          <Image source={IMAGENES_LOCALES.logo} style={estilos.logo} />
          <Text style={estilos.hotelNombre}>{HOTEL_INFO.nombre}</Text>
          <View style={estilos.calificacionContainer}>
            <MaterialCommunityIcons name="star" size={20} color={COLORES.secundario} />
            <Text style={estilos.calificacion}>{HOTEL_INFO.calificacionPromedio}</Text>
          </View>
        </View>

        {/* Descripción */}
        <View style={estilos.seccion}>
          <Text style={estilos.seccionTitulo}>Nuestra Historia</Text>
          <Text style={estilos.descripcion}>
            Hotel Luna Serena es un refugio de lujo ubicado en el corazón de Mar del Plata. 
            Desde 1990, hemos brindado experiencias inolvidables a nuestros huéspedes, 
            combinando elegancia clásica con comodidades modernas.
          </Text>
          <Text style={estilos.descripcion}>
            Nuestro compromiso es ofrecer un servicio excepcional y hacer que cada estadía 
            sea memorable, ya sea por negocios o placer.
          </Text>
        </View>

        {/* Servicios */}
        <View style={estilos.seccion}>
          <Text style={estilos.seccionTitulo}>Nuestros Servicios</Text>
          <View style={estilos.serviciosGrid}>
            {servicios.map((servicio, index) => (
              <View key={index} style={estilos.servicioCard}>
                <View style={estilos.servicioIcono}>
                  <MaterialCommunityIcons name={servicio.icono} size={28} color={COLORES.primario} />
                </View>
                <Text style={estilos.servicioTitulo}>{servicio.titulo}</Text>
                <Text style={estilos.servicioDescripcion}>{servicio.descripcion}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Horarios */}
        <View style={estilos.seccion}>
          <Text style={estilos.seccionTitulo}>Horarios</Text>
          <View style={estilos.horarioItem}>
            <MaterialCommunityIcons name="login" size={24} color={COLORES.primario} />
            <View style={estilos.horarioInfo}>
              <Text style={estilos.horarioTitulo}>Check-in</Text>
              <Text style={estilos.horarioHora}>{HOTEL_INFO.horarioCheckIn}</Text>
            </View>
          </View>
          <View style={estilos.horarioItem}>
            <MaterialCommunityIcons name="logout" size={24} color={COLORES.primario} />
            <View style={estilos.horarioInfo}>
              <Text style={estilos.horarioTitulo}>Check-out</Text>
              <Text style={estilos.horarioHora}>{HOTEL_INFO.horarioCheckOut}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const estilos = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    padding: DIMENSIONES.paddingLarge,
    backgroundColor: COLORES.fondoBlanco,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  hotelNombre: {
    fontSize: TIPOGRAFIA.fontSizeHeading,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
    marginBottom: 8,
  },
  calificacionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  calificacion: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
  },
  seccion: {
    padding: DIMENSIONES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
  },
  seccionTitulo: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 16,
  },
  descripcion: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoMedio,
    lineHeight: TIPOGRAFIA.lineHeightMedium,
    marginBottom: 12,
  },
  serviciosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  servicioCard: {
    width: '48%',
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    alignItems: 'center',
  },
  servicioIcono: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORES.primario + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  servicioTitulo: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
    marginBottom: 4,
    textAlign: 'center',
  },
  servicioDescripcion: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    textAlign: 'center',
  },
  horarioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    marginBottom: 12,
    gap: 12,
  },
  horarioInfo: {
    flex: 1,
  },
  horarioTitulo: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
  },
  horarioHora: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoMedio,
  },
});

export default AcercaDeScreen;