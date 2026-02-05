// src/servicios/servicioNotificaciones.js - Servicio de notificaciones push
const { ejecutarConsulta, insertar } = require('../config/baseDatos');

/**
 * IMPORTANTE: Para usar notificaciones push necesitas configurar:
 * 1. Expo Push Notifications (más fácil)
 * 2. Firebase Cloud Messaging (más completo)
 * 
 * Este archivo está preparado para ambos métodos.
 */

// ====================================
// MÉTODO 1: EXPO PUSH NOTIFICATIONS
// ====================================

/**
 * Validar token de Expo
 */
const esTokenExpoValido = (token) => {
  return token && token.startsWith('ExponentPushToken[');
};

/**
 * Enviar notificación push con Expo
 * @param {string} tokenPush - Token de Expo del dispositivo
 * @param {Object} notificacion - Datos de la notificación
 */
const enviarNotificacionExpo = async (tokenPush, notificacion) => {
  try {
    if (!esTokenExpoValido(tokenPush)) {
      throw new Error('Token de Expo inválido');
    }

    const mensaje = {
      to: tokenPush,
      sound: 'default',
      title: notificacion.titulo,
      body: notificacion.mensaje,
      data: notificacion.datos || {},
      badge: notificacion.badge || null,
      priority: notificacion.prioridad || 'default',
      channelId: notificacion.canalId || 'default',
    };

    // Enviar a la API de Expo
    const respuesta = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mensaje),
    });

    const resultado = await respuesta.json();

    if (resultado.data && resultado.data.status === 'ok') {
      console.log('✅ Notificación push enviada exitosamente');
      return { exito: true, resultado };
    } else {
      console.error('❌ Error al enviar notificación:', resultado);
      return { exito: false, error: resultado };
    }
  } catch (error) {
    console.error('❌ Error en enviarNotificacionExpo:', error);
    return { exito: false, error: error.message };
  }
};

/**
 * Enviar notificaciones push a múltiples dispositivos (Expo)
 */
const enviarNotificacionesMultiples = async (tokensPush, notificacion) => {
  try {
    const mensajes = tokensPush.map(token => ({
      to: token,
      sound: 'default',
      title: notificacion.titulo,
      body: notificacion.mensaje,
      data: notificacion.datos || {},
      badge: notificacion.badge || null,
      priority: notificacion.prioridad || 'default',
      channelId: notificacion.canalId || 'default',
    }));

    const respuesta = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mensajes),
    });

    const resultado = await respuesta.json();
    console.log(`📤 Notificaciones enviadas a ${tokensPush.length} dispositivos`);
    
    return { exito: true, resultado };
  } catch (error) {
    console.error('❌ Error en enviarNotificacionesMultiples:', error);
    return { exito: false, error: error.message };
  }
};

// ====================================
// MÉTODO 2: FIREBASE CLOUD MESSAGING
// ====================================

/**
 * Enviar notificación con Firebase
 * Requiere: npm install firebase-admin
 */
const enviarNotificacionFirebase = async (tokenFCM, notificacion) => {
  try {
    // Descomentar si usas Firebase
    // const admin = require('firebase-admin');
    
    // const mensaje = {
    //   notification: {
    //     title: notificacion.titulo,
    //     body: notificacion.mensaje,
    //   },
    //   data: notificacion.datos || {},
    //   token: tokenFCM,
    // };

    // const respuesta = await admin.messaging().send(mensaje);
    // console.log('✅ Notificación Firebase enviada:', respuesta);
    // return { exito: true, respuesta };

    console.log('Firebase deshabilitado. Descomentar código para usar.');
    return { exito: false, error: 'Firebase no configurado' };
  } catch (error) {
    console.error('❌ Error en enviarNotificacionFirebase:', error);
    return { exito: false, error: error.message };
  }
};

// ====================================
// FUNCIONES DE GESTIÓN DE TOKENS
// ====================================

/**
 * Guardar token de push en la base de datos
 */
