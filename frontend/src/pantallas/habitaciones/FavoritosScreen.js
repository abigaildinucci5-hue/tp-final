// frontend/src/pantallas/habitaciones/FavoritosScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, ESTILOS_GLOBALES } from '../../constantes/estilos';
import { useAuth } from '../../contexto/AuthContext';
import { obtenerFavoritos } from '../../utils/storage';
import ListaHabitaciones from '../../componentes/habitaciones/ListaHabitaciones';
import HeaderApp from '../../componentes/comun/HeaderApp';
import Loading from '../../componentes/comun/Loading';

const FavoritosScreen = ({ navigation }) => {
  const { isAuthenticated } = useAuth();
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Proteger acceso: redirigir si es invitado
  useEffect(() => {
    if (!isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth', params: { screen: 'Login' } }],
      });
    }
  }, [isAuthenticated, navigation]);

  useEffect(() => {
    cargarFavoritos();
  }, []);

  const cargarFavoritos = async () => {
    setLoading(true);
    const favs = await obtenerFavoritos();
    setFavoritos([]);
    setLoading(false);
  };

  const handleHabitacionPress = (habitacion) => {
    navigation.navigate('DetalleHabitacion', { habitacionId: habitacion.id });
  };

  const renderEmpty = () => (
    <View style={estilos.emptyContainer}>
      <MaterialCommunityIcons name="heart-outline" size={80} color={COLORES.textoClaro} />
      <Text style={estilos.emptyTitulo}>Sin Favoritos</Text>
      <Text style={estilos.emptyTexto}>
        Aún no has agregado habitaciones a tus favoritos
      </Text>
    </View>
  );

  if (!isAuthenticated) {
    return <Loading />;
  }

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Mis Favoritos"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      <ListaHabitaciones
        habitaciones={favoritos}
        loading={loading}
        onHabitacionPress={handleHabitacionPress}
        onRefresh={cargarFavoritos}
        ListEmptyComponent={renderEmpty()}
      />
    </View>
  );
};

const estilos = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitulo: {
    fontSize: TIPOGRAFIA.fontSizeHeading,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyTexto: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoMedio,
    textAlign: 'center',
  },
});

export default FavoritosScreen;