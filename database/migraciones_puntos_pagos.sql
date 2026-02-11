-- ==============================================
-- Migraciones para Sistema de Puntos y Pagos
-- Hotel Luna Serena - Proyecto Final
-- ==============================================

-- ==============================================
-- 1. AGREGAR COLUMNAS A TABLA USUARIOS
-- ==============================================
ALTER TABLE `usuarios` 
ADD COLUMN `puntos_acumulados` INT DEFAULT 0 COMMENT 'Puntos acumulados del usuario',
ADD COLUMN `total_reservas_completadas` INT DEFAULT 0 COMMENT 'Total de reservas completadas',
ADD COLUMN `total_reseñas` INT DEFAULT 0 COMMENT 'Total de reseñas publicadas',
ADD COLUMN `preferencias` JSON DEFAULT NULL COMMENT 'Preferencias del usuario (JSON)';

-- ==============================================
-- 2. CREAR TABLA HISTORIAL_PUNTOS
-- ==============================================
CREATE TABLE IF NOT EXISTS `historial_puntos` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID del historial',
  `id_usuario` INT NOT NULL COMMENT 'ID del usuario',
  `cantidad` INT NOT NULL COMMENT 'Cantidad de puntos',
  `tipo` ENUM('ganado', 'canjeado') DEFAULT 'ganado' COMMENT 'Tipo de movimiento',
  `concepto` VARCHAR(255) COMMENT 'Concepto (Reserva completada, Reseña publicada, etc)',
  `referencia_id` INT COMMENT 'ID de la referencia (reserva, comentario, etc)',
  `referencia_tipo` VARCHAR(50) COMMENT 'Tipo de referencia (reserva, comentario, canje, etc)',
  `fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha del movimiento',
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE,
  INDEX `idx_usuario_puntos` (`id_usuario`),
  INDEX `idx_tipo_fecha` (`tipo`, `fecha`),
  INDEX `idx_referencia` (`referencia_tipo`, `referencia_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Historial de movimiento de puntos';

