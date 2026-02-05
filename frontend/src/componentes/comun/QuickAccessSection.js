// frontend/src/componentes/comun/QuickAccessSection.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';

const QuickAccessSection = ({
  onContactPress = () => {},
  onLocationPress = () => {},
  additionalCards = [],
}) => {
  return (
    <View style={styles.quickAccessSection}>
      <View style={styles.quickAccessGrid}>
        {/* Tarjeta Contacto */}
        <TouchableOpacity
          style={styles.modernAccessCard}
          onPress={onContactPress}
          activeOpacity={0.85}
        >
          <View style={styles.accessCardIconContainer}>
            <MaterialCommunityIcons
              name="phone-outline"
              size={32}
              color={COLORES.dorado}
            />
          </View>
          <View style={styles.accessCardDivider} />
          <Text style={styles.accessCardTitle}>Contacto</Text>
          <Text style={styles.accessCardSubtitle}>Estamos para ayudarte</Text>
        </TouchableOpacity>

        {/* Tarjeta Ubicación */}
        <TouchableOpacity
          style={styles.modernAccessCard}
          onPress={onLocationPress}
          activeOpacity={0.85}
        >
          <View style={styles.accessCardIconContainer}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={32}
              color={COLORES.dorado}
            />
          </View>
          <View style={styles.accessCardDivider} />
          <Text style={styles.accessCardTitle}>Ubicación</Text>
          <Text style={styles.accessCardSubtitle}>Encuéntranos fácilmente</Text>
        </TouchableOpacity>
      </View>

      {/* Tarjetas adicionales si existen */}
      {additionalCards && additionalCards.length > 0 && (
        <View style={styles.additionalCardsGrid}>
          {additionalCards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={styles.modernAccessCard}
              onPress={card.onPress}
              activeOpacity={0.85}
            >
              <View style={styles.accessCardIconContainer}>
                <MaterialCommunityIcons
                  name={card.icon}
                  size={32}
                  color={COLORES.dorado}
                />
              </View>
              <View style={styles.accessCardDivider} />
              <Text style={styles.accessCardTitle}>{card.title}</Text>
              <Text style={styles.accessCardSubtitle}>{card.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  quickAccessSection: {
    paddingHorizontal: DIMENSIONES.padding,
    paddingVertical: DIMENSIONES.padding,
    backgroundColor: COLORES.grisClaro,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  additionalCardsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 15,
    flexWrap: 'wrap',
  },
  modernAccessCard: {
    flex: 1,
    backgroundColor: COLORES.blanco,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORES.grisBorde,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  accessCardIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORES.doradoMuyClaro,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  accessCardDivider: {
    width: 30,
    height: 1.5,
    backgroundColor: COLORES.dorado,
    marginBottom: 15,
  },
  accessCardTitle: {
    fontFamily: 'merriweather_700bold',
    fontSize: 16,
    color: COLORES.textoOscuro,
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '700',
  },
  accessCardSubtitle: {
    fontFamily: 'montserrat_300light',
    fontSize: 12,
    color: COLORES.textoMedio,
    textAlign: 'center',
    fontWeight: '300',
  },
});

export default QuickAccessSection;
