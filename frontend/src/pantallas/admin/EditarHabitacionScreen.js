// Elimina una imagen de la galería (definición correcta más abajo, duplicados eliminados)
  // Abre el modal de confirmación para eliminar habitación
  const handleEliminar = () => {
    setModalEliminarHab(true);
  };
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import HeaderApp from '../../componentes/comun/HeaderApp';
import Boton from '../../componentes/comun/Boton';
import ModalConfirmacion from '../../componentes/comun/ModalConfirmacion';
import habitacionesService from '../../servicios/habitacionesService';

// Modal de feedback simple (éxito o error) — reemplaza Alert
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

const EditarHabitacionScreen = ({ navigation, route }) => {
  const { habitacion } = route.params;

  const [datos, setDatos] = useState({
    numero_habitacion: habitacion?.numero_habitacion || '',
    descripcion_detallada: habitacion?.descripcion_detallada || '',
    precio_base: habitacion?.precio_base?.toString() || '',
    estado: habitacion?.estado || 'disponible',
    piso: habitacion?.piso?.toString() || '',
  });

  const [imagenesGaleria, setImagenesGaleria] = useState(
    habitacion?.galeria_imagenes
      ? (typeof habitacion.galeria_imagenes === 'string'
          ? JSON.parse(habitacion.galeria_imagenes)
          : habitacion.galeria_imagenes)
      : []
  );

  const [loading, setLoading] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [hayCambios, setHayCambios] = useState(false);

  // Estados de modales (reemplazan todos los Alert)
  const [modalSalir, setModalSalir] = useState(false);
  const [modalEliminarHab, setModalEliminarHab] = useState(false);
  const [modalEliminarImg, setModalEliminarImg] = useState(null); // índice de imagen o null
  const [modalFeedback, setModalFeedback] = useState(null); // { tipo, titulo, mensaje, onClose }

  const mostrarFeedback = (tipo, titulo, mensaje, onClose) => {
    setModalFeedback({ tipo, titulo, mensaje, onClose: onClose || (() => setModalFeedback(null)) });
  };

  useEffect(() => {
    const datosOriginales = {
      numero_habitacion: habitacion?.numero_habitacion || '',
      descripcion_detallada: habitacion?.descripcion_detallada || '',
      precio_base: habitacion?.precio_base?.toString() || '',
      estado: habitacion?.estado || 'disponible',
      piso: habitacion?.piso?.toString() || '',
    };
    const imagenesOriginales = habitacion?.galeria_imagenes
      ? (typeof habitacion.galeria_imagenes === 'string'
          ? JSON.parse(habitacion.galeria_imagenes)
          : habitacion.galeria_imagenes)
      : [];

    setHayCambios(
      JSON.stringify(datos) !== JSON.stringify(datosOriginales) ||
      JSON.stringify(imagenesGaleria) !== JSON.stringify(imagenesOriginales)
    );
  }, [datos, imagenesGaleria, habitacion]);

  const handleActualizar = async () => {
    if (!hayCambios) return;
    try {
      setLoading(true);
      // Validar y limpiar datos
      const datosActualizar = {
        ...datos,
        precio_base: datos.precio_base !== undefined && datos.precio_base !== '' ? parseFloat(datos.precio_base) : undefined,
        descripcion_detallada: datos.descripcion_detallada ?? '',
        piso: datos.piso !== undefined && datos.piso !== '' ? parseInt(datos.piso) : undefined,
        galeria_imagenes: imagenesGaleria,
        amenidades: Array.isArray(datos.amenidades) ? datos.amenidades : (typeof datos.amenidades === 'string' ? JSON.parse(datos.amenidades || '[]') : []),
      };
      Object.keys(datosActualizar).forEach((k) => datosActualizar[k] === undefined && delete datosActualizar[k]);
      console.log('🏠 Llamando update con id:', habitacion.id_habitacion);
console.log('🏠 datosActualizar:', JSON.stringify(datosActualizar));
await habitacionesService.update(habitacion.id_habitacion, datosActualizar);
      await habitacionesService.update(habitacion.id_habitacion, datosActualizar);
      setHayCambios(false);
      mostrarFeedback('exito', 'Éxito', 'Habitación actualizada correctamente', () => {
        setModalFeedback(null);
        navigation.goBack();
      });
    } catch (error) {
      mostrarFeedback('error', 'Error', 'No se pudo actualizar la habitación: ' + (error?.response?.data?.mensaje || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarImagen = (index) => {
    setModalEliminarImg(index);
  };

  const procederEliminarImagen = async () => {
    const index = modalEliminarImg;
    setModalEliminarImg(null);
    const nuevasImagenes = imagenesGaleria.filter((_, i) => i !== index);
    const backup = [...imagenesGaleria];
    try {
      setImagenesGaleria(nuevasImagenes);
      const datosActualizar = {
        ...datos,
        precio_base: datos.precio_base !== undefined && datos.precio_base !== '' ? parseFloat(datos.precio_base) : undefined,
        descripcion_detallada: datos.descripcion_detallada ?? '',
        piso: datos.piso !== undefined && datos.piso !== '' ? parseInt(datos.piso) : undefined,
        galeria_imagenes: nuevasImagenes,
        amenidades: Array.isArray(datos.amenidades) ? datos.amenidades : (typeof datos.amenidades === 'string' ? JSON.parse(datos.amenidades || '[]') : []),
      };
      Object.keys(datosActualizar).forEach((k) => datosActualizar[k] === undefined && delete datosActualizar[k]);
      await habitacionesService.update(habitacion.id_habitacion, datosActualizar);
      mostrarFeedback('exito', 'Imagen eliminada', 'La imagen fue eliminada correctamente');
    } catch (error) {
      // rollback si falla
      setImagenesGaleria(backup);
      mostrarFeedback('error', 'Error', 'No se pudo eliminar la imagen: ' + error.message);
    }
  };

  const procederEliminar = async () => {
    setModalEliminarHab(false);
    try {
      setLoading(true);
      await habitacionesService.deleteHabitacion(habitacion.id_habitacion);
      mostrarFeedback('exito', 'Eliminada', 'Habitación eliminada correctamente', () => {
        setModalFeedback(null);
        navigation.goBack();
      });
    } catch (error) {
      mostrarFeedback('error', 'Error', 'No se pudo eliminar: ' + error.message);
    }
  };

  const handleAtras = () => {
    if (hayCambios) {
      setModalSalir(true);
    } else {
      navigation.goBack();
    }
  };

  if (loading && !showImageModal) {
    return (
      <View style={ESTILOS_GLOBALES.container}>
        <ActivityIndicator size="large" color={COLORES.primario} />
      </View>
    );
  }

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title={`Editar Habitación ${hayCambios ? '•' : ''}`}
        leftIcon="arrow-left"
        onLeftPress={handleAtras}
      />

      <ScrollView
        style={{ flex: 1 }}
        scrollEnabled
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: DIMENSIONES.padding, paddingVertical: DIMENSIONES.padding }}
      >
        {/* Imagen Principal */}
        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Imagen Principal</Text>
          {habitacion?.imagen_principal && (
            <TouchableOpacity onPress={() => { setImagenSeleccionada(habitacion.imagen_principal); setShowImageModal(true); }}>
              <Image source={{ uri: String(habitacion.imagen_principal) }} style={estilos.imagenPrincipal} />
            </TouchableOpacity>
          )}
        </View>

        {/* Galería */}
        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Galería</Text>
          {imagenesGaleria.length > 0 ? (
            <FlatList
              data={imagenesGaleria}
              horizontal
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View style={estilos.imageContainer}>
                  <Image source={{ uri: item }} style={estilos.imagenGaleria} />
                  <TouchableOpacity style={estilos.deleteBtn} onPress={() => handleEliminarImagen(index)}>
                    <MaterialCommunityIcons name="close" size={20} color={COLORES.textoBlanco} />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={estilos.galeria}
              ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
            />
          ) : (
            <Text style={estilos.textoVacio}>Sin imágenes adicionales</Text>
          )}
        </View>

        {/* Datos Básicos */}
        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Datos Básicos</Text>

          <View style={estilos.inputGroup}>
            <Text style={estilos.inputLabel}>Número de Habitación</Text>
            <TextInput
              style={estilos.input}
              value={datos.numero_habitacion}
              onChangeText={(text) => setDatos({ ...datos, numero_habitacion: text })}
              placeholder="Ej: 301"
            />
          </View>

          <View style={estilos.inputGroup}>
            <Text style={estilos.inputLabel}>Piso</Text>
            <TextInput
              style={estilos.input}
              value={datos.piso}
              onChangeText={(text) => setDatos({ ...datos, piso: text })}
              placeholder="Ej: 3"
              keyboardType="numeric"
            />
          </View>

          <View style={estilos.inputGroup}>
            <Text style={estilos.inputLabel}>Precio Base ($)</Text>
            <TextInput
              style={estilos.input}
              value={datos.precio_base}
              onChangeText={(text) => setDatos({ ...datos, precio_base: text })}
              placeholder="Ej: 100"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={estilos.inputGroup}>
            <Text style={estilos.inputLabel}>Estado</Text>
            <View style={estilos.estadoButtons}>
              {['disponible', 'ocupada', 'mantenimiento', 'reservada'].map((estado) => (
                <TouchableOpacity
                  key={estado}
                  style={[estilos.estadoBtn, datos.estado === estado && estilos.estadoBtnActivo]}
                  onPress={() => setDatos({ ...datos, estado })}
                >
                  <Text style={[estilos.estadoBtnTexto, datos.estado === estado && estilos.estadoBtnTextoActivo]}>
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={estilos.inputGroup}>
            <Text style={estilos.inputLabel}>Descripción</Text>
            <TextInput
              style={[estilos.input, estilos.textArea]}
              value={datos.descripcion_detallada}
              onChangeText={(text) => setDatos({ ...datos, descripcion_detallada: text })}
              placeholder="Descripción detallada de la habitación"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Amenidades (editable, UX mejorada) */}
        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Amenidades</Text>
          <View style={estilos.amenidadesList}>
            {(Array.isArray(datos.amenidades) ? datos.amenidades : (typeof datos.amenidades === 'string' ? JSON.parse(datos.amenidades || '[]') : [])).map((amenidad, index) => (
              <View key={index} style={estilos.amenidadTag}>
                <Text style={estilos.amenidadTexto}>{amenidad}</Text>
                <TouchableOpacity onPress={() => {
                  const nuevas = [...(datos.amenidades || [])];
                  nuevas.splice(index, 1);
                  setDatos({ ...datos, amenidades: nuevas });
                }}>
                  <MaterialCommunityIcons name="close" size={18} color={COLORES.error} />
                </TouchableOpacity>
              </View>
            ))}
            {/* Botón + para agregar nueva etiqueta */}
            <View style={[estilos.amenidadTag, { backgroundColor: COLORES.primario + '15', minWidth: 80 }]}> 
              <TextInput
                style={[estilos.amenidadTexto, { flex: 1, minWidth: 40 }]}
                value={datos.nuevaAmenidad || ''}
                onChangeText={text => setDatos({ ...datos, nuevaAmenidad: text })}
                placeholder="Nueva"
                onSubmitEditing={() => {
                  if (datos.nuevaAmenidad && datos.nuevaAmenidad.trim() !== '') {
                    const nuevas = [...(datos.amenidades || [])];
                    nuevas.push(datos.nuevaAmenidad.trim());
                    setDatos({ ...datos, amenidades: nuevas, nuevaAmenidad: '' });
                  }
                }}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={{ marginLeft: 4, backgroundColor: COLORES.primario, borderRadius: 6, padding: 4 }}
                onPress={() => {
                  if (datos.nuevaAmenidad && datos.nuevaAmenidad.trim() !== '') {
                    const nuevas = [...(datos.amenidades || [])];
                    nuevas.push(datos.nuevaAmenidad.trim());
                    setDatos({ ...datos, amenidades: nuevas, nuevaAmenidad: '' });
                  }
                }}
              >
                <MaterialCommunityIcons name="plus" size={18} color={COLORES.blanco} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Botones */}
        <View style={estilos.section}>
          <Boton
            onPress={handleActualizar}
            loading={loading}
            fullWidth
            style={[estilos.btnGuardar, hayCambios && estilos.btnGuardarCambios]}
            disabled={!hayCambios}
          >
            <MaterialCommunityIcons name="content-save" size={20} color={COLORES.textoBlanco} />
            <Text style={estilos.btnTexto}>
              {hayCambios ? 'Guardar Cambios' : 'Sin Cambios'}
            </Text>
          </Boton>

          <Boton onPress={handleEliminar} fullWidth style={estilos.btnEliminar} variant="destructive">
            <MaterialCommunityIcons name="delete" size={20} color={COLORES.textoBlanco} />
            <Text style={estilos.btnTexto}>Eliminar Habitación</Text>
          </Boton>
        </View>
      </ScrollView>

      {/* Modal ver imagen grande */}
      <Modal visible={showImageModal} transparent onRequestClose={() => setShowImageModal(false)}>
        <TouchableOpacity style={estilos.imageModal} activeOpacity={1} onPress={() => setShowImageModal(false)}>
          {imagenSeleccionada && (
            <Image source={{ uri: imagenSeleccionada }} style={estilos.imagenModalContent} />
          )}
        </TouchableOpacity>
      </Modal>

      {/* Modal: salir sin guardar */}
      <ModalConfirmacion
        visible={modalSalir}
        titulo="Cambios sin guardar"
        mensaje="¿Querés salir sin guardar los cambios?"
        iconName="alert"
        iconColor={COLORES.advertencia}
        labelConfirmar="Salir"
        labelCancelar="Cancelar"
        variant="destructive"
        onConfirmar={() => { setModalSalir(false); navigation.goBack(); }}
        onCancelar={() => setModalSalir(false)}
      />

      {/* Modal: confirmar eliminar habitación */}
      <ModalConfirmacion
        visible={modalEliminarHab}
        titulo="Eliminar Habitación"
        mensaje={`¿Seguro que querés eliminar la habitación ${habitacion?.numero_habitacion}? Esta acción no se puede deshacer.`}
        iconName="delete-alert"
        iconColor={COLORES.error}
        labelConfirmar="Eliminar"
        labelCancelar="Cancelar"
        variant="destructive"
        loading={loading}
        onConfirmar={procederEliminar}
        onCancelar={() => setModalEliminarHab(false)}
      />

      {/* Modal: confirmar eliminar imagen */}
      <ModalConfirmacion
        visible={modalEliminarImg !== null}
        titulo="Eliminar Imagen"
        mensaje="¿Seguro que querés eliminar esta imagen? Se guardará automáticamente."
        iconName="image-off"
        iconColor={COLORES.error}
        labelConfirmar="Eliminar"
        labelCancelar="Cancelar"
        variant="destructive"
        onConfirmar={procederEliminarImagen}
        onCancelar={() => setModalEliminarImg(null)}
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
  section: { marginBottom: DIMENSIONES.padding * 1.5 },
  sectionTitle: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: DIMENSIONES.padding,
  },
  imagenPrincipal: { width: '100%', height: 250, borderRadius: DIMENSIONES.borderRadius, marginBottom: DIMENSIONES.padding },
  galeria: { gap: 8 },
  imageContainer: { position: 'relative', marginBottom: DIMENSIONES.padding },
  imagenGaleria: { width: 120, height: 120, borderRadius: DIMENSIONES.borderRadius },
  deleteBtn: { position: 'absolute', top: 5, right: 5, backgroundColor: COLORES.error + '90', borderRadius: 20, padding: 4 },
  textoVacio: { fontSize: TIPOGRAFIA.fontSizeSmall, color: COLORES.textoMedio, fontStyle: 'italic' },
  inputGroup: { marginBottom: DIMENSIONES.padding },
  inputLabel: { fontSize: TIPOGRAFIA.fontSizeSmall, fontWeight: TIPOGRAFIA.fontWeightSemiBold, color: COLORES.textoOscuro, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: COLORES.borde, borderRadius: DIMENSIONES.borderRadius, paddingHorizontal: DIMENSIONES.padding, paddingVertical: 10, fontSize: TIPOGRAFIA.fontSizeBase, color: COLORES.textoOscuro },
  textArea: { height: 120, paddingTop: 10 },
  estadoButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  estadoBtn: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: COLORES.primario, borderRadius: DIMENSIONES.borderRadius, backgroundColor: COLORES.fondoBlanco },
  estadoBtnActivo: { backgroundColor: COLORES.primario },
  estadoBtnTexto: { fontSize: TIPOGRAFIA.fontSizeSmall, color: COLORES.primario, fontWeight: TIPOGRAFIA.fontWeightSemiBold },
  estadoBtnTextoActivo: { color: COLORES.textoBlanco },
  amenidadesList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenidadTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORES.exito + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: DIMENSIONES.borderRadius, gap: 6 },
  amenidadTexto: { fontSize: TIPOGRAFIA.fontSizeSmall, color: COLORES.textoOscuro },
  btnGuardar: { marginBottom: 12, flexDirection: 'row', gap: 8, justifyContent: 'center' },
  btnGuardarCambios: { backgroundColor: COLORES.advertencia },
  btnEliminar: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  btnTexto: { fontSize: TIPOGRAFIA.fontSizeBase, fontWeight: TIPOGRAFIA.fontWeightSemiBold, color: COLORES.textoBlanco },
  imageModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  imagenModalContent: { width: '90%', height: '80%', resizeMode: 'contain' },
});

export default EditarHabitacionScreen;