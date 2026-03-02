-- Migración: Agregar campo metodo_pago a la tabla reservas
-- Este script agrega el campo metodo_pago a la tabla reservas si no existe

ALTER TABLE `reservas` ADD COLUMN `metodo_pago` VARCHAR(50) DEFAULT 'transferencia' AFTER `estado`;

-- Crear índice para buscar por método de pago
ALTER TABLE `reservas` ADD INDEX `idx_metodo_pago` (`metodo_pago`);

-- Comentario de la columna
ALTER TABLE `reservas` MODIFY COLUMN `metodo_pago` VARCHAR(50) COMMENT 'Método de pago utilizado: tarjeta_credito, tarjeta_debito, transferencia, mercadopago, efectivo';
