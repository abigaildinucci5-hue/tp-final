-- ============================================================
-- MIGRACIONES DE BASE DE DATOS - SISTEMA COMPLETO HOTEL LUNA SERENA
-- ============================================================
-- Ejecutar en orden las siguientes migraciones

-- ============================================================
-- 1. ACTUALIZAR TABLA USUARIOS
-- ============================================================
ALTER TABLE usuarios 
ADD COLUMN puntos_acumulados INT DEFAULT 0,
ADD COLUMN total_reservas INT DEFAULT 0,
ADD COLUMN total_reseñas INT DEFAULT 0,
ADD COLUMN preferencias JSON,
ADD COLUMN notificaciones JSON,
ADD COLUMN descuento_empleado DECIMAL(5,2) DEFAULT 0.00,
ADD COLUMN es_verificado BOOLEAN DEFAULT FALSE,
ADD COLUMN fecha_ultimo_login TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP;

-- ============================================================
-- 2. CREAR TABLA DE ESTADOS DE HABITACIONES
-- ============================================================
CREATE TABLE IF NOT EXISTS estados_habitaciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_habitacion INT NOT NULL,
  estado ENUM('disponible', 'ocupada', 'limpieza', 'mantenimiento') DEFAULT 'disponible',
  actualizado_por INT,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_habitacion) REFERENCES habitaciones(id_habitacion),
  FOREIGN KEY (actualizado_por) REFERENCES usuarios(id_usuario),
  INDEX idx_habitacion (id_habitacion),
  INDEX idx_estado (estado)
);

-- ============================================================
-- 3. CREAR TABLA DE SOLICITUDES DE HUÉSPEDES
-- ============================================================
CREATE TABLE IF NOT EXISTS solicitudes_huespedes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_reserva INT NOT NULL,
  tipo ENUM('servicio_habitacion', 'cama_extra', 'higiene', 'toallas', 'problema_tecnico', 'otro') DEFAULT 'otro',
  descripcion TEXT,
  estado ENUM('pendiente', 'en_proceso', 'resuelta') DEFAULT 'pendiente',
  prioridad ENUM('baja', 'media', 'alta') DEFAULT 'media',
  creado_por INT NOT NULL,
  resuelto_por INT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_resolucion TIMESTAMP NULL,
  observaciones TEXT,
  FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva),
  FOREIGN KEY (creado_por) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (resuelto_por) REFERENCES usuarios(id_usuario),
  INDEX idx_reserva (id_reserva),
  INDEX idx_estado (estado),
  INDEX idx_prioridad (prioridad)
);

-- ============================================================
-- 4. CREAR TABLA DE REGISTRO DE CHECK-IN/CHECK-OUT
-- ============================================================
CREATE TABLE IF NOT EXISTS registro_checkin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_reserva INT NOT NULL,
  tipo ENUM('check_in', 'check_out') NOT NULL,
  realizado_por INT NOT NULL,
  fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  observaciones TEXT,
  hora_entrada TIME NULL,
  hora_salida TIME NULL,
  FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva),
  FOREIGN KEY (realizado_por) REFERENCES usuarios(id_usuario),
  INDEX idx_reserva (id_reserva),
  INDEX idx_tipo (tipo),
  INDEX idx_fecha (fecha_hora)
);

-- ============================================================
-- 5. CREAR TABLA DE MÉTODOS DE PAGO GUARDADOS
-- ============================================================
CREATE TABLE IF NOT EXISTS metodos_pago_usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  tipo ENUM('visa', 'mastercard', 'amex', 'mercadopago', 'paypal', 'transferencia') NOT NULL,
  nombre_titular VARCHAR(100),
  ultimos_4_digitos CHAR(4),
  mes_vencimiento INT,
  año_vencimiento INT,
  es_default BOOLEAN DEFAULT FALSE,
  es_activo BOOLEAN DEFAULT TRUE,
  fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_ultima_uso TIMESTAMP NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  INDEX idx_usuario (id_usuario),
  INDEX idx_default (es_default)
);

-- ============================================================
-- 6. CREAR TABLA DE HISTORIAL DE PUNTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS historial_puntos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  cantidad INT NOT NULL,
  tipo ENUM('ganado', 'canjeado', 'expirado') DEFAULT 'ganado',
  concepto VARCHAR(255),
  referencia_id INT NULL,
  referencia_tipo VARCHAR(50) NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  INDEX idx_usuario (id_usuario),
  INDEX idx_tipo (tipo),
  INDEX idx_fecha (fecha)
);

-- ============================================================
-- 7. ACTUALIZAR TABLA COMENTARIOS
-- ============================================================
ALTER TABLE comentarios
ADD COLUMN respuesta_hotel TEXT NULL,
ADD COLUMN fecha_respuesta_hotel TIMESTAMP NULL,
ADD COLUMN respondido_por INT NULL,
ADD COLUMN id_reserva INT NULL,
ADD COLUMN es_verificado_compra BOOLEAN DEFAULT FALSE,
ADD FOREIGN KEY (respondido_por) REFERENCES usuarios(id_usuario),
ADD FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva);

-- ============================================================
-- 8. ACTUALIZAR TABLA DE RESERVAS
-- ============================================================
ALTER TABLE reservas
ADD COLUMN hora_llegada_estimada VARCHAR(10),
ADD COLUMN solicitudes_especiales TEXT,
ADD COLUMN metodo_pago ENUM('tarjeta', 'paypal', 'mercadopago', 'transferencia') DEFAULT 'tarjeta',
ADD COLUMN opciones_adicionales JSON,
ADD COLUMN desglose_precio JSON,
ADD COLUMN numero_reserva VARCHAR(20) UNIQUE,
ADD COLUMN descuento_aplicado DECIMAL(8,2) DEFAULT 0,
ADD COLUMN puntos_ganados INT DEFAULT 0,
ADD COLUMN confirmado_por INT NULL,
ADD COLUMN verificacion_entrada BOOLEAN DEFAULT FALSE,
ADD FOREIGN KEY (confirmado_por) REFERENCES usuarios(id_usuario);

