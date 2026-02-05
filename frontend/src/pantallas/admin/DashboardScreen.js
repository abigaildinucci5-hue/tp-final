// frontend/src/pantallas/admin/DashboardScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import HeaderApp from '../../componentes/comun/HeaderApp';
import Card from '../../componentes/comun/Card';

const DashboardScreen = ({ navigation }) => {
  const estadisticas = [
    { id: 'reservas', titulo: 'Reservas Hoy', valor: '12' },
    { id: 'habitaciones', titulo: 'Habitaciones', valor: '24' },
    { id: 'ocupacion', titulo: 'Ocupación', valor: '85%' },
    { id: 'ingresos', titulo: 'Ingresos Hoy', valor: '$25,000' },
  ];

  const menuOpciones = [
    { id: 'habitaciones', titulo: 'Gestión de Habitaciones', pantalla: 'GestionHabitaciones' },
    { id: 'reservas', titulo: 'Gestión de Reservas', pantalla: 'GestionReservas' },
    { id: 'usuarios', titulo: 'Gestión de Usuarios', pantalla: 'GestionUsuarios' },
    { id: 'estadisticas', titulo: 'Estadísticas', pantalla: 'Estadisticas' },
  ];

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp title="Dashboard Admin" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Estadísticas */}
        <View style={estilos.estadisticasContainer}>
          {estadisticas.map((stat) => (
            <Card key={stat.id} style={estilos.statCard}>
              <Text style={estilos.statValor}>{stat.valor}</Text>
              <Text style={estilos.statTitulo}>{stat.titulo}</Text>
            </Card>
          ))}
        </View>

        {/* Menú */}
        <View style={estilos.menuContainer}>
          <Text style={estilos.seccionTitulo}>Gestión</Text>

          {menuOpciones.map((opcion) => (
            <TouchableOpacity
              key={opcion.id}
              style={estilos.menuItem}
              onPress={() => navigation.navigate(opcion.pantalla)}
            >
              <Text style={estilos.menuTexto}>{opcion.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const estilos = StyleSheet.create({
  estadisticasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: DIMENSIONES.padding,
    gap: 12,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: DIMENSIONES.padding,
  },
  statValor: {
    fontSize: TIPOGRAFIA.fontSizeDisplay,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 4,
  },
  statTitulo: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    textAlign: 'center',
  },
  menuContainer: {
    padding: DIMENSIONES.padding,
  },
  seccionTitulo: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 16,
  },
  menuItem: {
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    marginBottom: 12,
  },
  menuTexto: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightMedium,
    color: COLORES.textoOscuro,
  },
});

export default DashboardScreen;