import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORES } from '../../constantes/colores';
import { ESTILOS_GLOBALES } from '../../constantes/estilos';

const ReservaExitosaScreen = ({ route, navigation }) => {
  const { reserva } = route.params || {};

  // Auto-navegar después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MisReservasList' }],
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[ESTILOS_GLOBALES.container, styles.container]}>
      {/* Check animado */}
      <View style={styles.checkContainer}>
        <Ionicons name="checkmark-circle" size={100} color={COLORES.EXITO} />
      </View>

      {/* Título */}
      <Text style={styles.titulo}>¡Reserva Confirmada!</Text>

      {/* Mensaje */}
      <Text style={styles.mensaje}>
        Tu reserva ha sido creada correctamente. Pronto recibirás una confirmación por correo.
      </Text>

      {/* Detalles de la reserva */}
      {reserva && (
        <View style={styles.detallesContainer}>
          <View style={styles.detalleRow}>
            <Text style={styles.detalleLabel}>Número:</Text>
            <Text style={styles.detalleValue}>
              #{reserva.id_reserva || reserva.id}
            </Text>
          </View>
          <View style={styles.detalleRow}>
            <Text style={styles.detalleLabel}>Monto:</Text>
            <Text style={styles.detalleValue}>
              ${reserva.precio_total || '0.00'}
            </Text>
          </View>
        </View>
      )}

      {/* Botones */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.verReservasButton]}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'MisReservasList' }],
            })
          }
        >
          <Text style={styles.verReservasText}>Ver mis reservas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.volverButton]}
          onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'HomeMain' }],
          })}
        >
          <Text style={styles.volverText}>← Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  checkContainer: {
    marginBottom: 30,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORES.EXITO,
    marginBottom: 16,
    textAlign: 'center',
  },
  mensaje: {
    fontSize: 16,
    color: COLORES.grisTexto,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  detallesContainer: {
    backgroundColor: COLORES.FONDO_CLARO,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 30,
    width: '100%',
  },
  detalleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.grisClaro,
  },
  detalleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORES.grisTexto,
  },
  detalleValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORES.NEGRO,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  verReservasButton: {
    backgroundColor: COLORES.PRIMARIO,
  },
  verReservasText: {
    color: COLORES.BLANCO,
    fontWeight: '700',
    fontSize: 14,
  },
  volverButton: {
    backgroundColor: COLORES.BLANCO,
    borderWidth: 2,
    borderColor: COLORES.grisClaro,
  },
  volverText: {
    color: COLORES.NEGRO,
    fontWeight: '700',
    fontSize: 14,
  },
});

export default ReservaExitosaScreen;
