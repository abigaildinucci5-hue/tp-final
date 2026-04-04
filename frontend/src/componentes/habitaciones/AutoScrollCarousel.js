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
import { obtenerImagenHabitacion } from '../../constantes/imagenes';
// Definir CARD_WIDTH igual que en CarruselHabitaciones.js
const getScreenWidth = () => Dimensions.get('window').width;
const getIsMobile = () => getScreenWidth() < 768;

// Responsive: recalcular en resize
let initialWidth = getScreenWidth();
let initialIsMobile = getIsMobile();

const AutoScrollCarousel = ({
  habitaciones = [],
  loading = false,
  onRoomPress = () => {},
  onViewAllPress = () => {},
  title = 'HABITACIONES DESTACADAS',
  autoScrollInterval = 6000, // 6 segundos por defecto, más suave
}) => {
  const [screenWidth, setScreenWidth] = React.useState(initialWidth);
  const [isMobile, setIsMobile] = React.useState(initialIsMobile);
  const scrollViewRef = useRef(null);
  const currentIndexRef = useRef(0);
  const scrollIntervalRef = useRef(null);

  // Card width: 100% en mobile, 45% en desktop
  const CARD_WIDTH = isMobile ? screenWidth : Math.round(screenWidth * 0.45);

  React.useEffect(() => {
    const onChange = () => {
      const w = getScreenWidth();
      setScreenWidth(w);
      setIsMobile(getIsMobile());
    };
    Dimensions.addEventListener('change', onChange);
    return () => Dimensions.removeEventListener('change', onChange);
  }, []);

  // Iniciar auto-scroll más suave
  React.useEffect(() => {
    if (habitaciones.length > 0) {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = setInterval(() => {
        if (scrollViewRef.current && habitaciones.length > 0) {
          currentIndexRef.current = (currentIndexRef.current + 1) % habitaciones.length;
          const offsetBase = currentIndexRef.current * (CARD_WIDTH + 16);
          const offset = isMobile ? offsetBase : 16 + offsetBase;
          scrollViewRef.current.scrollTo({
            x: offset,
            y: 0,
            animated: true,
          });
        }
      }, autoScrollInterval);
    }
    return () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };
  }, [habitaciones.length, CARD_WIDTH, autoScrollInterval, isMobile]);

  const pauseAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    // En desktop agregamos 16px por el margen del primer elemento
    const offset = isMobile ? contentOffsetX : contentOffsetX - 16;
    currentIndexRef.current = Math.round(Math.max(0, offset) / (CARD_WIDTH + 16));
  };

    const handleNavigateToDetail = (habitacion) => {
  console.log("CLICK HABITACION:");
  console.log("numero:", habitacion.numero_habitacion);
  console.log("id:", habitacion.id);
  console.log("id_habitacion:", habitacion.id_habitacion);

  onRoomPress(habitacion);
};

  // Funciones para navegación manual
  const goToPrevious = () => {
    if (scrollViewRef.current) {
      currentIndexRef.current = Math.max(0, currentIndexRef.current - 1);
      const offsetBase = currentIndexRef.current * (CARD_WIDTH + 16);
      const offset = isMobile ? offsetBase : 16 + offsetBase;
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
      const offsetBase = currentIndexRef.current * (CARD_WIDTH + 16);
      const offset = isMobile ? offsetBase : 16 + offsetBase;
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
        {/* Flecha izquierda */}
        {currentIndexRef.current > 0 && !isMobile && ( // <--- Agregamos !isMobile
          <TouchableOpacity
            style={[styles.arrowButton, styles.arrowButtonLeft]}
            onPress={goToPrevious}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="chevron-left" size={32} color={COLORES.dorado} />
          </TouchableOpacity>
        )}

        {/* ScrollView del Carousel */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled={isMobile}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          style={[styles.carouselScroll, { width: screenWidth }]}
          contentContainerStyle={{ 
            width: isMobile 
              ? (CARD_WIDTH + 16) * habitaciones.length 
              : (CARD_WIDTH + 16) * habitaciones.length + 16, 
            alignItems: 'stretch'
          }}
          decelerationRate={isMobile ? 'fast' : 0.98}
          snapToInterval={isMobile ? CARD_WIDTH : undefined}
          snapToAlignment={isMobile ? 'start' : undefined}
        >
          {habitaciones.map((habitacion, index) => (
            <TouchableOpacity
              key={habitacion.id_habitacion || habitacion.id}
              onPress={() => handleNavigateToDetail(habitacion)}
              activeOpacity={0.8}
              style={[
                styles.roomCard,
                {
                  width: CARD_WIDTH,
                  height: isMobile ? 380 : 400,
                  marginRight: 16,
                  marginLeft: !isMobile && index === 0 ? 16 : 0,
                  borderRadius: 18,
                },
              ]}
            >
              <ImageBackground
                source={{ uri: habitacion.imagen_principal || '...' }}
                style={{ flex: 1, justifyContent: 'flex-end' }} // <--- Esto empuja todo abajo
                imageStyle={{ borderRadius: 18 }}
              >
                <View style={styles.overlay} />
  
                {/* El Badge lo mantenemos arriba usando posición absoluta */}
                <View style={[styles.badgeContainer, { position: 'absolute', top: 16, left: 16 }]}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {habitacion.tipo_habitacion || 'Habitación'}
                    </Text>
                  </View>
                </View>

                {/* Contenedor de Info: ahora es una franja pegada al fondo */}
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
                      <Text style={styles.priceValue}>${habitacion.precio_base}</Text>
                      <Text style={styles.priceUnit}>/noche</Text>
                    </View>
                  </View>
    
                  {/* Features - Solo si hay espacio o es Admin */}
                  <View style={styles.featuresRow}>
                    <View style={styles.feature}>
                        <MaterialCommunityIcons name="account-group" size={14} color={COLORES.blanco} />
                        <Text style={styles.featureText}>{habitacion.capacidad_personas}</Text>
                    </View>
                    <View style={[styles.feature, { backgroundColor: habitacion.estado === 'disponible' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)' }]}>
                        <Text style={[styles.featureText, { color: habitacion.estado === 'disponible' ? '#2ECC71' : '#E74C3C' }]}>
                          {habitacion.estado === 'disponible' ? 'Disponible' : 'Ocupada'}
                        </Text>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Flecha derecha - solo web */}
        <TouchableOpacity
          style={[
            styles.arrowButton, 
            styles.arrowButtonRight,
            currentIndexRef.current >= habitaciones.length - 1 && styles.arrowButtonDisabled,
            isMobile && { display: 'none' }
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
    flex: 1,
  },
  carouselContent: {
    paddingRight: DIMENSIONES.padding,
  },
  roomCard: {
    backgroundColor: COLORES.blanco,
    elevation: 5,
    shadowColor: COLORES.negro,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  roomCardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    padding: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // Degradado sutil para que el texto resalte más
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Un toque más oscuro mejora la legibilidad
    paddingHorizontal: 16,
    paddingVertical: 14, // Más aire vertical para que no se corte el precio
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    width: '100%',
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Alineado al centro para que el precio no suba mucho
    marginBottom: 8,
  },
  priceBox: {
    alignItems: 'flex-end',
    minWidth: 80, // Le damos un ancho mínimo para que el precio no se amontone
  },
  priceValue: {
    fontSize: 20, // Un tamaño imponente pero controlado
    fontFamily: TIPOGRAFIA.fontMontserratBold,
    color: COLORES.dorado,
    lineHeight: 24, // Evita que se corte por arriba o abajo
  },
  roomNumber: {
    fontSize: 18,
    fontFamily: TIPOGRAFIA.fontMerriweatherBold,
    color: COLORES.blanco,
    marginBottom: 2,
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
    fontSize: 20,
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    gap: 4,
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
