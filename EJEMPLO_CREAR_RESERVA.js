/**
 * ============================================
 * EJEMPLO: Crear Reserva Protegida
 * ============================================
 * 
 * Este ejemplo muestra cómo interceptar el botón "Crear Reserva"
 * para requerir autenticación sin romper la navegación.
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { COLORES } from '../../constantes/colores';
import API from '../../servicios/api';

const CrearReservaScreen = ({ navigation, route }) => {
  const { habitacionId } = route.params; // ID de la habitación
  const { isAuthenticated, requireAuth } = useRequireAuth();
  const [cargando, setCargando] = useState(false);
  const [fechaEntrada, setFechaEntrada] = useState(null);
  const [fechaSalida, setFechaEntrada] = useState(null);

  /**
   * Manejo del botón "Confirmar Reserva"
   * 
   * 1. SiNo está autenticado → Abre modal de login
   * 2. Si está autenticado → Procede a crear reserva
   * 3. Si la API retorna 401 → Abre login
   */
  const handleConfirmarReserva = async () => {
    // ✅ Verificación 1: ¿Está autenticado?
    if (!isAuthenticated) {
      // Abre el modal de login sin romper navegación
      // El usuario puede volver a esta pantalla después
      await requireAuth();
      return; // Detener si no está autenticado
    }

    // ✅ Verificación 2: ¿Están rellenos los campos?
    if (!fechaEntrada || !fechaSalida) {
      Alert.alert('Error', 'Selecciona fechas de entrada y salida');
      return;
    }

    try {
      setCargando(true);

      // ✅ API request con token automático (desde APIinterceptor)
      const response = await API.post('/reservas', {
        habitacionId,
        fechaEntrada,
        fechaSalida,
      });

      // ✅ Reserva creada exitosamente
      Alert.alert('Éxito', 'Reserva creada correctamente');
      
      // Navegar a detalle de la reserva creada
      navigation.navigate('DetalleReserva', { id: response.id });

    } catch (error) {
      setCargando(false);

      // ❌ Manejar diferentes tipos de error
      if (error.status === 401) {
        // Token expirado o inválido
        Alert.alert(
          'Sesión Expirada',
          'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
          [
            {
              text: 'Iniciar Sesión',
              onPress: () => requireAuth(), // Abre modal
            },
            { text: 'Cancelar' },
          ]
        );
      } else if (error.status === 400) {
        // Validación del servidor
        Alert.alert('Error', error.message || 'Datos inválidos');
      } else if (error.status === 409) {
        // Conflicto: fechas no disponibles
        Alert.alert('No Disponible', 'Las fechas seleccionadas no están disponibles');
      } else {
        // Error general
        Alert.alert('Error', error.message || 'No se pudo crear la reserva');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nueva Reserva</Text>

      {/* Formulario de reserva */}
      <View style={styles.formulario}>
        {/* Campo fecha entrada */}
        <TouchableOpacity 
          style={styles.campoFecha}
          onPress={() => {
            // Abrir datepicker
          }}
        >
          <Text style={styles.labelFecha}>Entrada</Text>
          <Text style={styles.fechaSeleccionada}>
            {fechaEntrada ? fechaEntrada.toLocaleDateString() : 'Seleccionar'}
          </Text>
        </TouchableOpacity>

        {/* Campo fecha salida */}
        <TouchableOpacity 
          style={styles.campoFecha}
          onPress={() => {
            // Abrir datepicker
          }}
        >
          <Text style={styles.labelFecha}>Salida</Text>
          <Text style={styles.fechaSeleccionada}>
            {fechaSalida ? fechaSalida.toLocaleDateString() : 'Seleccionar'}
          </Text>
        </TouchableOpacity>

        {/* Info de precio */}
        <View style={styles.infoPrecio}>
          <Text style={styles.precioLabel}>Precio por noche:</Text>
          <Text style={styles.precioValor}>$150</Text>
        </View>
      </View>

      {/* ✅ BOTÓN PRINCIPAL: Confirmar Reserva */}
      <TouchableOpacity
        style={[
          styles.botonConfirmar,
          cargando && { opacity: 0.6 },
        ]}
        onPress={handleConfirmarReserva}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color={COLORES.PRIMARIO} />
        ) : (
          <Text style={styles.textoBoton}>
            {isAuthenticated ? 'Confirmar Reserva' : 'Inicia Sesión para Reservar'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Info legal */}
      <Text style={styles.textoLegal}>
        Al hacer una reserva aceptas nuestros términos de servicio
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORES.fondoClaro,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORES.NEGRO,
    marginBottom: 20,
  },
  formulario: {
    flex: 1,
  },
  campoFecha: {
    backgroundColor: COLORES.BLANCO,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORES.grisClaro,
  },
  labelFecha: {
    fontSize: 12,
    color: COLORES.grisTexto,
    marginBottom: 5,
  },
  fechaSeleccionada: {
    fontSize: 16,
    color: COLORES.NEGRO,
    fontWeight: '600',
  },
  infoPrecio: {
    backgroundColor: COLORES.BLANCO,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  precioLabel: {
    fontSize: 14,
    color: COLORES.grisTexto,
  },
  precioValor: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORES.SECUNDARIO,
  },
  botonConfirmar: {
    backgroundColor: COLORES.SECUNDARIO,
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  textoBoton: {
    color: COLORES.PRIMARIO,
    fontSize: 16,
    fontWeight: '700',
  },
  textoLegal: {
    fontSize: 11,
    color: COLORES.grisTexto,
    textAlign: 'center',
  },
});

export default CrearReservaScreen;

/**
 * ============================================
 * EXPLICACIÓN DEL FLUJO
 * ============================================
 * 
 * 1. Usuario invitado llega a creación de reserva
 *    → El formulario se muestra normalmente
 * 
 * 2. Hace clic en "Confirmar Reserva"
 *    → handleConfirmarReserva() se ejecuta
 * 
 * 3. Verifica: ¿isAuthenticated?
 *    - NO → llama requireAuth() → abre AuthModal
 *    - SÍ → continúa
 * 
 * 4. Usuario hace login en el AuthModal
 *    → isAuthenticated = true
 *    → Modal se cierra
 *    → Vuelve a la pantalla CrearReservaScreen
 * 
 * 5. El estado del componente se mantiene (fechas, etc.)
 * 
 * 6. Usuario vuelve a hacer clic en "Confirmar Reserva"
 *    → Ahora está autenticado
 *    → Se hace el POST /reservas
 *    → API automaticamente agrega el Bearer token
 * 
 * 7. Si la respuesta es 401 (token expirado):
 *    → Abre nuevamente el AuthModal
 *    → Usuario puede hacer login de nuevo
 * 
 * 8. Si la respuesta es 200:
 *    → Navega a DetalleReserva con la reserva creada
 * 
 * ============================================
 * PUNTOS CLAVE
 * ============================================
 * 
 * ✅ No se rompe la navegación
 * ✅ El estado de la pantalla se mantiene
 * ✅ El usuario puede volver y continuar
 * ✅ Los campos del formulario no se limpian
 * ✅ Si necesita hacer login, puede hacerlo sin perder datos
 * ✅ Si el token expira, puede reauthenticarse
 */
