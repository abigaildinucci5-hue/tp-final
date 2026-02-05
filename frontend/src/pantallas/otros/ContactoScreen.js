// frontend/src/pantallas/otros/ContactoScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import { HOTEL_INFO } from '../../constantes/config';
import HeaderApp from '../../componentes/comun/HeaderApp';

const ContactoScreen = ({ navigation }) => {
  const handleLlamar = () => {
    Linking.openURL(`tel:${HOTEL_INFO.telefono}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${HOTEL_INFO.email}`);
  };

  const handleWeb = () => {
    Linking.openURL(`https://${HOTEL_INFO.sitioWeb}`);
  };

  const handleMapa = () => {
    navigation.navigate('Mapa');
  };

  const contactoOpciones = [
    {
      icono: 'phone',
      titulo: 'Teléfono',
      valor: HOTEL_INFO.telefono,
      accion: handleLlamar,
    },
    {
      icono: 'email',
      titulo: 'Email',
      valor: HOTEL_INFO.email,
      accion: handleEmail,
    },
    {
      icono: 'web',
      titulo: 'Sitio Web',
      valor: HOTEL_INFO.sitioWeb,
      accion: handleWeb,
    },
    {
      icono: 'map-marker',
      titulo: 'Dirección',
      valor: HOTEL_INFO.direccion,
      accion: handleMapa,
    },
  ];

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Contacto"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={estilos.container}>
        <View style={estilos.headerContainer}>
          <View style={estilos.iconoContainer}>
            <MaterialCommunityIcons name="chat" size={60} color={COLORES.primario} />
          </View>
          <Text style={estilos.titulo}>¿Necesitas ayuda?</Text>
          <Text style={estilos.subtitulo}>
            Estamos aquí para ayudarte. Contáctanos a través de cualquiera de estos medios.
          </Text>
        </View>

        <View style={estilos.opcionesContainer}>
          {contactoOpciones.map((opcion, index) => (
            <TouchableOpacity
              key={index}
              style={estilos.opcionCard}
              onPress={opcion.accion}
            >
              <View style={estilos.opcionIcono}>
                <MaterialCommunityIcons name={opcion.icono} size={28} color={COLORES.primario} />
              </View>
              <View style={estilos.opcionInfo}>
                <Text style={estilos.opcionTitulo}>{opcion.titulo}</Text>
                <Text style={estilos.opcionValor}>{opcion.valor}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={COLORES.textoMedio} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={estilos.horarioContainer}>
          <Text style={estilos.horarioTitulo}>Horario de Atención</Text>
          <Text style={estilos.horarioTexto}>Lunes a Viernes: 9:00 - 18:00</Text>
          <Text style={estilos.horarioTexto}>Sábados: 9:00 - 13:00</Text>
          <Text style={estilos.horarioTexto}>Domingos: Cerrado</Text>
          <Text style={estilos.horarioNota}>
            * Para emergencias, llamar al número de teléfono disponible 24/7
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    padding: DIMENSIONES.paddingLarge,
  },
  iconoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORES.primario + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: TIPOGRAFIA.fontSizeHeading,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoMedio,
    textAlign: 'center',
    lineHeight: TIPOGRAFIA.lineHeightMedium,
  },
  opcionesContainer: {
    padding: DIMENSIONES.padding,
    gap: 12,
  },
  opcionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    gap: 12,
  },
  opcionIcono: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORES.primario + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  opcionInfo: {
    flex: 1,
  },
  opcionTitulo: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    marginBottom: 4,
  },
  opcionValor: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
  },
  horarioContainer: {
    padding: DIMENSIONES.padding,
    backgroundColor: COLORES.fondoGris,
    margin: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
  },
  horarioTitulo: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 12,
  },
  horarioTexto: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoMedio,
    marginBottom: 6,
  },
  horarioNota: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoClaro,
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default ContactoScreen;