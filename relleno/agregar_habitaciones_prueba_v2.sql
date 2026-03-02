-- ===============================================
-- SCRIPT: Agregar 4 habitaciones por categoría (v2 - compatible)
-- Base de Datos: hotel_reservas
-- Ejecutar en phpMyAdmin si hay problemas con la v1
-- ===============================================

USE hotel_reservas;

-- Primero, verifica la estructura de la tabla:
-- DESCRIBE habitaciones;

-- ===============================================
-- TIPO 1: ESTÁNDAR - 4 habitaciones
-- ===============================================

INSERT INTO habitaciones 
(numero, tipo, estado, activo, capacidad, numero_camas, tamaño_m2, precio_noche, descripcion, imagen_principal)
VALUES
(101, 'Estándar', 'disponible', 1, 2, 1, 20, 50.00, 
'Habitación estándar acogedora con cama doble, baño privado y escritorio. Perfecta para parejas.',
'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop');

INSERT INTO habitaciones 
(numero, tipo, estado, activo, capacidad, numero_camas, tamaño_m2, precio_noche, descripcion, imagen_principal)
VALUES
(103, 'Estándar', 'disponible', 1, 2, 1, 20, 55.00,
'Habitación estándar con vistas a la calle principal. Incluye WiFi gratuito y TV por cable.',
'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop');

INSERT INTO habitaciones 
(numero, tipo, estado, activo, capacidad, numero_camas, tamaño_m2, precio_noche, descripcion, imagen_principal)
VALUES
(104, 'Estándar', 'disponible', 1, 3, 2, 22, 60.00,
'Habitación estándar familiar con dos camas individuales y cama adicional. Ideal para familias pequeñas.',
'https://images.unsplash.com/photo-1578654881228-4b676f7f579e?w=800&h=600&fit=crop');

INSERT INTO habitaciones 
(numero, tipo, estado, activo, capacidad, numero_camas, tamaño_m2, precio_noche, descripcion, imagen_principal)
VALUES
(105, 'Estándar', 'disponible', 1, 2, 1, 21, 52.00,
'Habitación estándar con balcón privado. Excelente relación precio-calidad con servicio de primera.',
'https://images.unsplash.com/photo-1561595206-61dff92283df?w=800&h=600&fit=crop');

-- ===============================================
-- TIPO 2: CONFORT - 4 habitaciones
-- ===============================================

INSERT INTO habitaciones 
(numero, tipo, estado, activo, capacidad, numero_camas, tamaño_m2, precio_noche, descripcion, imagen_principal)
VALUES
(201, 'Confort', 'disponible', 1, 2, 1, 28, 85.00,
'Habitación confort elegante con cama king, área de estar y minibar. Diseño moderno y acogedor.',
'https://images.unsplash.com/photo-1551632786-de41ec297e58?w=800&h=600&fit=crop');

INSERT INTO habitaciones 
(numero, tipo, estado, activo, capacidad, numero_camas, tamaño_m2, precio_noche, descripcion, imagen_principal)
VALUES
(202, 'Confort', 'disponible', 1, 4, 2, 32, 95.00,
'Habitación confort familiar con dos camas queen, sala de estar y dos baños. Perfecta para familias.',
'https://images.unsplash.com/photo-1611967611181-979a0c3a7caa?w=800&h=600&fit=crop');

INSERT INTO habitaciones 
(numero, tipo, estado, activo, capacidad, numero_camas, tamaño_m2, precio_noche, descripcion, imagen_principal)
VALUES
(203, 'Confort', 'disponible', 1, 2, 1, 29, 80.00,
'Habitación confort con vista al jardín, jacuzzi privado en el baño y balcón amplio.',
'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop');

INSERT INTO habitaciones 
(numero, tipo, estado, activo, capacidad, numero_camas, tamaño_m2, precio_noche, descripcion, imagen_principal)
VALUES
(204, 'Confort', 'disponible', 1, 3, 1, 30, 90.00,
'Habitación confort premium con cama king, sofá cama y servicios VIP. Incluye desayuno buffet.',
'https://images.unsplash.com/photo-1589939705066-3d6e7ba6944b?w=800&h=600&fit=crop');

-- ===============================================
-- TIPO 3: DELUXE - 4 habitaciones
-- ===============================================

