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
  const { habitacion, fechaInicio, fechaFin, cantidadPersonas, precioTotal } = route.params || {};
  const { crearReserva } = useReservas();
  
  const [metodoPago, setMetodoPago] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConfirmar = async () => {
    console.log('🎬 BOTÓN PRESIONADO');
    
    if (!metodoPago) {
      setError('Por favor selecciona un método de pago');
      return;
    }

    if (!habitacion || (!habitacion.id && !habitacion.id_habitacion)) {
      setError('Error: Habitación no válida');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const reservaData = {
        idHabitacion: habitacion.id || habitacion.id_habitacion,
        fechaEntrada: fechaInicio,
        fechaSalida: fechaFin,
        numeroHuespedes: cantidadPersonas,
        metodoPago: metodoPago,
      };

      console.log('📤 Enviando:', reservaData);
      const result = await crearReserva(reservaData);
      console.log('📥 Respuesta:', result);

      if (result?.success) {
        // Mostrar toast de éxito
        if (window && window.toast) {
          window.toast('Reserva creada correctamente', { type: 'success' });
        }
        // Redirigir a MisReservas
        navigation.navigate('MisReservas');
      } else {
        if (window && window.toast) {
          window.toast('Error al crear la reserva', { type: 'error' });
        }
        setError('Error al crear la reserva');
      }
    } catch (err) {
      console.error('💥 Error:', err);
      if (window && window.toast) {
        window.toast('Error al crear la reserva', { type: 'error' });
      }
      setError(err.message || 'Error al crear la reserva');
    } finally {
      setLoading(false);
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
          {METODOS_PAGO && METODOS_PAGO.map((metodo) => (
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
        <Boton 
          onPress={handleConfirmar} 
          loading={loading} 
          fullWidth
          disabled={loading}
        >
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