const guardarTokenPush = async (idUsuario, token, tipo = 'expo') => {
  try {
    // Verificar si ya existe el token
    const sqlVerificar = `
      SELECT id_token FROM tokens_push 
      WHERE id_usuario = ? AND token = ?
      LIMIT 1
    `;
    const existe = await ejecutarConsulta(sqlVerificar, [idUsuario, token]);

    if (existe.length > 0) {
      // Actualizar fecha de actualización
      const sqlActualizar = `
        UPDATE tokens_push 
        SET fecha_actualizacion = NOW(), activo = TRUE
        WHERE id_token = ?
      `;
      await ejecutarConsulta(sqlActualizar, [existe[0].id_token]);
      return existe[0].id_token;
    }

    // Crear tabla si no existe
    await crearTablaTokensPush();

    // Insertar nuevo token
    const idToken = await insertar('tokens_push', {
      id_usuario: idUsuario,
      token: token,
      tipo: tipo,
      activo: true,
    });

    console.log(`✅ Token push guardado para usuario ${idUsuario}`);
    return idToken;
  } catch (error) {
    console.error('Error al guardar token push:', error);
    throw error;
  }
};

/**
 * Obtener tokens de push de un usuario
 */
const obtenerTokensUsuario = async (idUsuario) => {
  try {
    const sql = `
      SELECT token, tipo 
      FROM tokens_push 
      WHERE id_usuario = ? AND activo = TRUE
    `;
    const tokens = await ejecutarConsulta(sql, [idUsuario]);
    return tokens;
  } catch (error) {
    console.error('Error al obtener tokens:', error);
    return [];
  }
};

/**
 * Invalidar token de push
 */
const invalidarTokenPush = async (token) => {
  try {
    const sql = `UPDATE tokens_push SET activo = FALSE WHERE token = ?`;
    await ejecutarConsulta(sql, [token]);
    console.log('✅ Token push invalidado');
    return true;
  } catch (error) {
    console.error('Error al invalidar token:', error);
    return false;
  }
};

/**
 * Obtener todos los tokens activos (para notificaciones masivas)
 */
const obtenerTodosTokensActivos = async () => {
  try {
    const sql = `
      SELECT DISTINCT tp.token, tp.tipo, u.id_usuario, u.nombre, u.rol
      FROM tokens_push tp
      JOIN usuarios u ON tp.id_usuario = u.id_usuario
      WHERE tp.activo = TRUE AND u.activo = TRUE
    `;
    const tokens = await ejecutarConsulta(sql);
    return tokens;
  } catch (error) {
    console.error('Error al obtener todos los tokens:', error);
    return [];
  }
};

// ====================================
// FUNCIONES AUXILIARES
// ====================================

/**
 * Crear tabla de tokens push si no existe
 */