INSERT INTO habitaciones 
(numero, tipo, estado, activo, capacidad, numero_camas, tamaño_m2, precio_noche, descripcion, imagen_principal)
VALUES
(301, 'Deluxe', 'disponible', 1, 2, 1, 40, 150.00,
'Suite deluxe con cama king, sala de estar separada, jacuzzi privado y vistas panorámicas al mar.',
'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop');

INSERT INTO habitaciones 
(numero, tipo, estado, activo, capacidad, numero_camas, tamaño_m2, precio_noche, descripcion, imagen_principal)
VALUES
(302, 'Deluxe', 'disponible', 1, 4, 2, 45, 165.00,
'Suite deluxe familiar con dormitorio master, sala de estar y habitación separada. Lujo total.',
'https://images.unsplash.com/photo-1591088398332-8c716b6f39f7?w=800&h=600&fit=crop');

INSERT INTO habitaciones 
(numero, tipo, estado, activo, capacidad, numero_camas, tamaño_m2, precio_noche, descripcion, imagen_principal)
VALUES
(303, 'Deluxe', 'disponible', 1, 2, 1, 42, 155.00,
'Suite deluxe romántica con cama redonda, champagne cortesía y romántica cena a la luz de velas.',
'https://images.unsplash.com/photo-1509066589191-084633290857?w=800&h=600&fit=crop');

INSERT INTO habitaciones 
(numero, tipo, estado, activo, capacidad, numero_camas, tamaño_m2, precio_noche, descripcion, imagen_principal)
VALUES
(304, 'Deluxe', 'disponible', 1, 3, 1, 44, 160.00,
'Suite deluxe ejecutiva con oficina privada, cama king y servicio de concierge 24/7 incluido.',
'https://images.unsplash.com/photo-1616594039964-ae9021eadecf?w=800&h=600&fit=crop');

-- ===============================================
-- TIPO 4: SUITE - 4 habitaciones (Presidencial)
-- ===============================================

INSERT INTO habitaciones 
(numero, tipo, estado, activo, capacidad, numero_camas, tamaño_m2, precio_noche, descripcion, imagen_principal)
VALUES
(401, 'Suite', 'disponible', 1, 4, 2, 60, 250.00,
'Suite presidencial de lujo total con dos dormitorios, sala de estar, cocina equipada y vistas al océano.',
'https://images.unsplash.com/photo-1571508601348-011eb528158f?w=800&h=600&fit=crop');

INSERT INTO habitaciones 
(numero, tipo, estado, activo, capacidad, numero_camas, tamaño_m2, precio_noche, descripcion, imagen_principal)
VALUES
(402, 'Suite', 'disponible', 1, 6, 3, 70, 280.00,
'Suite presidencial familiar con tres dormitorios, dos salas de estar, piscina privada en el balcón.',
'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=600&fit=crop');

INSERT INTO habitaciones 
(numero, tipo, estado, activo, capacidad, numero_camas, tamaño_m2, precio_noche, descripcion, imagen_principal)
VALUES
(403, 'Suite', 'disponible', 1, 4, 2, 65, 260.00,
'Suite presidencial con vista a la ciudad desde el piso 15. SPA privado, sauna y jacuzzi.',
'https://images.unsplash.com/photo-1615873968403-89e1986277bf?w=800&h=600&fit=crop');

INSERT INTO habitaciones 
(numero, tipo, estado, activo, capacidad, numero_camas, tamaño_m2, precio_noche, descripcion, imagen_principal)
VALUES
(404, 'Suite', 'disponible', 1, 5, 2, 68, 275.00,
'Suite presidencial penthouse con terraza privada, bar, cine privado y helipuerto. Máximo lujo.',
'https://images.unsplash.com/photo-1615873968403-89e1986277bf?w=800&h=600&fit=crop');

-- ===============================================
-- Verificación de inserciones
-- ===============================================

SELECT COUNT(*) as total_habitaciones FROM habitaciones WHERE numero BETWEEN 101 AND 404;
SELECT tipo, COUNT(*) as cantidad FROM habitaciones WHERE numero BETWEEN 101 AND 404 GROUP BY tipo;
SELECT numero, tipo, capacidad, precio_noche, estado FROM habitaciones WHERE numero BETWEEN 101 AND 404 ORDER BY numero;
