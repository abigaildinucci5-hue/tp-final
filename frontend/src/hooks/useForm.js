// frontend/src/hooks/useForm.js
import { useState } from 'react';

export const useForm = (initialValues = {}, validaciones = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Actualizar un campo
  const handleChange = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Marcar campo como tocado (cuando pierde el foco)
  const handleBlur = (name) => {
    setTouched({
      ...touched,
      [name]: true,
    });

    // Validar campo individual
    if (validaciones[name]) {
      const resultado = validaciones[name](values[name]);
      if (!resultado.valido) {
        setErrors({
          ...errors,
          [name]: resultado.mensaje,
        });
      }
    }
  };

  // Validar todos los campos
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validaciones).forEach((name) => {
      const validador = validaciones[name];
      const resultado = validador(values[name]);
      
      if (!resultado.valido) {
        newErrors[name] = resultado.mensaje;
        isValid = false;
      }
    });

    setErrors(newErrors);
    
    // Marcar todos los campos como tocados
    const allTouched = {};
    Object.keys(validaciones).forEach((name) => {
      allTouched[name] = true;
    });
    setTouched(allTouched);

    return isValid;
  };

  // Resetear formulario
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  // Actualizar múltiples valores
  const setFormValues = (newValues) => {
    setValues({
      ...values,
      ...newValues,
    });
  };

  // Obtener props para un input
  const getInputProps = (name) => {
    return {
      value: values[name] || '',
      onChangeText: (value) => handleChange(name, value),
      onBlur: () => handleBlur(name),
      error: touched[name] && errors[name] ? errors[name] : '',
    };
  };

  // Verificar si el formulario es válido
  const isFormValid = () => {
    return Object.keys(errors).length === 0;
  };

  // Verificar si un campo tiene error
  const hasError = (name) => {
    return touched[name] && !!errors[name];
  };

  // Obtener mensaje de error de un campo
  const getError = (name) => {
    return touched[name] ? errors[name] : '';
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFormValues,
    getInputProps,
    isFormValid,
    hasError,
    getError,
  };
};

export default useForm;