const crearTablaTokensPush = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS tokens_push (
      id_token INT PRIMARY KEY AUTO_INCREMENT,
      id_usuario INT NOT NULL,
      token VARCHAR(500) NOT NULL,
      tipo ENUM('expo', 'fcm') DEFAULT 'expo',
      dispositivo VARCHAR(100),
      activo BOOLEAN DEFAULT TRUE,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
      UNIQUE KEY unique_token (token),
      INDEX idx_usuario (id_usuario),
      INDEX idx_activo (activo)
    )
  `;

  try {
    await ejecutarConsulta(sql);
    console.log('✅ Tabla tokens_push verificada/creada');
  } catch (error) {
    console.error('Error al crear tabla tokens_push:', error);
  }
};

/**
 * Enviar notificación a un usuario específico
 */
const notificarUsuario = async (idUsuario, notificacion) => {
  try {
    // Obtener tokens del usuario
    const tokens = await obtenerTokensUsuario(idUsuario);

    if (tokens.length === 0) {
      console.log(`ℹ️ Usuario ${idUsuario} no tiene tokens de push registrados`);
      return { exito: false, mensaje: 'No hay tokens registrados' };
    }

    // Enviar a cada token
    const resultados = [];
    for (const tokenData of tokens) {
      let resultado;
      
      if (tokenData.tipo === 'expo') {
        resultado = await enviarNotificacionExpo(tokenData.token, notificacion);
      } else if (tokenData.tipo === 'fcm') {
        resultado = await enviarNotificacionFirebase(tokenData.token, notificacion);
      }

      resultados.push(resultado);

      // Si el token es inválido, marcarlo como inactivo
      if (!resultado.exito && resultado.error?.details?.error === 'DeviceNotRegistered') {
        await invalidarTokenPush(tokenData.token);
      }
    }

    return { exito: true, resultados };
  } catch (error) {
    console.error('Error al notificar usuario:', error);
    return { exito: false, error: error.message };
  }
};

/**
 * Enviar notificación masiva a todos los usuarios activos
 */
const notificarTodos = async (notificacion) => {
  try {
    const todosTokens = await obtenerTodosTokensActivos();
    
    if (todosTokens.length === 0) {
      console.log('ℹ️ No hay tokens activos para enviar notificaciones');
      return { exito: false, mensaje: 'No hay tokens activos' };
    }

    // Separar por tipo
    const tokensExpo = todosTokens
      .filter(t => t.tipo === 'expo')
      .map(t => t.token);

    const tokensFCM = todosTokens
      .filter(t => t.tipo === 'fcm')
      .map(t => t.token);

    const resultados = [];

    // Enviar a Expo en lotes de 100 (límite de Expo)
    if (tokensExpo.length > 0) {
      const lotes = [];
      for (let i = 0; i < tokensExpo.length; i += 100) {
        lotes.push(tokensExpo.slice(i, i + 100));
      }

      for (const lote of lotes) {
        const resultado = await enviarNotificacionesMultiples(lote, notificacion);
        resultados.push(resultado);
      }
    }

    // Enviar a FCM uno por uno
    if (tokensFCM.length > 0) {
      for (const token of tokensFCM) {
        const resultado = await enviarNotificacionFirebase(token, notificacion);
        resultados.push(resultado);
      }
    }

    console.log(`📤 Notificaciones enviadas a ${todosTokens.length} dispositivos`);
    return { exito: true, total: todosTokens.length, resultados };
  } catch (error) {
    console.error('Error al notificar a todos:', error);
    return { exito: false, error: error.message };
  }
};

/**
 * Notificar sobre nueva reserva
 */
const notificarNuevaReserva = async (idUsuario, datosReserva) => {
  const notificacion = {
    titulo: '✅ Reserva Confirmada',
    mensaje: `Tu reserva #${datosReserva.idReserva} ha sido confirmada para ${datosReserva.fechaEntrada}`,
    datos: {
      tipo: 'reserva',
      idReserva: datosReserva.idReserva,
      accion: 'ver_detalle',
    },
    badge: 1,
    prioridad: 'high',
  };

  return await notificarUsuario(idUsuario, notificacion);
};

/**
 * Notificar sobre cancelación de reserva
 */
const notificarCancelacionReserva = async (idUsuario, idReserva) => {
  const notificacion = {
    titulo: '❌ Reserva Cancelada',
    mensaje: `Tu reserva #${idReserva} ha sido cancelada`,
    datos: {
      tipo: 'cancelacion',
      idReserva: idReserva,
    },
    badge: 1,
  };

  return await notificarUsuario(idUsuario, notificacion);
};

/**
 * Notificar recordatorio de check-in
 */
const notificarRecordatorioCheckin = async (idUsuario, datosReserva) => {
  const notificacion = {
    titulo: '🏨 Recordatorio de Check-in',
    mensaje: `Tu estadía comienza mañana. Reserva #${datosReserva.idReserva}`,
    datos: {
      tipo: 'recordatorio',
      idReserva: datosReserva.idReserva,
    },
    badge: 1,
    prioridad: 'high',
  };

  return await notificarUsuario(idUsuario, notificacion);
};

/**
 * Notificar nueva habitación disponible
 */
const notificarNuevaHabitacion = async (idHabitacion, nombreHabitacion) => {
  const notificacion = {
    titulo: '🆕 Nueva Habitación Disponible',
    mensaje: `Descubre nuestra nueva ${nombreHabitacion}`,
    datos: {
      tipo: 'nueva_habitacion',
      idHabitacion: idHabitacion,
      accion: 'ver_habitacion',
    },
  };

  return await notificarTodos(notificacion);
};

// Inicializar tabla al cargar el módulo
crearTablaTokensPush();

module.exports = {
  // Expo
  enviarNotificacionExpo,
  enviarNotificacionesMultiples,
  
  // Firebase
  enviarNotificacionFirebase,
  
  // Gestión de tokens
  guardarTokenPush,
  obtenerTokensUsuario,
  invalidarTokenPush,
  obtenerTodosTokensActivos,
  
  // Notificaciones específicas
  notificarUsuario,
  notificarTodos,
  notificarNuevaReserva,
  notificarCancelacionReserva,
  notificarRecordatorioCheckin,
  notificarNuevaHabitacion,
};