// frontend/src/pantallas/otros/OnboardingScreen.js
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';
import Boton from '../../componentes/comun/Boton';
import { marcarOnboardingCompletado } from '../../utils/storage';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const slides = [
    {
      id: '1',
      title: 'Bienvenido a Hotel Luna Serena',
      description: 'Descubre el mejor lugar para tu estadía perfecta',
      image: require('../../assets/imagenes/onboarding-1.png'),
    },
    {
      id: '2',
      title: 'Reserva Fácilmente',
      description: 'Encuentra y reserva habitaciones en segundos',
      image: require('../../assets/imagenes/onboarding-2.png'),
    },
    {
      id: '3',
      title: 'Disfruta tu Estadía',
      description: 'Relájate y disfruta de nuestros servicios exclusivos',
      image: require('../../assets/imagenes/onboarding-3.png'),
    },
  ];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = async () => {
    await marcarOnboardingCompletado();
    navigation.replace('Auth');
  };

  const renderItem = ({ item }) => (
    <View style={estilos.slide}>
      <Image source={item.image} style={estilos.image} resizeMode="contain" />
      <Text style={estilos.title}>{item.title}</Text>
      <Text style={estilos.description}>{item.description}</Text>
    </View>
  );

  const renderDots = () => (
    <View style={estilos.dotsContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            estilos.dot,
            index === currentIndex && estilos.dotActive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={estilos.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {renderDots()}

      <View style={estilos.buttonsContainer}>
        {currentIndex < slides.length - 1 ? (
          <>
            <Boton variant="text" onPress={handleSkip} style={estilos.skipButton}>
              Saltar
            </Boton>
            <Boton onPress={handleNext} style={estilos.nextButton}>
              Siguiente
            </Boton>
          </>
        ) : (
          <Boton onPress={handleFinish} fullWidth>
            Comenzar
          </Boton>
        )}
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORES.fondoBlanco,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DIMENSIONES.paddingLarge,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 40,
  },
  title: {
    fontSize: TIPOGRAFIA.fontSizeHeading,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoMedio,
    textAlign: 'center',
    lineHeight: TIPOGRAFIA.lineHeightMedium,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORES.textoClaro,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: COLORES.primario,
    width: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    padding: DIMENSIONES.paddingLarge,
    gap: 12,
  },
  skipButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
});

export default OnboardingScreen;