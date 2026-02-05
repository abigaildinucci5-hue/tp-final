// frontend/src/pantallas/admin/EstadisticasScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import HeaderApp from '../../componentes/comun/HeaderApp';
import Card from '../../componentes/comun/Card';

const EstadisticasScreen = ({ navigation }) => {
  const estadisticasMes = [
    { titulo: 'Reservas del Mes', valor: '156', cambio: '+12%', tipo: 'positivo' },
    { titulo: 'Ingresos del Mes', valor: '$520,000', cambio: '+8%', tipo: 'positivo' },
    { titulo: 'Ocupación Promedio', valor: '78%', cambio: '-3%', tipo: 'negativo' },
    { titulo: 'Nuevos Clientes', valor: '45', cambio: '+15%', tipo: 'positivo' },
  ];

  const habitacionesPopulares = [
    { nombre: 'Suite Presidencial', reservas: 24 },
    { nombre: 'Habitación Deluxe', reservas: 18 },
    { nombre: 'Suite Familiar', reservas: 15 },
  ];

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Estadísticas"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={estilos.container}>
        {/* Estadísticas del mes */}
        <View style={estilos.seccion}>
          <Text style={estilos.seccionTitulo}>Este Mes</Text>
          <View style={estilos.estadisticasGrid}>
            {estadisticasMes.map((stat, index) => (
              <Card key={index} style={estilos.statCard}>
                <Text style={estilos.statTitulo}>{stat.titulo}</Text>
                <Text style={estilos.statValor}>{stat.valor}</Text>
                <Text style={[
                  estilos.statCambio,
                  stat.tipo === 'positivo' ? estilos.cambioPositivo : estilos.cambioNegativo
                ]}>
                  {stat.cambio}
                </Text>
              </Card>
            ))}
          </View>
        </View>

        {/* Habitaciones más reservadas */}
        <View style={estilos.seccion}>
          <Text style={estilos.seccionTitulo}>Habitaciones Más Reservadas</Text>
          {habitacionesPopulares.map((hab, index) => (
            <Card key={index} style={estilos.habCard}>
              <View style={estilos.habInfo}>
                <Text style={estilos.habNombre}>{hab.nombre}</Text>
                <Text style={estilos.habReservas}>{hab.reservas} reservas</Text>
              </View>
              <View style={estilos.progressBar}>
                <View
                  style={[
                    estilos.progressFill,
                    { width: `${(hab.reservas / 24) * 100}%` }
                  ]}
                />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  seccion: {
    padding: DIMENSIONES.padding,
  },
  seccionTitulo: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 16,
  },
  estadisticasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: DIMENSIONES.padding,
  },
  statTitulo: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    marginBottom: 8,
  },
  statValor: {
    fontSize: TIPOGRAFIA.fontSizeHeading,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 4,
  },
  statCambio: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },
  cambioPositivo: {
    color: COLORES.exito,
  },
  cambioNegativo: {
    color: COLORES.error,
  },
  habCard: {
    padding: DIMENSIONES.padding,
    marginBottom: 12,
  },
  habInfo: {
    marginBottom: 8,
  },
  habNombre: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
    marginBottom: 4,
  },
  habReservas: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORES.fondoGris,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORES.primario,
    borderRadius: 4,
  },
});

export default EstadisticasScreen;