-- Base de datos: hotel_reservas
-- Estructura completa para el sistema de reservas

-- Tabla de usuarios
CREATE TABLE usuarios (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('cliente', 'empleado', 'admin') DEFAULT 'cliente',
  foto_perfil VARCHAR(255),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimo_acceso TIMESTAMP NULL,
  activo BOOLEAN DEFAULT TRUE,
  google_id VARCHAR(255) UNIQUE,
  facebook_id VARCHAR(255) UNIQUE,
  verificado BOOLEAN DEFAULT FALSE,
  token_verificacion VARCHAR(255),
  INDEX idx_email (email),
  INDEX idx_rol (rol)
);

-- Tabla de tipos de habitación
CREATE TABLE tipos_habitacion (
  id_tipo INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  capacidad_personas INT NOT NULL,
  precio_base DECIMAL(10,2) NOT NULL,
  precio_empleado DECIMAL(10,2) NOT NULL,
  metros_cuadrados DECIMAL(6,2),
  activo BOOLEAN DEFAULT TRUE
);

-- Tabla de habitaciones
CREATE TABLE habitaciones (
  id_habitacion INT PRIMARY KEY AUTO_INCREMENT,
  numero_habitacion VARCHAR(20) UNIQUE NOT NULL,
  id_tipo INT NOT NULL,
  piso INT,
  descripcion_detallada TEXT,
  imagen_principal VARCHAR(255),
  galeria_imagenes JSON,
  amenidades JSON,
  vista ENUM('mar', 'ciudad', 'jardin', 'montaña'),
  estado ENUM('disponible', 'ocupada', 'mantenimiento', 'limpieza') DEFAULT 'disponible',
  activo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (id_tipo) REFERENCES tipos_habitacion(id_tipo),
  INDEX idx_tipo (id_tipo),
  INDEX idx_estado (estado)
);

-- Tabla de reservas
CREATE TABLE reservas (
  id_reserva INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  id_habitacion INT NOT NULL,
  fecha_entrada DATE NOT NULL,
  fecha_salida DATE NOT NULL,
  hora_entrada TIME DEFAULT '15:00:00',
  hora_salida TIME DEFAULT '11:00:00',
  numero_huespedes INT NOT NULL,
  precio_total DECIMAL(10,2) NOT NULL,
  descuento_aplicado DECIMAL(10,2) DEFAULT 0,
  estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada', 'no_show') DEFAULT 'pendiente',
  notas_especiales TEXT,
  confirmada_por INT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  fecha_cancelacion TIMESTAMP NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_habitacion) REFERENCES habitaciones(id_habitacion),
  FOREIGN KEY (confirmada_por) REFERENCES usuarios(id_usuario),
  INDEX idx_usuario (id_usuario),
  INDEX idx_habitacion (id_habitacion),
  INDEX idx_fechas (fecha_entrada, fecha_salida),
  INDEX idx_estado (estado)
);

-- Tabla de favoritos
CREATE TABLE favoritos (
  id_favorito INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  id_habitacion INT NOT NULL,
  fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_habitacion) REFERENCES habitaciones(id_habitacion) ON DELETE CASCADE,
  UNIQUE KEY unique_favorito (id_usuario, id_habitacion),
  INDEX idx_usuario_favorito (id_usuario)
);

-- Tabla de comentarios y reseñas
CREATE TABLE comentarios (
  id_comentario INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  id_habitacion INT,
  id_reserva INT,
  tipo_comentario ENUM('hotel', 'habitacion') DEFAULT 'hotel',
  calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
  titulo VARCHAR(200),
  comentario TEXT NOT NULL,
  respuesta_hotel TEXT,
  fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_respuesta TIMESTAMP NULL,
  aprobado BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_habitacion) REFERENCES habitaciones(id_habitacion) ON DELETE SET NULL,
  FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva) ON DELETE SET NULL,
  INDEX idx_habitacion_comentario (id_habitacion),
  INDEX idx_usuario_comentario (id_usuario),
  INDEX idx_aprobado (aprobado)
);

-- Tabla de notificaciones
CREATE TABLE notificaciones (
  id_notificacion INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  tipo ENUM('nueva_habitacion', 'confirmacion_reserva', 'recordatorio', 'cancelacion', 'oferta', 'sistema') NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT NOT NULL,
  leida BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_lectura TIMESTAMP NULL,
  datos_adicionales JSON,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  INDEX idx_usuario_notificacion (id_usuario),
  INDEX idx_leida (leida)
);

-- Tabla de tokens de sesión
CREATE TABLE tokens_sesion (
  id_token INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  refresh_token VARCHAR(500),
  dispositivo VARCHAR(255),
  ip_address VARCHAR(50),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion TIMESTAMP NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  INDEX idx_token (token(255)),
  INDEX idx_usuario_token (id_usuario)
);

-- Tabla de configuración del hotel
CREATE TABLE configuracion_hotel (
  id_config INT PRIMARY KEY AUTO_INCREMENT,
  clave VARCHAR(100) UNIQUE NOT NULL,
  valor TEXT,
  descripcion VARCHAR(255),
  tipo_dato ENUM('texto', 'numero', 'booleano', 'json') DEFAULT 'texto'
);

-- Tabla de auditoría
CREATE TABLE auditoria (
  id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT,
  accion VARCHAR(100) NOT NULL,
  tabla_afectada VARCHAR(50),
  id_registro INT,
  datos_anteriores JSON,
  datos_nuevos JSON,
  ip_address VARCHAR(50),
  fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
  INDEX idx_usuario_auditoria (id_usuario),
  INDEX idx_tabla (tabla_afectada),
  INDEX idx_fecha (fecha_accion)
);

-- Datos iniciales de tipos de habitación
INSERT INTO tipos_habitacion (nombre, descripcion, capacidad_personas, precio_base, precio_empleado, metros_cuadrados) VALUES
('Suite Executive', 'Suite elegante con vista panorámica, sala de estar separada y amenidades premium', 2, 250.00, 175.00, 45.00),
('Habitación Deluxe', 'Habitación espaciosa con cama king size y baño de lujo', 2, 180.00, 126.00, 35.00),
('Habitación Estándar', 'Habitación confortable con todas las comodidades básicas', 2, 120.00, 84.00, 28.00),
('Suite Familiar', 'Suite amplia ideal para familias, con dos habitaciones conectadas', 4, 320.00, 224.00, 60.00),
('Habitación Individual', 'Perfecta para viajeros de negocios o solitarios', 1, 90.00, 63.00, 22.00);

-- Datos iniciales de configuración
INSERT INTO configuracion_hotel (clave, valor, descripcion, tipo_dato) VALUES
('nombre_hotel', 'Hotel Luna Serena', 'Nombre del hotel', 'texto'),
('direccion', 'Av. Costanera 1234, Mar del Plata', 'Dirección física', 'texto'),
('telefono', '+54 223 123-4567', 'Teléfono principal', 'texto'),
('email', 'info@hotellunaserena.com', 'Email de contacto', 'texto'),
('hora_checkin', '15:00', 'Hora de check-in', 'texto'),
('hora_checkout', '11:00', 'Hora de check-out', 'texto'),
('dias_cancelacion_gratis', '2', 'Días antes para cancelación sin cargo', 'numero'),
('descuento_empleado_porcentaje', '30', 'Porcentaje de descuento para empleados', 'numero');