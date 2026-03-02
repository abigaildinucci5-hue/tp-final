-- ==============================================
-- Migración: Tablas necesarias para endpoints de empleado
-- Hospital 500 errors en /api/empleado/*
-- ==============================================

-- 1. CREAR TABLA ESTADOS_HABITACIONES (CRÍTICA)
-- Esta tabla es usada por: GET /api/empleado/habitaciones/estado
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

-- 2. CREAR TABLA SOLICITUDES_HUESPEDES (CRÍTICA)
-- Esta tabla es usada por: GET /api/empleado/solicitudes/pendientes
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

-- 3. CREAR TABLA REGISTRO_CHECKIN (CRÍTICA)
-- Esta tabla es usada por: GET /api/empleado/reservas/hoy (para verificar tieneCheckin)
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

-- 4. INICIALIZAR ESTADOS DE HABITACIONES
-- Crear una entrada para cada habitación existente con estado 'disponible'
-- ==============================================
INSERT INTO `estados_habitaciones` (`id_habitacion`, `estado`)
SELECT `id_habitacion`, 'disponible'
FROM `habitaciones` h
WHERE NOT EXISTS (
  SELECT 1 FROM `estados_habitaciones` eh WHERE eh.`id_habitacion` = h.`id_habitacion`
)
ON DUPLICATE KEY UPDATE estado=VALUES(estado);

-- Completado!
