// frontend/src/componentes/habitaciones/ListaHabitaciones.js
import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import CardHabitacionRN from './CardHabitacionRN';
import Loading from '../comun/Loading';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA } from '../../constantes/estilos';

const ListaHabitaciones = ({
  habitaciones,
  loading,
  onHabitacionPress,
  onFavoritoPress,
  favoritos = [],
  onRefresh,
  refreshing = false,
  onEndReached,
  ListEmptyComponent,
}) => {
  if (loading && habitaciones.length === 0) {
    return <Loading />;
  }

  const renderItem = ({ item }) => (
    <CardHabitacionRN
      habitacion={item}
      onPress={() => onHabitacionPress && onHabitacionPress(item)}
      onFavorito={onFavoritoPress}
      esFavorito={favoritos.includes(item.id_habitacion || item.id)}
    />
  );

  const renderEmpty = () => {
    if (ListEmptyComponent) {
      return ListEmptyComponent;
    }

    return (
      <View style={estilos.emptyContainer}>
        <Text style={estilos.emptyText}>No se encontraron habitaciones</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={habitaciones}
      renderItem={renderItem}
      keyExtractor={(item) => (item.id_habitacion || item.id).toString()}
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={estilos.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const estilos = StyleSheet.create({
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoMedio,
  },
});

export default ListaHabitaciones;