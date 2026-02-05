// frontend/src/pantallas/perfil/NotificacionesScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import { useNotificaciones } from '../../hooks/useNotificaciones';
import { formatearDesdeAhora } from '../../utils/fechas';
import HeaderApp from '../../componentes/comun/HeaderApp';
import Loading from '../../componentes/comun/Loading';

const NotificacionesScreen = ({ navigation }) => {
  const { notificaciones, loading, cargarNotificaciones, marcarLeida, marcarTodas } = useNotificaciones();

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const renderNotificacion = ({ item }) => (
    <TouchableOpacity
      style={[estilos.notifCard, !item.leida && estilos.notifNoLeida]}
      onPress={() => marcarLeida(item.id)}
    >
      <View style={estilos.notifIcono}>
        <MaterialCommunityIcons
          name={item.tipo === 'reserva' ? 'calendar-month-outline' : 'bell'}
          size={24}
          color={COLORES.primario}
        />
      </View>
      <View style={estilos.notifContenido}>
        <Text style={estilos.notifTitulo}>{item.titulo}</Text>
        <Text style={estilos.notifMensaje}>{item.mensaje}</Text>
        <Text style={estilos.notifFecha}>{formatearDesdeAhora(item.fecha_creacion)}</Text>
      </View>
      {!item.leida && <View style={estilos.indicator} />}
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={estilos.emptyContainer}>
      <MaterialCommunityIcons name="bell-outline" size={80} color={COLORES.textoClaro} />
      <Text style={estilos.emptyText}>No tienes notificaciones</Text>
    </View>
  );

  if (loading && notificaciones.length === 0) {
    return <Loading />;
  }

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Notificaciones"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
        rightIcon="checkmark-done"
        onRightPress={() => marcarTodas()}
      />

      <FlatList
        data={notificaciones}
        renderItem={renderNotificacion}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={estilos.listContent}
      />
    </View>
  );
};

const estilos = StyleSheet.create({
  listContent: {
    padding: DIMENSIONES.padding,
    flexGrow: 1,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    marginBottom: 12,
    gap: 12,
  },
  notifNoLeida: {
    backgroundColor: COLORES.primario + '10',
  },
  notifIcono: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORES.primario + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifContenido: {
    flex: 1,
  },
  notifTitulo: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 4,
  },
  notifMensaje: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoMedio,
    marginBottom: 4,
  },
  notifFecha: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoClaro,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORES.primario,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    color: COLORES.textoMedio,
    marginTop: 16,
  },
});

export default NotificacionesScreen;