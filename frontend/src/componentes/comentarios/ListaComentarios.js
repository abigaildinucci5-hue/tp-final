// frontend/src/componentes/comentarios/ListaComentarios.js
import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import CardComentario from './CardComentario';
import Loading from '../comun/Loading';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA } from '../../constantes/estilos';

const ListaComentarios = ({
  comentarios,
  loading,
  onRefresh,
  refreshing = false,
  ListHeaderComponent,
  ListEmptyComponent,
}) => {
  if (loading && comentarios.length === 0) {
    return <Loading />;
  }

  const renderItem = ({ item }) => <CardComentario comentario={item} />;

  const renderEmpty = () => {
    if (ListEmptyComponent) {
      return ListEmptyComponent;
    }

    return (
      <View style={estilos.emptyContainer}>
        <Text style={estilos.emptyText}>No hay comentarios aún</Text>
        <Text style={estilos.emptySubtext}>
          Sé el primero en dejar una reseña
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={comentarios}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListHeaderComponent={ListHeaderComponent}
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
  },
});

export default ListaComentarios;