-- ==============================================
-- 3. CREAR TABLA METODOS_PAGO_USUARIOS
-- ==============================================
CREATE TABLE IF NOT EXISTS `metodos_pago_usuarios` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID del método de pago',
  `id_usuario` INT NOT NULL COMMENT 'ID del usuario',
  `tipo` ENUM('visa', 'mastercard', 'mercadopago', 'paypal', 'transferencia') NOT NULL COMMENT 'Tipo de método de pago',
  `nombre_titular` VARCHAR(100) COMMENT 'Nombre del titular de la tarjeta',
  `ultimos_4_digitos` CHAR(4) COMMENT 'Últimos 4 dígitos de la tarjeta (para seguridad)',
  `mes_vencimiento` INT COMMENT 'Mes de vencimiento',
  `año_vencimiento` INT COMMENT 'Año de vencimiento',
  `es_default` BOOLEAN DEFAULT FALSE COMMENT 'Si es el método predeterminado',
  `es_activo` BOOLEAN DEFAULT TRUE COMMENT 'Si el método está activo',
  `fecha_agregado` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de agregación',
  `fecha_ultima_uso` TIMESTAMP NULL COMMENT 'Última fecha de uso',
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE,
  INDEX `idx_usuario_metodo` (`id_usuario`),
  INDEX `idx_es_default` (`es_default`),
  INDEX `idx_es_activo` (`es_activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Métodos de pago guardados de usuarios';

-- ==============================================
-- 4. AGREGAR COLUMNAS A TABLA RESERVAS
-- ==============================================
ALTER TABLE `reservas` 
ADD COLUMN `metodo_pago` ENUM('visa', 'mastercard', 'mercadopago', 'paypal', 'transferencia') COMMENT 'Método de pago utilizado',
ADD COLUMN `opciones_adicionales` JSON COMMENT 'Opciones adicionales (desayuno, transporte, etc)',
ADD COLUMN `desglose_precio` JSON COMMENT 'Desglose de precio (subtotal, impuestos, descuento, etc)',
ADD COLUMN `numero_confirmacion` VARCHAR(20) UNIQUE COMMENT 'Número de confirmación de reserva',
ADD COLUMN `puntos_utilizados` INT DEFAULT 0 COMMENT 'Puntos canjeados en esta reserva';

-- ==============================================
-- 5. CREAR TABLA CANJE_PUNTOS
-- ==============================================
CREATE TABLE IF NOT EXISTS `canje_puntos` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID del canje',
  `id_usuario` INT NOT NULL COMMENT 'ID del usuario',
  `puntos_canjeados` INT NOT NULL COMMENT 'Cantidad de puntos canjeados',
  `descuento_obtenido` DECIMAL(10, 2) NOT NULL COMMENT 'Descuento obtenido',
  `estado` ENUM('pendiente', 'aplicado', 'cancelado') DEFAULT 'pendiente' COMMENT 'Estado del canje',
  `id_reserva` INT COMMENT 'ID de la reserva donde se aplicó',
  `fecha_canje` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha del canje',
  `fecha_aplicacion` TIMESTAMP NULL COMMENT 'Fecha de aplicación',
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE,
  FOREIGN KEY (`id_reserva`) REFERENCES `reservas`(`id_reserva`) ON DELETE SET NULL,
  INDEX `idx_usuario_canje` (`id_usuario`),
  INDEX `idx_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Canjes de puntos realizados';

-- ==============================================
-- 6. CREAR TABLA REGISTRO_CHECKIN
-- ==============================================
CREATE TABLE IF NOT EXISTS `registro_checkin` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID del registro',
  `id_reserva` INT NOT NULL COMMENT 'ID de la reserva',
  `tipo` ENUM('check_in', 'check_out') COMMENT 'Tipo de registro',
  `realizado_por` INT COMMENT 'ID del empleado que realizó',
  `observaciones` TEXT COMMENT 'Observaciones adicionales',
  `hora_entrada` TIME COMMENT 'Hora de entrada real',
  `hora_salida` TIME COMMENT 'Hora de salida real',
  `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha del registro',
  FOREIGN KEY (`id_reserva`) REFERENCES `reservas`(`id_reserva`) ON DELETE CASCADE,
  FOREIGN KEY (`realizado_por`) REFERENCES `usuarios`(`id_usuario`) ON DELETE SET NULL,
  INDEX `idx_reserva` (`id_reserva`),
  INDEX `idx_tipo` (`tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Registro de check-in y check-out';

-- ==============================================
-- 7. CREAR TABLA ESTADOS_HABITACIONES
-- ==============================================
CREATE TABLE IF NOT EXISTS `estados_habitaciones` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID del estado',
  `id_habitacion` INT NOT NULL UNIQUE COMMENT 'ID de la habitación',
  `estado` ENUM('disponible', 'ocupada', 'limpieza', 'mantenimiento') DEFAULT 'disponible' COMMENT 'Estado actual',
  `actualizado_por` INT COMMENT 'ID del empleado que actualizó',
  `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',
  FOREIGN KEY (`id_habitacion`) REFERENCES `habitaciones`(`id_habitacion`) ON DELETE CASCADE,
  FOREIGN KEY (`actualizado_por`) REFERENCES `usuarios`(`id_usuario`) ON DELETE SET NULL,
  INDEX `idx_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Estados actuales de las habitaciones';

-- ==============================================
-- 8. CREAR TABLA SOLICITUDES_HUESPEDES
-- ==============================================
CREATE TABLE IF NOT EXISTS `solicitudes_huespedes` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID de la solicitud',
  `id_reserva` INT NOT NULL COMMENT 'ID de la reserva',
  `tipo` VARCHAR(100) COMMENT 'Tipo de solicitud (mantenimiento, limpieza, servicio, etc)',
  `descripcion` TEXT NOT NULL COMMENT 'Descripción de la solicitud',
  `estado` ENUM('pendiente', 'en_proceso', 'resuelta', 'cancelada') DEFAULT 'pendiente' COMMENT 'Estado de la solicitud',
  `prioridad` ENUM('baja', 'media', 'alta', 'urgente') DEFAULT 'media' COMMENT 'Prioridad de la solicitud',
  `creado_por` INT COMMENT 'ID del empleado que creó',
  `resuelto_por` INT COMMENT 'ID del empleado que resolvió',
  `observaciones` TEXT COMMENT 'Observaciones de la resolución',
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
  `fecha_resolucion` TIMESTAMP NULL COMMENT 'Fecha de resolución',
  FOREIGN KEY (`id_reserva`) REFERENCES `reservas`(`id_reserva`) ON DELETE CASCADE,
  FOREIGN KEY (`creado_por`) REFERENCES `usuarios`(`id_usuario`) ON DELETE SET NULL,
  FOREIGN KEY (`resuelto_por`) REFERENCES `usuarios`(`id_usuario`) ON DELETE SET NULL,
  INDEX `idx_reserva` (`id_reserva`),
  INDEX `idx_estado` (`estado`),
  INDEX `idx_prioridad` (`prioridad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Solicitudes de huéspedes';

-- ==============================================
-- 9. CREAR TABLA AUDITORIA
-- ==============================================
CREATE TABLE IF NOT EXISTS `auditoria` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID del registro de auditoría',
  `id_usuario` INT COMMENT 'ID del usuario que realizó la acción',
  `accion` VARCHAR(100) COMMENT 'Tipo de acción',
  `tabla_afectada` VARCHAR(100) COMMENT 'Tabla afectada',
  `tipo_accion` ENUM('insert', 'update', 'delete') COMMENT 'Tipo de acción realizada',
  `id_registro` INT COMMENT 'ID del registro afectado',
  `datos_anteriores` JSON COMMENT 'Datos anteriores (para updates)',
  `datos_nuevos` JSON COMMENT 'Datos nuevos',
  `descripcion` TEXT COMMENT 'Descripción de la acción',
  `fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de la acción',
  `ip_usuario` VARCHAR(45) COMMENT 'IP del usuario',
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE SET NULL,
  INDEX `idx_usuario_auditoria` (`id_usuario`),
  INDEX `idx_tabla_fecha` (`tabla_afectada`, `fecha`),
  INDEX `idx_tipo_accion` (`tipo_accion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Registro de auditoría del sistema';

-- ==============================================
-- 10. CREAR TABLA TRANSACCIONES_PAGO
-- ==============================================
CREATE TABLE IF NOT EXISTS `transacciones_pago` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID de la transacción',
  `id_reserva` INT NOT NULL COMMENT 'ID de la reserva',
  `id_usuario` INT NOT NULL COMMENT 'ID del usuario',
  `monto` DECIMAL(10, 2) NOT NULL COMMENT 'Monto pagado',
  `moneda` VARCHAR(3) DEFAULT 'USD' COMMENT 'Moneda de la transacción',
  `metodo_pago` ENUM('visa', 'mastercard', 'mercadopago', 'paypal', 'transferencia') COMMENT 'Método de pago',
  `estado` ENUM('pendiente', 'procesada', 'fallida', 'reembolsada') DEFAULT 'pendiente' COMMENT 'Estado de la transacción',
  `numero_transaccion` VARCHAR(100) UNIQUE COMMENT 'Número de transacción',
  `respuesta_pago` JSON COMMENT 'Respuesta del procesador de pagos',
  `fecha_transaccion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de la transacción',
  `fecha_confirmacion` TIMESTAMP NULL COMMENT 'Fecha de confirmación',
  FOREIGN KEY (`id_reserva`) REFERENCES `reservas`(`id_reserva`) ON DELETE CASCADE,
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE,
  INDEX `idx_reserva_transaccion` (`id_reserva`),
  INDEX `idx_usuario_transaccion` (`id_usuario`),
  INDEX `idx_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Registro de transacciones de pago';

-- ==============================================
-- 11. CREAR ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ==============================================
ALTER TABLE `reservas` 
ADD INDEX `idx_numero_confirmacion` (`numero_confirmacion`),
ADD INDEX `idx_puntos_utilizados` (`puntos_utilizados`);

-- ==============================================
-- 12. CREAR USUARIOS ROLES PREDEFINIDOS (si no existen)
-- ==============================================
-- Asegurarse que existen un admin y un recepcionista
INSERT INTO `usuarios` 
  (`nombre`, `apellido`, `email`, `telefono`, `password_hash`, `auth_provider`, `rol`, `activo`) 
VALUES 
  ('Admin', 'Sistema', 'admin@hotel.com', NULL, '$2b$10$9j3mgXWi4O0ELE3KOriqUO3qCmFZZh7iqYzJdtt.C7V9Jw7ixwkVK', 'local', 'admin', 1),
  ('Recepcionista', 'Hotel', 'recepcionista@hotel.com', NULL, '$2b$10$9j3mgXWi4O0ELE3KOriqUO3qCmFZZh7iqYzJdtt.C7V9Jw7ixwkVK', 'local', 'empleado', 1)
ON DUPLICATE KEY UPDATE `activo`=1;

-- ==============================================
-- COMMITS Y VALIDACIÓN
-- ==============================================
-- Todos los cambios han sido aplicados
-- Las tablas están listas para ser utilizadas
-- Password por defecto para usuarios de prueba: "password123"
