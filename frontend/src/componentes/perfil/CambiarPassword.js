// frontend/src/componentes/perfil/CambiarPassword.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import COLORES from '../../constantes/colores';
import { DIMENSIONES } from '../../constantes/estilos';
import Input from '../comun/Input';
import Boton from '../comun/Boton';
import ErrorMensaje from '../comun/ErrorMensaje';
import { useForm } from '../../hooks/useForm';
import { validarPassword, validarConfirmPassword } from '../../utils/validaciones';

const CambiarPassword = ({ onCambiar, loading = false, error = null }) => {
  const { values, errors, handleChange, handleBlur, validateForm, getInputProps } = useForm(
    {
      passwordActual: '',
      passwordNueva: '',
      passwordConfirm: '',
    },
    {
      passwordActual: validarPassword,
      passwordNueva: validarPassword,
      passwordConfirm: (value) =>
        validarConfirmPassword(values.passwordNueva, value),
    }
  );

  const handleSubmit = () => {
    if (validateForm()) {
      onCambiar({
        passwordActual: values.passwordActual,
        passwordNueva: values.passwordNueva,
      });
    }
  };

  return (
    <View style={estilos.container}>
      <Input
        label="Contraseña actual"
        placeholder="Ingresa tu contraseña actual"
        secureTextEntry
        {...getInputProps('passwordActual')}
      />

      <Input
        label="Nueva contraseña"
        placeholder="Ingresa tu nueva contraseña"
        secureTextEntry
        {...getInputProps('passwordNueva')}
      />

      <Input
        label="Confirmar nueva contraseña"
        placeholder="Confirma tu nueva contraseña"
        secureTextEntry
        {...getInputProps('passwordConfirm')}
      />

      {error && <ErrorMensaje mensaje={error} tipo="error" />}

      <Boton onPress={handleSubmit} loading={loading} fullWidth>
        Cambiar Contraseña
      </Boton>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    padding: DIMENSIONES.padding,
    gap: 16,
    backgroundColor: COLORES.fondo,
  },
});

export default CambiarPassword;