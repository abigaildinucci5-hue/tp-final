// frontend/src/componentes/comun/Footer.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Footer = ({ navigation }) => {
  const handlePhoneCall = () => {
    Linking.openURL('tel:+54223123456');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:info@hotellunaserena.com');
  };

  const handleFacebook = () => {
    Linking.openURL('https://facebook.com');
  };

  const handleInstagram = () => {
    Linking.openURL('https://instagram.com');
  };

  const handleTwitter = () => {
    Linking.openURL('https://twitter.com');
  };

  const handleRecharge = () => {
    // En React Native recargar simplemente significa navegar a Home
    // En web sería window.location.reload()
    if (Platform.OS === 'web') {
      window.location.reload();
    } else {
      // Navegar a Home para "recargar"
      if (navigation) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    }
  };

  return (
    <View style={styles.footerWrapper}>
      {/* SECCIÓN PRINCIPAL - 3 COLUMNAS */}
      <View style={styles.footerContainer}>
        
        {/* COLUMNA 1: RESERVA AHORA */}
        <View style={[styles.footerColumn, { width: COLUMN_WIDTH }]}>
          <Text style={styles.footerTitle}>Reserva Ahora</Text>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={handlePhoneCall}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="phone-outline"
              size={18}
              color={COLORES.dorado}
            />
            <Text style={styles.contactText}>+54 223 123-4567</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={handleEmail}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="email-outline"
              size={18}
              color={COLORES.dorado}
            />
            <Text style={styles.contactText} numberOfLines={1} ellipsizeMode="middle" selectable={true}>
              info@hotellunaserena.com
            </Text>
          </TouchableOpacity>
          
          <View style={styles.contactItem}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={18}
              color={COLORES.dorado}
            />
            <Text style={styles.contactText}>Mar del Plata, Argentina</Text>
          </View>
          
          {/* Redes Sociales */}
          <View style={styles.socialIconsRow}>
            <TouchableOpacity 
              style={styles.socialIcon}
              onPress={handleFacebook}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="facebook"
                size={20}
                color={COLORES.textoOscuro}
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialIcon}
              onPress={handleInstagram}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="instagram"
                size={20}
                color={COLORES.textoOscuro}
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialIcon}
              onPress={handleTwitter}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="twitter"
                size={20}
                color={COLORES.textoOscuro}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* COLUMNA 2: ENLACES RÁPIDOS */}
        <View style={[styles.footerColumn, { width: COLUMN_WIDTH }]}>
          <Text style={styles.footerTitle}>Enlaces Rápidos</Text>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={14}
              color={COLORES.dorado}
            />
            <Text style={styles.linkText}>Inicio</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => navigation.navigate('ListaHabitaciones')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={14}
              color={COLORES.dorado}
            />
            <Text style={styles.linkText}>Habitaciones</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => navigation.navigate('MisReservas')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={14}
              color={COLORES.dorado}
            />
            <Text style={styles.linkText}>Mis Reservas</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => navigation.navigate('Contacto')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={14}
              color={COLORES.dorado}
            />
            <Text style={styles.linkText}>Contacto</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => navigation.navigate('AcercaDe')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={14}
              color={COLORES.dorado}
            />
            <Text style={styles.linkText}>Sobre Nosotros</Text>
          </TouchableOpacity>
        </View>

        {/* COLUMNA 3: HOTEL LUNA SERENA + ¿POR QUÉ ELEGIRNOS? */}
        <View style={[styles.footerColumn, { width: COLUMN_WIDTH }]}>
          <TouchableOpacity 
            style={styles.hotelTitleContainer}
            onPress={handleRecharge}
            activeOpacity={0.7}
          >
            <Text style={styles.footerTitle}>Hotel Luna Serena</Text>
          </TouchableOpacity>
          
          <Text style={styles.hotelDescription}>
            Experimenta lujo y confort en el corazón de Mar del Plata. Nuestro hotel ofrece habitaciones elegantes y servicios de primera clase.
          </Text>
          
          {/* ¿POR QUÉ ELEGIRNOS? - MOVIDA AQUÍ DESDE HOMESCREEN */}
          <View style={styles.whyChooseSection}>
            <View style={styles.featureRow}>
              <MaterialCommunityIcons
                name="star-outline"
                size={16}
                color={COLORES.dorado}
              />
              <Text style={styles.featureText}>Excelente servicio</Text>
            </View>
            
            <View style={styles.featureRow}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={16}
                color={COLORES.dorado}
              />
              <Text style={styles.featureText}>100% seguro</Text>
            </View>
            
            <View style={styles.featureRow}>
              <MaterialCommunityIcons
                name="phone-outline"
                size={16}
                color={COLORES.dorado}
              />
              <Text style={styles.featureText}>Soporte 24/7</Text>
            </View>
          </View>
        </View>
      </View>

      {/* BARRA DE COPYRIGHT */}
      <View style={styles.copyrightBar}>
        <View style={styles.copyrightContainer}>
          <Text style={styles.copyrightText}>
            © 2026 Hotel Luna Serena. Todos los derechos reservados.
          </Text>
          
          <View style={styles.copyrightLinks}>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.copyrightLink}>Términos</Text>
            </TouchableOpacity>
            <Text style={styles.separator}> | </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.copyrightLink}>Privacidad</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerWrapper: {
    backgroundColor: COLORES.blanco,
    borderTopWidth: 1,
    borderTopColor: COLORES.grisBorde,
    width: '100%',
  },
  
  footerContainer: {
    flexDirection: 'row',
    paddingVertical: 50,
    paddingHorizontal: 40,
    gap: 30,
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  
  footerColumn: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  
  // TÍTULOS DE COLUMNAS
  footerTitle: {
    fontFamily: 'merriweather_700bold',
    fontSize: 16,
    color: COLORES.textoOscuro,
    marginBottom: 20,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontWeight: '700',
  },

  hotelTitleContainer: {
    paddingBottom: 10,
  },
  
  // COLUMNA 1: CONTACTO
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  
  contactText: {
    fontFamily: 'montserrat_400regular',
    fontSize: 13,
    color: COLORES.grisOscuro,
    lineHeight: 20,
    fontWeight: '400',
    flex: 1,
  },
  
  socialIconsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  
  socialIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORES.grisClaro,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORES.grisBorde,
  },
  
  // COLUMNA 2: ENLACES
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  
  linkText: {
    fontFamily: 'montserrat_400regular',
    fontSize: 13,
    color: COLORES.grisOscuro,
    lineHeight: 20,
    fontWeight: '400',
  },
  
  // COLUMNA 3: DESCRIPCIÓN + ¿POR QUÉ ELEGIRNOS?
  hotelDescription: {
    fontFamily: 'montserrat_300light',
    fontSize: 12,
    color: COLORES.textoMedio,
    lineHeight: 18,
    marginBottom: 15,
    fontWeight: '300',
  },
  
  whyChooseSection: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORES.grisBorde,
  },
  
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  
  featureText: {
    fontFamily: 'montserrat_400regular',
    fontSize: 12,
    color: COLORES.grisOscuro,
    fontWeight: '400',
  },
  
  // BARRA DE COPYRIGHT
  copyrightBar: {
    backgroundColor: COLORES.grisClaro,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderTopWidth: 1,
    borderTopColor: COLORES.grisBorde,
    width: '100%',
  },
  
  copyrightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  
  copyrightText: {
    fontFamily: 'montserrat_300light',
    fontSize: 11,
    color: COLORES.textoMedio,
    fontWeight: '300',
    flex: 1,
  },
  
  copyrightLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  copyrightLink: {
    fontFamily: 'montserrat_400regular',
    fontSize: 11,
    color: COLORES.textoMedio,
    fontWeight: '400',
  },
  
  separator: {
    fontFamily: 'montserrat_300light',
    fontSize: 11,
    color: COLORES.grisClaro,
    marginHorizontal: 5,
    fontWeight: '300',
  },
});

export default Footer;
