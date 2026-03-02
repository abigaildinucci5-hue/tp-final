// frontend/src/pantallas/perfil/EditarPerfilScreen.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ESTILOS_GLOBALES } from '../../constantes/estilos';
import { useAuth } from '../../hooks/useAuth';
import EditarPerfil from '../../componentes/perfil/EditarPerfil';
import { showSuccessToast, showErrorToast } from '../../redux/slices/uiSlice';
import { useDispatch } from 'react-redux';

const EditarPerfilScreen = ({ navigation }) => {
  const { usuario } = useAuth();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGuardar = async (datos) => {
    setLoading(true);
    setError(null);

    try {
      await usuariosService.updateProfile(datos);
      dispatch(showSuccessToast('Perfil actualizado correctamente'));
      navigation.goBack();
    } catch (err) {
      const errorMsg = err.message || 'Error al actualizar perfil';
      setError(errorMsg);
      dispatch(showErrorToast(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <EditarPerfil
        usuario={usuario}
        onGuardar={handleGuardar}
        loading={loading}
        error={error}
      />
    </View>
  );
};

export default EditarPerfilScreen;