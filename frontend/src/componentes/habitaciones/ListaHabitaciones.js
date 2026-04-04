// frontend/src/componentes/habitaciones/ListaHabitaciones.js
import React from 'react';
import { FlatList, View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import CardHabitacionRN from './CardHabitacionRN';
import Loading from '../comun/Loading';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA } from '../../constantes/estilos';

// ✅ Declarada al inicio del módulo, antes de cualquier uso
const isWeb = Platform.OS === 'web';

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
  ListHeaderComponent,
  ListFooterComponent,
}) => {
  const screenWidth = Dimensions.get('window').width;
  // Siempre 1 columna en mobile, 3 en web ancho
  const numColumnas = isWeb && screenWidth > 768 ? 3 : 1;

  if (loading && habitaciones.length === 0) {
    return <Loading />;
  }

  const renderItem = ({ item }) => (
    <View style={numColumnas === 1 ? estilos.itemContainerMobile : estilos.itemContainer}>
      <CardHabitacionRN
        habitacion={item}
        onPress={() => onHabitacionPress && onHabitacionPress(item)}
        onFavorito={onFavoritoPress}
        esFavorito={favoritos.includes(item.id_habitacion || item.id)}
      />
    </View>
  );

  const renderEmpty = () => {
    if (ListEmptyComponent) return ListEmptyComponent;
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
      keyExtractor={(item) => (item.id_habitacion || item.id || Math.random()).toString()}
      numColumns={numColumnas}
      key={`list-cols-${numColumnas}`}
      columnWrapperStyle={isWeb && numColumnas > 1 ? estilos.columnWrapper : undefined}
      style={estilos.lista}
      contentContainerStyle={[
        estilos.listContent,
        isWeb && { maxWidth: 1200, alignSelf: 'center' },
      ]}
      showsVerticalScrollIndicator={false}
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={renderEmpty}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
    />
  );
};

const estilos = StyleSheet.create({
  lista: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
    width: '100%',
  },
  // ✅ Mobile: ocupa todo el ancho disponible
  itemContainerMobile: {
    width: '100%',
  },
  // Web: un tercio del ancho
  itemContainer: {
    flex: 1 / 3,
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
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