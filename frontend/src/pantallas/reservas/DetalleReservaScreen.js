import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import COLORES from '../../constantes/colores';
import { DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import { useAuth } from '../../contexto/AuthContext';
import { useReservas } from '../../hooks/useReservas';
import HeaderApp from '../../componentes/comun/HeaderApp';
import ResumenReserva from '../../componentes/reservas/ResumenReserva';
import Boton from '../../componentes/comun/Boton';
import Loading from '../../componentes/comun/Loading';
import ModalConfirmacion from '../../componentes/comun/ModalConfirmacion';
import reservasService from '../../servicios/reservasService';

// Modal de feedback simple (éxito o error)
const ModalFeedback = ({ visible, tipo, titulo, mensaje, onClose }) => (
  <ModalConfirmacion
    visible={visible}
    titulo={titulo}
    mensaje={mensaje}
    iconName={tipo === 'exito' ? 'check-circle' : 'alert-circle'}
    iconColor={tipo === 'exito' ? COLORES.exito : COLORES.error}
    labelConfirmar="OK"
    labelCancelar=""
    onConfirmar={onClose}
    onCancelar={onClose}
  />
);

const DetalleReservaScreen = ({ navigation, route }) => {
  const { usuario } = useAuth();
  const { id } = route.params;
  const { reservaSeleccionada, loading, cargarReservaPorId, cancelarReserva } = useReservas();

  const [modalCancelar, setModalCancelar] = useState(false);
  const [loadingCancelar, setLoadingCancelar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [loadingEliminar, setLoadingEliminar] = useState(false);
  const [modalFeedback, setModalFeedback] = useState(null);

  const mostrarFeedback = (tipo, titulo, mensaje, onClose) => {
    setModalFeedback({ tipo, titulo, mensaje, onClose: onClose || (() => setModalFeedback(null)) });
  };

  useEffect(() => {
    cargarReservaPorId(id);
  }, [id]);

  const procederCancelar = async () => {
    setModalCancelar(false);
    try {
      setLoadingCancelar(true);
      const result = await cancelarReserva(id);
      if (result.success) {
        mostrarFeedback(
          'exito',
          'Reserva Cancelada',
          'Tu reserva fue cancelada exitosamente.\nPor favor comunicate con el personal del hotel para más detalles.',
          () => {
            setModalFeedback(null);
            navigation.goBack();
          }
        );
      } else {
        mostrarFeedback('error', 'Error', result.error?.message || 'No se pudo cancelar la reserva. Intentá nuevamente.');
      }
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      mostrarFeedback('error', 'Error', 'Algo salió mal. Intentá nuevamente.');
    } finally {
      setLoadingCancelar(false);
    }
  };

  const procederEliminar = async () => {
    setModalEliminar(false);
    try {
      setLoadingEliminar(true);
      await reservasService.eliminarReserva(id);
      mostrarFeedback('exito', 'Reserva Eliminada', 'La reserva fue eliminada correctamente', () => {
        setModalFeedback(null);
        navigation.goBack();
      });
    } catch (error) {
      console.error('Error al eliminar reserva:', error);
      mostrarFeedback('error', 'Error', 'No se pudo eliminar: ' + (error?.response?.data?.mensaje || error?.message || 'Error desconocido'));
    } finally {
      setLoadingEliminar(false);
    }
  };

  if (loading || !reservaSeleccionada) {
    return <Loading />;
  }

  const puedeCancel =
    reservaSeleccionada.estado === 'pendiente' ||
    reservaSeleccionada.estado === 'confirmada';

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Detalle de Reserva"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
        variant="transparent"
      />

      <ScrollView style={estilos.scrollView}>
        <ResumenReserva
          reserva={reservaSeleccionada}
          habitacion={reservaSeleccionada.habitacion}
          fechaInicio={reservaSeleccionada.fecha_inicio}
          fechaFin={reservaSeleccionada.fecha_fin}
          cantidadPersonas={reservaSeleccionada.cantidad_personas}
          precioTotal={reservaSeleccionada.precio_total}
          userRole={usuario?.rol || 'cliente'}
        />
      </ScrollView>

      {puedeCancel && (
        <View style={estilos.footer}>
          <Boton variant="danger" onPress={() => setModalCancelar(true)} fullWidth loading={loadingCancelar}>
            Cancelar Reserva
          </Boton>
        </View>
      )}

      {reservaSeleccionada?.estado === 'cancelada' && (
        <View style={estilos.footer}>
          <Boton variant="destructive" onPress={() => setModalEliminar(true)} fullWidth loading={loadingEliminar}>
            Eliminar Reserva
          </Boton>
        </View>
      )}

      {/* Modal: confirmación de cancelación */}
      <ModalConfirmacion
        visible={modalCancelar}
        titulo="Cancelar Reserva"
        mensaje="¿Estás seguro que querés cancelar esta reserva? Esta acción no se puede deshacer.\n\nComunicate con el personal del hotel después de confirmar."
        iconName="alert-circle"
        iconColor={COLORES.advertencia}
        labelConfirmar="Sí, cancelar"
        labelCancelar="No, mantener"
        variant="destructive"
        loading={loadingCancelar}
        onConfirmar={procederCancelar}
        onCancelar={() => setModalCancelar(false)}
      />

      <ModalConfirmacion
        visible={modalEliminar}
        titulo="Eliminar Reserva"
        mensaje="¿Estás seguro? Esta acción eliminará la reserva permanentemente."
        iconName="delete-alert"
        iconColor={COLORES.error}
        labelConfirmar="Eliminar"
        labelCancelar="Cancelar"
        variant="destructive"
        loading={loadingEliminar}
        onConfirmar={procederEliminar}
        onCancelar={() => setModalEliminar(false)}
      />

      {/* Modal: feedback éxito/error */}
      {modalFeedback && (
        <ModalFeedback
          visible={!!modalFeedback}
          tipo={modalFeedback.tipo}
          titulo={modalFeedback.titulo}
          mensaje={modalFeedback.mensaje}
          onClose={modalFeedback.onClose}
        />
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  scrollView: { flex: 1 },
  footer: {
    padding: DIMENSIONES.padding,
    backgroundColor: COLORES.fondoBlanco,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
  },
});

export default DetalleReservaScreen;