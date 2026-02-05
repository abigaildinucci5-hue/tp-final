// frontend/src/componentes/reservas/HistorialReservas.js
import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import CardReserva from './CardReserva';
import Loading from '../comun/Loading';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA } from '../../constantes/estilos';

const HistorialReservas = ({
  reservas,
  loading,
  onReservaPress,
  onRefresh,
  refreshing = false,
  ListEmptyComponent,
}) => {
  if (loading && reservas.length === 0) {
    return <Loading />;
  }

  const renderItem = ({ item }) => (
    <CardReserva
      reserva={item}
      onPress={() => onReservaPress && onReservaPress(item)}
    />
  );

  const renderEmpty = () => {
    if (ListEmptyComponent) {
      return ListEmptyComponent;
    }

    return (
      <View style={estilos.emptyContainer}>
        <Text style={estilos.emptyText}>No tienes reservas</Text>
        <Text style={estilos.emptySubtext}>
          Explora nuestras habitaciones y haz tu primera reserva
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={reservas}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      onRefresh={onRefresh}
      refreshing={refreshing}
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
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoMedio,
    textAlign: 'center',
  },
});

export default HistorialReservas;