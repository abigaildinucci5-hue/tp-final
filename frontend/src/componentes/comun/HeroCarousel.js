// frontend/src/componentes/comun/HeroCarousel.js
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';

const SCREEN_WIDTH = Dimensions.get('window').width;

const HeroCarousel = ({ slides = [], onSlidePress = () => {} }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef(null);

  const defaultSlides = [
    {
      image: require('../../assets/images/placeholder-habitacion.png'),
      smallText: 'BIENVENIDO A',
      title: 'Hotel Luna Serena',
      description: 'Experimenta lujo, confort y elegancia en cada detalle',
    },
    {
      image: require('../../assets/images/placeholder-habitacion.png'),
      smallText: 'DESCUBRE',
      title: 'Habitaciones Premium',
      description: 'Espacios diseñados para tu máximo confort y descanso',
    },
    {
      image: require('../../assets/images/placeholder-habitacion.png'),
      smallText: 'EXPERIMENTA',
      title: 'Servicios de Lujo',
      description: 'Atención personalizada y servicios exclusivos para ti',
    },
  ];

  const dataSlides = slides && slides.length > 0 ? slides : defaultSlides;

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentSlide(currentIndex);
  };

  const goToSlide = (index) => {
    scrollViewRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
  };

  return (
    <View style={styles.heroCarouselContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {dataSlides.map((slide, index) => (
          <View key={index} style={styles.slideContainer}>
            <ImageBackground
              source={typeof slide.image === 'string' ? { uri: slide.image } : slide.image}
              style={styles.slideImage}
              imageStyle={{ resizeMode: 'cover' }}
            >
              <LinearGradient
                colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)']}
                style={styles.slideOverlay}
              >
                <View style={styles.slideContent}>
                  <Text style={styles.slideSmallText}>{slide.smallText}</Text>
                  <View style={styles.goldDivider} />
                  <Text style={styles.slideTitleText}>{slide.title}</Text>
                  <Text style={styles.slideDescriptionText}>{slide.description}</Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>

      {/* Indicadores de página */}
      <View style={styles.paginationContainer}>
        {dataSlides.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              currentSlide === index && styles.paginationDotActive,
            ]}
            onPress={() => goToSlide(index)}
            activeOpacity={0.7}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroCarouselContainer: {
    height: 420,
    backgroundColor: COLORES.negroElegante,
    position: 'relative',
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    height: 420,
  },
  slideImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideOverlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  slideContent: {
    alignItems: 'center',
    width: '100%',
  },
  slideSmallText: {
    fontFamily: 'montserrat_300light',
    fontSize: 14,
    color: COLORES.blanco,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 15,
    fontWeight: '300',
  },
  goldDivider: {
    width: 50,
    height: 2,
    backgroundColor: COLORES.dorado,
    marginVertical: 15,
  },
  slideTitleText: {
    fontFamily: 'merriweather_700bold',
    fontSize: 36,
    color: COLORES.blanco,
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '700',
  },
  slideDescriptionText: {
    fontFamily: 'montserrat_300light',
    fontSize: 15,
    color: COLORES.grisClaro,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 30,
    fontWeight: '300',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    height: 8,
    backgroundColor: COLORES.dorado,
  },
});

export default HeroCarousel;
