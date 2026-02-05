// frontend/src/utils/formatters.js

// Formatear precio en pesos argentinos
export const formatearPrecio = (precio) => {
  if (!precio && precio !== 0) return '$0';
  
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
};

// Formatear número con separadores de miles
export const formatearNumero = (numero) => {
  if (!numero && numero !== 0) return '0';
  
  return new Intl.NumberFormat('es-AR').format(numero);
};

// Formatear teléfono argentino
export const formatearTelefono = (telefono) => {
  if (!telefono) return '';
  
  // Remover todos los caracteres que no sean dígitos
  const limpio = telefono.replace(/\D/g, '');
  
  // Formatear según la longitud
  if (limpio.length === 10) {
    // Formato: (0223) 123-4567
    return `(${limpio.substring(0, 4)}) ${limpio.substring(4, 7)}-${limpio.substring(7)}`;
  } else if (limpio.length === 11 && limpio.startsWith('54')) {
    // Formato internacional: +54 223 123-4567
    return `+${limpio.substring(0, 2)} ${limpio.substring(2, 5)} ${limpio.substring(5, 8)}-${limpio.substring(8)}`;
  }
  
  return telefono;
};

// Formatear DNI argentino
export const formatearDNI = (dni) => {
  if (!dni) return '';
  
  const limpio = dni.toString().replace(/\D/g, '');
  
  // Formatear con puntos: 12.345.678
  if (limpio.length <= 3) {
    return limpio;
  } else if (limpio.length <= 6) {
    return `${limpio.substring(0, limpio.length - 3)}.${limpio.substring(limpio.length - 3)}`;
  } else {
    return `${limpio.substring(0, limpio.length - 6)}.${limpio.substring(limpio.length - 6, limpio.length - 3)}.${limpio.substring(limpio.length - 3)}`;
  }
};

// Formatear nombre completo (capitalizar primera letra de cada palabra)
export const formatearNombre = (nombre) => {
  if (!nombre) return '';
  
  return nombre
    .toLowerCase()
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
};

// Formatear email (convertir a minúsculas)
export const formatearEmail = (email) => {
  if (!email) return '';
  return email.toLowerCase().trim();
};

// Truncar texto con puntos suspensivos
export const truncarTexto = (texto, maxLength = 50) => {
  if (!texto) return '';
  if (texto.length <= maxLength) return texto;
  return texto.substring(0, maxLength) + '...';
};

// Formatear porcentaje
export const formatearPorcentaje = (valor, decimales = 0) => {
  if (!valor && valor !== 0) return '0%';
  return `${valor.toFixed(decimales)}%`;
};

// Formatear calificación (estrellas)
export const formatearCalificacion = (calificacion) => {
  if (!calificacion && calificacion !== 0) return '0.0';
  return Number(calificacion).toFixed(1);
};

// Obtener iniciales de un nombre
export const obtenerIniciales = (nombre) => {
  if (!nombre) return '';
  
  const palabras = nombre.trim().split(' ');
  if (palabras.length === 1) {
    return palabras[0].charAt(0).toUpperCase();
  }
  
  return (palabras[0].charAt(0) + palabras[palabras.length - 1].charAt(0)).toUpperCase();
};

// Formatear estado de reserva para mostrar
export const formatearEstadoReserva = (estado) => {
  const estados = {
    pendiente: 'Pendiente',
    confirmada: 'Confirmada',
    en_curso: 'En Curso',
    completada: 'Completada',
    cancelada: 'Cancelada',
  };
  
  return estados[estado] || estado;
};

// Formatear categoría de habitación
export const formatearCategoria = (categoria) => {
  const categorias = {
    estandar: 'Estándar',
    deluxe: 'Deluxe',
    suite: 'Suite',
    presidencial: 'Presidencial',
  };
  
  return categorias[categoria] || categoria;
};

// Formatear rol de usuario
export const formatearRol = (rol) => {
  const roles = {
    admin: 'Administrador',
    cliente: 'Cliente',
    empleado: 'Empleado',
  };
  
  return roles[rol] || rol;
};

// Formatear método de pago
export const formatearMetodoPago = (metodo) => {
  const metodos = {
    efectivo: 'Efectivo',
    tarjeta_debito: 'Tarjeta de Débito',
    tarjeta_credito: 'Tarjeta de Crédito',
    transferencia: 'Transferencia Bancaria',
    mercadopago: 'Mercado Pago',
  };
  
  return metodos[metodo] || metodo;
};

// Formatear duración de estadía (en noches)
export const formatearDuracion = (noches) => {
  if (!noches || noches === 0) return '0 noches';
  if (noches === 1) return '1 noche';
  return `${noches} noches`;
};

// Formatear capacidad de personas
export const formatearCapacidad = (capacidad) => {
  if (!capacidad || capacidad === 0) return '0 personas';
  if (capacidad === 1) return '1 persona';
  return `${capacidad} personas`;
};

// Limpiar número de teléfono (solo dígitos)
export const limpiarTelefono = (telefono) => {
  if (!telefono) return '';
  return telefono.replace(/\D/g, '');
};

// Limpiar DNI (solo dígitos)
export const limpiarDNI = (dni) => {
  if (!dni) return '';
  return dni.toString().replace(/\D/g, '');
};

// Formatear dirección completa
export const formatearDireccion = (direccion) => {
  if (!direccion) return '';
  
  const { calle, numero, ciudad, provincia, codigo_postal } = direccion;
  let dir = '';
  
  if (calle) dir += calle;
  if (numero) dir += ` ${numero}`;
  if (ciudad) dir += `, ${ciudad}`;
  if (provincia) dir += `, ${provincia}`;
  if (codigo_postal) dir += ` (${codigo_postal})`;
  
  return dir;
};

// Formatear tamaño de archivo
export const formatearTamañoArchivo = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export default {
  formatearPrecio,
  formatearNumero,
  formatearTelefono,
  formatearDNI,
  formatearNombre,
  formatearEmail,
  truncarTexto,
  formatearPorcentaje,
  formatearCalificacion,
  obtenerIniciales,
  formatearEstadoReserva,
  formatearCategoria,
  formatearRol,
  formatearMetodoPago,
  formatearDuracion,
  formatearCapacidad,
  limpiarTelefono,
  limpiarDNI,
  formatearDireccion,
  formatearTamañoArchivo,
};