-- ============================================================
-- 9. CREAR TABLA DE AUDITORÍA
-- ============================================================
CREATE TABLE IF NOT EXISTS auditoria (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT,
  tabla_afectada VARCHAR(100),
  tipo_accion ENUM('insert', 'update', 'delete') NOT NULL,
  datos_anteriores JSON NULL,
  datos_nuevos JSON NULL,
  id_registro INT,
  ip_address VARCHAR(50),
  user_agent VARCHAR(255),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  INDEX idx_usuario (id_usuario),
  INDEX idx_tabla (tabla_afectada),
  INDEX idx_fecha (fecha)
);

-- ============================================================
-- 10. CREAR TABLA DE CANJE DE PUNTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS canje_puntos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  puntos_canjeados INT NOT NULL,
  descuento_obtenido DECIMAL(8,2) NOT NULL,
  aplicado_a_reserva INT NULL,
  estado ENUM('pendiente', 'aplicado', 'expirado') DEFAULT 'pendiente',
  fecha_canje TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion DATE NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (aplicado_a_reserva) REFERENCES reservas(id_reserva),
  INDEX idx_usuario (id_usuario),
  INDEX idx_estado (estado)
);

-- ============================================================
-- 11. CREAR TABLA DE DESCUENTOS Y PROMOCIONES
-- ============================================================
CREATE TABLE IF NOT EXISTS promociones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  descripcion VARCHAR(255),
  tipo_descuento ENUM('porcentaje', 'monto_fijo') NOT NULL,
  valor_descuento DECIMAL(8,2) NOT NULL,
  max_uso INT,
  usos_actuales INT DEFAULT 0,
  requisito_minimo DECIMAL(8,2) DEFAULT 0,
  aplica_a_roles JSON,
  aplica_a_habitaciones JSON,
  activo BOOLEAN DEFAULT TRUE,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  creado_por INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creado_por) REFERENCES usuarios(id_usuario),
  INDEX idx_codigo (codigo),
  INDEX idx_activo (activo)
);

-- ============================================================
-- 12. CREAR ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_reservas_usuario ON reservas(id_usuario);
CREATE INDEX IF NOT EXISTS idx_reservas_habitacion ON reservas(id_habitacion);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);
CREATE INDEX IF NOT EXISTS idx_reservas_fechas ON reservas(fecha_entrada, fecha_salida);
CREATE INDEX IF NOT EXISTS idx_comentarios_habitacion ON comentarios(id_habitacion);
CREATE INDEX IF NOT EXISTS idx_comentarios_usuario ON comentarios(id_usuario);

-- ============================================================
-- 13. CREAR VISTAS ÚTILES
-- ============================================================

-- Vista de disponibilidad de habitaciones
CREATE OR REPLACE VIEW vista_disponibilidad_habitaciones AS
SELECT 
  h.id_habitacion,
  h.numero_habitacion,
  h.capacidad,
  eh.estado,
  (SELECT COUNT(*) FROM reservas r 
   WHERE r.id_habitacion = h.id_habitacion 
   AND r.estado NOT IN ('cancelada', 'completada')
   AND DATE(r.fecha_entrada) <= CURDATE()
   AND DATE(r.fecha_salida) > CURDATE()) as reservas_activas,
  eh.actualizado_por,
  eh.fecha_actualizacion
FROM habitaciones h
LEFT JOIN estados_habitaciones eh ON h.id_habitacion = eh.id_habitacion;

-- Vista de solicitudes pendientes
CREATE OR REPLACE VIEW vista_solicitudes_pendientes AS
SELECT 
  sh.id,
  sh.id_reserva,
  sh.tipo,
  sh.descripcion,
  sh.prioridad,
  h.numero_habitacion,
  u.nombre as nombre_huesped,
  sh.fecha_creacion,
  sh.estado
FROM solicitudes_huespedes sh
INNER JOIN reservas r ON sh.id_reserva = r.id_reserva
INNER JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
INNER JOIN usuarios u ON r.id_usuario = u.id_usuario
WHERE sh.estado IN ('pendiente', 'en_proceso')
ORDER BY sh.prioridad DESC, sh.fecha_creacion ASC;

-- Vista de desempeño de empleados
CREATE OR REPLACE VIEW vista_desempeño_empleados AS
SELECT 
  u.id_usuario,
  u.nombre,
  u.email,
  (SELECT COUNT(*) FROM registro_checkin WHERE realizado_por = u.id_usuario AND tipo = 'check_in') as checkins_realizados,
  (SELECT COUNT(*) FROM solicitudes_huespedes WHERE resuelto_por = u.id_usuario) as solicitudes_resueltas,
  (SELECT COUNT(*) FROM estados_habitaciones WHERE actualizado_por = u.id_usuario) as cambios_estado,
  (SELECT AVG(DATEDIFF(fecha_resolucion, fecha_creacion)) FROM solicitudes_huespedes 
   WHERE resuelto_por = u.id_usuario) as promedio_tiempo_resolucion
FROM usuarios u
WHERE u.rol = 'empleado'
ORDER BY checkins_realizados DESC;

-- ============================================================
-- FIN DE MIGRACIONES
-- ============================================================
