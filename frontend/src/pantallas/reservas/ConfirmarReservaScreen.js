// frontend/src/pantallas/reservas/ConfirmarReservaScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import { useReservas } from '../../hooks/useReservas';
import { METODOS_PAGO } from '../../constantes/config';
import HeaderApp from '../../componentes/comun/HeaderApp';
import ResumenReserva from '../../componentes/reservas/ResumenReserva';
import Boton from '../../componentes/comun/Boton';
import ErrorMensaje from '../../componentes/comun/ErrorMensaje';

const ConfirmarReservaScreen = ({ navigation, route }) => {
  const { habitacion, fechaInicio, fechaFin, cantidadPersonas, precioTotal } = route.params;
  const { crearReserva, loading } = useReservas();
  
  const [metodoPago, setMetodoPago] = useState(null);
  const [error, setError] = useState(null);

  const handleConfirmar = async () => {
    if (!metodoPago) {
      setError('Por favor selecciona un método de pago');
      return;
    }

    const reservaData = {
      habitacion_id: habitacion.id,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      cantidad_personas: cantidadPersonas,
      metodo_pago: metodoPago,
    };

    const result = await crearReserva(reservaData);
    
    if (result.success) {
      navigation.navigate('ReservaExitosa', { reserva: result.data });
    } else {
      setError(result.error);
    }
  };

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Confirmar Reserva"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
        variant="transparent"
      />

      <ScrollView style={estilos.scrollView}>
        <ResumenReserva
          habitacion={habitacion}
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          cantidadPersonas={cantidadPersonas}
          precioTotal={precioTotal}
        />

        <View style={estilos.metodoPagoContainer}>
          <Text style={estilos.titulo}>Método de Pago</Text>
          {METODOS_PAGO.map((metodo) => (
            <TouchableOpacity
              key={metodo.id}
              style={[
                estilos.metodoCard,
                metodoPago === metodo.id && estilos.metodoCardSeleccionado,
              ]}
              onPress={() => {
                setMetodoPago(metodo.id);
                setError(null);
              }}
            >
              <MaterialCommunityIcons
                name={metodoPago === metodo.id ? 'radiobox-marked' : 'radiobox-blank'}
                size={24}
                color={metodoPago === metodo.id ? COLORES.primario : COLORES.textoMedio}
              />
              <Text style={estilos.metodoNombre}>{metodo.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {error && (
          <View style={estilos.errorContainer}>
            <ErrorMensaje mensaje={error} tipo="error" />
          </View>
        )}
      </ScrollView>

      <View style={estilos.footer}>
        <Boton onPress={handleConfirmar} loading={loading} fullWidth>
          Confirmar y Pagar
        </Boton>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  metodoPagoContainer: {
    padding: DIMENSIONES.padding,
  },
  titulo: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 16,
  },
  metodoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    marginBottom: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: COLORES.borde,
  },
  metodoCardSeleccionado: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario + '10',
  },
  metodoNombre: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoOscuro,
    fontWeight: TIPOGRAFIA.fontWeightMedium,
  },
  errorContainer: {
    padding: DIMENSIONES.padding,
  },
  footer: {
    padding: DIMENSIONES.padding,
    backgroundColor: COLORES.fondoBlanco,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
  },
});

export default ConfirmarReservaScreen;