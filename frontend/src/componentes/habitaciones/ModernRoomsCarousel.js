// frontend/src/componentes/habitaciones/ModernRoomsCarousel.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.75;

const ModernRoomsCarousel = ({
  habitaciones = [],
  loading = false,
  onRoomPress = () => {},
  onViewAllPress = () => {},
  title = 'NUESTRAS HABITACIONES',
}) => {
  const handleNavigateToDetail = (habitacion) => {
    if (habitacion.id_habitacion || habitacion.id) {
      onRoomPress(habitacion);
    }
  };

  return (
    <View style={styles.roomsSectionContainer}>
      {/* Header de la sección */}
      <View style={styles.roomsSectionHeader}>
        <View style={styles.roomsTitleContainer}>
          <Text style={styles.roomsSectionTitle}>{title}</Text>
          <View style={styles.goldUnderline} />
        </View>

        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={onViewAllPress}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>Ver Todas</Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={16}
            color={COLORES.dorado}
          />
        </TouchableOpacity>
      </View>

      {/* Carrusel */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={COLORES.dorado}
          />
        </View>
      ) : habitaciones && habitaciones.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.roomsCarouselContent}
          snapToInterval={CARD_WIDTH + 20}
          decelerationRate="fast"
          scrollEventThrottle={16}
        >
          {habitaciones.map((habitacion, index) => (
            <TouchableOpacity
              key={habitacion.id_habitacion || habitacion.id || index}
              style={styles.modernRoomCard}
              onPress={() => handleNavigateToDetail(habitacion)}
              activeOpacity={0.9}
            >
              {/* Imagen de fondo */}
              <ImageBackground
                source={{
                  uri:
                    habitacion.imagen_principal ||
                    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
                }}
                style={styles.roomCardImage}
                imageStyle={styles.roomCardImageStyle}
                resizeMode="cover"
              >
                {/* Badge de disponibilidad */}
                {habitacion.estado === 'disponible' && (
                  <View style={styles.availableBadge}>
                    <Text style={styles.availableBadgeText}>DISPONIBLE</Text>
                  </View>
                )}
              </ImageBackground>

              {/* Contenido de la tarjeta */}
              <View style={styles.roomCardContent}>
                <Text style={styles.roomCardCategory}>
                  {habitacion.tipo_habitacion || 'Estándar'}
                </Text>
                <Text style={styles.roomCardTitle}>
                  Habitación {habitacion.numero_habitacion}
                </Text>

                {/* Información adicional */}
                {habitacion.capacidad_personas && (
                  <View style={styles.roomCardInfo}>
                    <MaterialCommunityIcons
                      name="account-multiple-outline"
                      size={14}
                      color={COLORES.textoMedio}
                    />
                    <Text style={styles.roomCardInfoText}>
                      {habitacion.capacidad_personas} personas
                    </Text>
                  </View>
                )}

                {/* Footer con precio y botón */}
                <View style={styles.roomCardFooter}>
                  <View style={styles.roomCardPrice}>
                    <Text style={styles.priceLabel}>Desde</Text>
                    <Text style={styles.priceAmount}>
                      ${habitacion.precio_base || habitacion.precio_noche || '0'}
                    </Text>
                    <Text style={styles.priceUnit}>/ noche</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => handleNavigateToDetail(habitacion)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.detailsButtonText}>Ver</Text>
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={14}
                      color={COLORES.dorado}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="home-outline"
            size={48}
            color={COLORES.textoMedio}
          />
          <Text style={styles.emptyText}>No hay habitaciones disponibles</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  roomsSectionContainer: {
    backgroundColor: COLORES.blanco,
    marginBottom: DIMENSIONES.padding,
  },
  roomsSectionHeader: {
    paddingHorizontal: DIMENSIONES.padding,
    paddingTop: DIMENSIONES.padding + 10,
    paddingBottom: DIMENSIONES.padding - 5,
    backgroundColor: COLORES.blanco,
  },
  roomsTitleContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  roomsSectionTitle: {
    fontFamily: 'merriweather_700bold',
    fontSize: 24,
    color: COLORES.textoOscuro,
    letterSpacing: 2,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  goldUnderline: {
    width: 60,
    height: 3,
    backgroundColor: COLORES.dorado,
    marginTop: 10,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  viewAllText: {
    fontFamily: 'montserrat_500medium',
    fontSize: 14,
    color: COLORES.dorado,
    letterSpacing: 1,
    fontWeight: '500',
  },
  roomsCarouselContent: {
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  loadingContainer: {
    height: 380,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONES.padding,
  },
  emptyText: {
    marginTop: 12,
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoMedio,
    fontFamily: 'montserrat_400regular',
    fontWeight: '400',
  },
  modernRoomCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORES.blanco,
    borderRadius: 0,
    marginHorizontal: 10,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  roomCardImage: {
    width: '100%',
    height: 280,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 15,
  },
  roomCardImageStyle: {
    // resizeMode is now a prop, not a style
  },
  availableBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 2,
  },
  availableBadgeText: {
    fontFamily: 'montserrat_600semibold',
    fontSize: 10,
    color: COLORES.blanco,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  roomCardContent: {
    padding: 20,
    backgroundColor: COLORES.blanco,
  },
  roomCardCategory: {
    fontFamily: 'montserrat_500medium',
    fontSize: 11,
    color: COLORES.dorado,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontWeight: '500',
  },
  roomCardTitle: {
    fontFamily: 'merriweather_700bold',
    fontSize: 20,
    color: COLORES.textoOscuro,
    marginBottom: 12,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  roomCardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  roomCardInfoText: {
    fontFamily: 'montserrat_300light',
    fontSize: 12,
    color: COLORES.textoMedio,
    fontWeight: '300',
  },
  roomCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  roomCardPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceLabel: {
    fontFamily: 'montserrat_300light',
    fontSize: 11,
    color: COLORES.textoMedio,
    fontWeight: '300',
  },
  priceAmount: {
    fontFamily: 'montserrat_700bold',
    fontSize: 24,
    color: COLORES.textoOscuro,
    fontWeight: '700',
  },
  priceUnit: {
    fontFamily: 'montserrat_300light',
    fontSize: 11,
    color: COLORES.textoMedio,
    fontWeight: '300',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORES.dorado,
  },
  detailsButtonText: {
    fontFamily: 'montserrat_500medium',
    fontSize: 12,
    color: COLORES.dorado,
    letterSpacing: 1,
    fontWeight: '500',
  },
});

export default ModernRoomsCarousel;
