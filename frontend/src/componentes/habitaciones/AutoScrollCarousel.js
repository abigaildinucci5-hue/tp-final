// frontend/src/componentes/habitaciones/AutoScrollCarousel.js
import React, { useEffect, useRef } from 'react';
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
const CARD_WIDTH = SCREEN_WIDTH * 0.55; // Tarjetas más estrechas, menos ancho

const AutoScrollCarousel = ({
  habitaciones = [],
  loading = false,
  onRoomPress = () => {},
  onViewAllPress = () => {},
  title = 'HABITACIONES DESTACADAS',
  autoScrollInterval = 4000, // 4 segundos por defecto
}) => {
  const scrollViewRef = useRef(null);
  const currentIndexRef = useRef(0);
  const scrollIntervalRef = useRef(null);

  // Iniciar auto-scroll
  useEffect(() => {
    if (habitaciones.length > 0) {
      startAutoScroll();
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [habitaciones.length]);

  const startAutoScroll = () => {
    scrollIntervalRef.current = setInterval(() => {
      if (scrollViewRef.current && habitaciones.length > 0) {
        currentIndexRef.current = (currentIndexRef.current + 1) % habitaciones.length;
        const offset = currentIndexRef.current * (CARD_WIDTH + 16);

        scrollViewRef.current.scrollTo({
          x: offset,
          y: 0,
          animated: true,
        });
      }
    }, autoScrollInterval);
  };

  const pauseAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    currentIndexRef.current = Math.round(contentOffsetX / (CARD_WIDTH + 16));
  };

  const handleNavigateToDetail = (habitacion) => {
    if (habitacion.id_habitacion || habitacion.id) {
      onRoomPress(habitacion);
    }
  };

  // Funciones para navegación manual
  const goToPrevious = () => {
    if (scrollViewRef.current) {
      currentIndexRef.current = Math.max(0, currentIndexRef.current - 1);
      const offset = currentIndexRef.current * (CARD_WIDTH + 16);
      scrollViewRef.current.scrollTo({
        x: offset,
        y: 0,
        animated: true,
      });
    }
  };

  const goToNext = () => {
    if (scrollViewRef.current && habitaciones.length > 0) {
      currentIndexRef.current = Math.min(
        habitaciones.length - 1,
        currentIndexRef.current + 1
      );
      const offset = currentIndexRef.current * (CARD_WIDTH + 16);
      scrollViewRef.current.scrollTo({
        x: offset,
        y: 0,
        animated: true,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORES.dorado} />
      </View>
    );
  }

  return (
    <View style={styles.roomsSectionContainer}>
      {/* Header */}
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

      {/* Carousel con flechas */}
      <View style={styles.carouselContainer}>
        {/* Flecha izquierda - siempre visible */}
        <TouchableOpacity
          style={[
            styles.arrowButton, 
            styles.arrowButtonLeft,
            currentIndexRef.current === 0 && styles.arrowButtonDisabled
          ]}
          onPress={goToPrevious}
          activeOpacity={currentIndexRef.current === 0 ? 0.5 : 0.7}
          disabled={currentIndexRef.current === 0}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={currentIndexRef.current === 0 ? '#ccc' : COLORES.dorado}
          />
        </TouchableOpacity>

        {/* ScrollView del Carousel */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onTouchBegin={pauseAutoScroll}
          onTouchEnd={startAutoScroll}
          style={styles.carouselScroll}
          contentContainerStyle={styles.carouselContent}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + 16}
          snapToAlignment="start"
        >
        {habitaciones.map((habitacion) => (
          <TouchableOpacity
            key={habitacion.id_habitacion || habitacion.id}
            onPress={() => handleNavigateToDetail(habitacion)}
            activeOpacity={0.8}
            style={styles.roomCard}
          >
            <ImageBackground
              source={{
                uri:
                  habitacion.imagen_principal ||
                  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
              }}
              style={styles.roomCardImage}
              imageStyle={{ borderRadius: 16 }}
            >
              {/* Overlay degradado */}
              <View style={styles.overlay} />

              {/* Tipo de habitación */}
              <View style={styles.badgeContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {habitacion.tipo_habitacion || 'Habitación'}
                  </Text>
                </View>
              </View>

              {/* Info al pie */}
              <View style={styles.infoContainer}>
                <View style={styles.titlePriceRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.roomNumber}>
                      {habitacion.numero_habitacion || 'N/A'}
                    </Text>
                    <Text style={styles.roomType} numberOfLines={1}>
                      {habitacion.tipo_habitacion || 'Estándar'}
                    </Text>
                  </View>
                  <View style={styles.priceBox}>
                    <Text style={styles.priceValue}>
                      ${habitacion.precio_base || 50}
                    </Text>
                    <Text style={styles.priceUnit}>/noche</Text>
                  </View>
                </View>

                {/* Features */}
                <View style={styles.featuresRow}>
                  <View style={styles.feature}>
                    <MaterialCommunityIcons
                      name="account-multiple"
                      size={16}
                      color={COLORES.blanco}
                    />
                    <Text style={styles.featureText}>
                      {habitacion.capacidad_personas || 2}
                    </Text>
                  </View>
                  <View style={styles.feature}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={16}
                      color={
                        habitacion.estado === 'disponible'
                          ? COLORES.exito
                          : COLORES.error
                      }
                    />
                    <Text style={styles.featureText}>
                      {habitacion.estado === 'disponible'
                        ? 'Disponible'
                        : 'Ocupada'}
                    </Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
        </ScrollView>

        {/* Flecha derecha - siempre visible */}
        <TouchableOpacity
          style={[
            styles.arrowButton, 
            styles.arrowButtonRight,
            currentIndexRef.current >= habitaciones.length - 1 && styles.arrowButtonDisabled
          ]}
          onPress={goToNext}
          activeOpacity={currentIndexRef.current >= habitaciones.length - 1 ? 0.5 : 0.7}
          disabled={currentIndexRef.current >= habitaciones.length - 1}
        >
          <MaterialCommunityIcons
            name="chevron-right"
            size={32}
            color={currentIndexRef.current >= habitaciones.length - 1 ? '#ccc' : COLORES.dorado}
          />
        </TouchableOpacity>
      </View>

      {/* Indicadores de progreso */}
      {habitaciones.length > 0 && (
        <View style={styles.indicatorsContainer}>
          {habitaciones.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentIndexRef.current === index &&
                  styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  roomsSectionContainer: {
    marginVertical: 24,
    paddingHorizontal: DIMENSIONES.padding,
  },
  roomsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  roomsTitleContainer: {
    flex: 1,
  },
  roomsSectionTitle: {
    fontSize: 18,
    fontFamily: TIPOGRAFIA.fontMerriweatherBold,
    color: COLORES.negro,
    marginBottom: 8,
  },
  goldUnderline: {
    height: 3,
    width: 60,
    backgroundColor: COLORES.dorado,
    borderRadius: 2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  viewAllText: {
    fontSize: 13,
    fontFamily: TIPOGRAFIA.fontMontserratMedium,
    color: COLORES.dorado,
    marginRight: 6,
  },
  carouselScroll: {
    marginBottom: 16,
  },
  carouselContent: {
    paddingRight: DIMENSIONES.padding,
  },
  roomCard: {
    width: CARD_WIDTH,
    height: 340, // Más alto que ancho para mejor proporción
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORES.blanco,
    elevation: 5,
    shadowColor: COLORES.negro,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  roomCardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    padding: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  badgeContainer: {
    alignItems: 'flex-start',
  },
  badge: {
    backgroundColor: COLORES.dorado,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: TIPOGRAFIA.fontMontserratBold,
    color: COLORES.blanco,
    textTransform: 'uppercase',
  },
  infoContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 12,
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  roomNumber: {
    fontSize: 16,
    fontFamily: TIPOGRAFIA.fontMerriweatherBold,
    color: COLORES.blanco,
  },
  roomType: {
    fontSize: 12,
    fontFamily: TIPOGRAFIA.fontMontserratRegular,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  priceBox: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: 18,
    fontFamily: TIPOGRAFIA.fontMontserratBold,
    color: COLORES.dorado,
  },
  priceUnit: {
    fontSize: 11,
    fontFamily: TIPOGRAFIA.fontMontserratRegular,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    gap: 6,
  },
  featureText: {
    fontSize: 11,
    fontFamily: TIPOGRAFIA.fontMontserratMedium,
    color: COLORES.blanco,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORES.grisClaro,
  },
  indicatorActive: {
    width: 24,
    backgroundColor: COLORES.dorado,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  arrowButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORES.blanco,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  arrowButtonLeft: {
    position: 'absolute',
    left: 0,
    zIndex: 10,
  },
  arrowButtonRight: {
    position: 'absolute',
    right: 0,
    zIndex: 10,
  },
  arrowButtonDisabled: {
    opacity: 0.5,
  },
});

export default AutoScrollCarousel;
