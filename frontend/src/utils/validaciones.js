// frontend/src/utils/validaciones.js
import { VALIDACIONES } from '../constantes/config';

// Validar email
export const validarEmail = (email) => {
  if (!email) {
    return { valido: false, mensaje: 'El email es requerido' };
  }
  
  if (!VALIDACIONES.EMAIL_REGEX.test(email)) {
    return { valido: false, mensaje: 'El email no es válido' };
  }
  
  return { valido: true, mensaje: '' };
};

// Validar contraseña
export const validarPassword = (password) => {
  if (!password) {
    return { valido: false, mensaje: 'La contraseña es requerida' };
  }
  
  if (password.length < VALIDACIONES.PASSWORD_MIN_LENGTH) {
    return { 
      valido: false, 
      mensaje: `La contraseña debe tener al menos ${VALIDACIONES.PASSWORD_MIN_LENGTH} caracteres` 
    };
  }
  
  if (password.length > VALIDACIONES.PASSWORD_MAX_LENGTH) {
    return { 
      valido: false, 
      mensaje: `La contraseña no puede tener más de ${VALIDACIONES.PASSWORD_MAX_LENGTH} caracteres` 
    };
  }
  
  return { valido: true, mensaje: '' };
};

// Validar confirmación de contraseña
export const validarConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { valido: false, mensaje: 'Confirma tu contraseña' };
  }
  
  if (password !== confirmPassword) {
    return { valido: false, mensaje: 'Las contraseñas no coinciden' };
  }
  
  return { valido: true, mensaje: '' };
};

// Validar nombre
export const validarNombre = (nombre) => {
  if (!nombre) {
    return { valido: false, mensaje: 'El nombre es requerido' };
  }
  
  if (nombre.trim().length < VALIDACIONES.NOMBRE_MIN_LENGTH) {
    return { 
      valido: false, 
      mensaje: `El nombre debe tener al menos ${VALIDACIONES.NOMBRE_MIN_LENGTH} caracteres` 
    };
  }
  
  if (nombre.length > VALIDACIONES.NOMBRE_MAX_LENGTH) {
    return { 
      valido: false, 
      mensaje: `El nombre no puede tener más de ${VALIDACIONES.NOMBRE_MAX_LENGTH} caracteres` 
    };
  }
  
  return { valido: true, mensaje: '' };
};

// Validar teléfono
export const validarTelefono = (telefono) => {
  if (!telefono) {
    return { valido: false, mensaje: 'El teléfono es requerido' };
  }
  
  if (!VALIDACIONES.TELEFONO_REGEX.test(telefono)) {
    return { valido: false, mensaje: 'El teléfono no es válido' };
  }
  
  return { valido: true, mensaje: '' };
};

// Validar DNI
export const validarDNI = (dni) => {
  if (!dni) {
    return { valido: false, mensaje: 'El DNI es requerido' };
  }
  
  if (!VALIDACIONES.DNI_REGEX.test(dni)) {
    return { valido: false, mensaje: 'El DNI debe tener 7 u 8 dígitos' };
  }
  
  return { valido: true, mensaje: '' };
};

// Validar fecha de nacimiento (mayor de 18 años)
export const validarFechaNacimiento = (fecha) => {
  if (!fecha) {
    return { valido: false, mensaje: 'La fecha de nacimiento es requerida' };
  }
  
  const hoy = new Date();
  const fechaNac = new Date(fecha);
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  
  if (edad < 18) {
    return { valido: false, mensaje: 'Debes ser mayor de 18 años' };
  }
  
  return { valido: true, mensaje: '' };
};

// Validar rango de fechas
export const validarRangoFechas = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) {
    return { valido: false, mensaje: 'Debes seleccionar las fechas de inicio y fin' };
  }
  
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  
  if (fin <= inicio) {
    return { valido: false, mensaje: 'La fecha de fin debe ser posterior a la fecha de inicio' };
  }
  
  return { valido: true, mensaje: '' };
};

// Validar que la fecha de inicio no sea en el pasado
export const validarFechaFutura = (fecha) => {
  if (!fecha) {
    return { valido: false, mensaje: 'La fecha es requerida' };
  }
  
  const fechaSeleccionada = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  if (fechaSeleccionada < hoy) {
    return { valido: false, mensaje: 'La fecha no puede ser en el pasado' };
  }
  
  return { valido: true, mensaje: '' };
};

// Validar campo requerido
export const validarRequerido = (valor, nombreCampo = 'Este campo') => {
  if (!valor || (typeof valor === 'string' && valor.trim() === '')) {
    return { valido: false, mensaje: `${nombreCampo} es requerido` };
  }
  
  return { valido: true, mensaje: '' };
};

// Validar número
export const validarNumero = (valor, min = null, max = null, nombreCampo = 'Este campo') => {
  if (valor === null || valor === undefined || valor === '') {
    return { valido: false, mensaje: `${nombreCampo} es requerido` };
  }
  
  const numero = Number(valor);
  
  if (isNaN(numero)) {
    return { valido: false, mensaje: `${nombreCampo} debe ser un número` };
  }
  
  if (min !== null && numero < min) {
    return { valido: false, mensaje: `${nombreCampo} debe ser mayor o igual a ${min}` };
  }
  
  if (max !== null && numero > max) {
    return { valido: false, mensaje: `${nombreCampo} debe ser menor o igual a ${max}` };
  }
  
  return { valido: true, mensaje: '' };
};

// Validar calificación (1-5 estrellas)
export const validarCalificacion = (calificacion) => {
  return validarNumero(calificacion, 1, 5, 'La calificación');
};

// Validar formulario completo
export const validarFormulario = (campos) => {
  const errores = {};
  let esValido = true;
  
  Object.keys(campos).forEach((campo) => {
    const { valor, validador, nombreCampo } = campos[campo];
    
    if (validador) {
      const resultado = validador(valor, nombreCampo);
      if (!resultado.valido) {
        errores[campo] = resultado.mensaje;
        esValido = false;
      }
    }
  });
  
  return { esValido, errores };
};

export default {
  validarEmail,
  validarPassword,
  validarConfirmPassword,
  validarNombre,
  validarTelefono,
  validarDNI,
  validarFechaNacimiento,
  validarRangoFechas,
  validarFechaFutura,
  validarRequerido,
  validarNumero,
  validarCalificacion,
  validarFormulario,
};