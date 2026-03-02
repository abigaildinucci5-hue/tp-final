-- ===============================================
-- SCRIPT: Agregar habitaciones por categoría - VERSIÓN CORRECTA
-- Base de Datos: hotel_reservas
-- Adaptado a la estructura real de tablas
-- ===============================================

USE hotel_reservas;

-- ===============================================
-- PASO 1: Verificar/Crear tipos de habitación
-- ===============================================

INSERT IGNORE INTO tipos_habitacion (nombre, descripcion, capacidad_personas, precio_base, precio_empleado, metros_cuadrados, activo)
VALUES
('Estándar', 'Habitación básica con cama doble y baño privado', 2, 50.00, 40.00, 20, 1),
('Confort', 'Habitación espaciosa con cama doble, área de estar y comodidades mejoradas', 2, 85.00, 68.00, 28, 1),
('Deluxe', 'Suite lujosa con cama king, jacuzzi y vistas panorámicas', 2, 150.00, 120.00, 40, 1),
('Suite', 'Suite presidencial con sala de estar, dormitorio separado y servicios premium', 4, 250.00, 200.00, 60, 1)
ON DUPLICATE KEY UPDATE activo = VALUES(activo);

-- ===============================================
-- PASO 2: Insertar HABITACIONES ESTÁNDAR (tipo_id = 1)
-- ===============================================

INSERT INTO habitaciones (numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
VALUES
('101', 1, 1, 
'Habitación estándar acogedora con cama doble, baño privado y escritorio. Perfecta para parejas. Incluye WiFi, TV por cable y aire acondicionado.',
'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
'["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1611967611181-979a0c3a7caa?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1598928506239-c5986d47eb99?w=800&h=600&fit=crop"]',
'["WiFi gratuito", "TV HD", "Aire acondicionado", "Minibar", "Caja fuerte"]',
'ciudad', 'disponible', 1);

INSERT INTO habitaciones (numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
VALUES
('103', 1, 1,
'Habitación estándar con vistas a la calle principal. Incluye WiFi gratuito y TV por cable. Baño renovado con ducha de lluvia.',
'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
'["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1571896836934-eda523ad1cbe?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1591088398332-8c716b6f39f7?w=800&h=600&fit=crop"]',
'["WiFi gratuito", "TV HD", "Aire acondicionado", "Escritorio de trabajo", "Teléfono directo"]',
'ciudad', 'disponible', 1);

INSERT INTO habitaciones (numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
VALUES
('104', 1, 1,
'Habitación estándar con dos camas individuales y sofá cama. Ideal para familias pequeñas o grupos de 3 personas.',
'https://images.unsplash.com/photo-1578654881228-4b676f7f579e?w=800&h=600&fit=crop',
'["https://images.unsplash.com/photo-1578654881228-4b676f7f579e?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"]',
'["WiFi gratuito", "TV HD", "Aire acondicionado", "Zona de estar", "Nevera"]',
'jardin', 'disponible', 1);

INSERT INTO habitaciones (numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
VALUES
('105', 1, 2,
'Habitación estándar con balcón privado. Excelente relación precio-calidad con servicio de primera. Vistas al jardín interior del hotel.',
'https://images.unsplash.com/photo-1561595206-61dff92283df?w=800&h=600&fit=crop',
'["https://images.unsplash.com/photo-1561595206-61dff92283df?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1606396481200-7d405b60228e?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop"]',
'["WiFi gratuito", "TV HD", "Aire acondicionado", "Balcón privado", "Secador de pelo"]',
'jardin', 'disponible', 1);

-- ===============================================
-- PASO 3: Insertar HABITACIONES CONFORT (tipo_id = 2)
-- ===============================================

INSERT INTO habitaciones (numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
VALUES
('201', 2, 2,
'Habitación confort elegante con cama king, área de estar y minibar. Diseño moderno y acogedor con acabados de lujo.',
'https://images.unsplash.com/photo-1551632786-de41ec297e58?w=800&h=600&fit=crop',
'["https://images.unsplash.com/photo-1551632786-de41ec297e58?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1543353521-892cb6553df1?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop"]',
'["WiFi Premium", "TV HD 50 pulgadas", "Aire acondicionado", "Minibar completo", "Caja fuerte", "Bata de baño", "Productos de baño"]',
'ciudad', 'disponible', 1);

INSERT INTO habitaciones (numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
VALUES
('202', 2, 2,
'Habitación confort familiar con dos camas queen, sala de estar amplia y dos baños completos. Perfecta para familias.',
'https://images.unsplash.com/photo-1611967611181-979a0c3a7caa?w=800&h=600&fit=crop',
'["https://images.unsplash.com/photo-1611967611181-979a0c3a7caa?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1618066335917-51453b59a208?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1596178065887-8f519182f725?w=800&h=600&fit=crop"]',
'["WiFi Premium", "TV HD", "Aire acondicionado", "Dos baños", "Sala de estar", "Nevera grande", "Cafetera"]',
'jardin', 'disponible', 1);

INSERT INTO habitaciones (numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
VALUES
('203', 2, 3,
'Habitación confort con vista al jardín, jacuzzi privado en el baño y balcón amplio. Ambiente romántico y relajante.',
'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
'["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1537909352454-79e1b13e7ae0?w=800&h=600&fit=crop"]',
'["WiFi Premium", "TV HD", "Aire acondicionado", "Jacuzzi privado", "Balcón", "Minibar", "Prensa diaria"]',
'jardin', 'disponible', 1);

INSERT INTO habitaciones (numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
VALUES
('204', 2, 3,
'Habitación confort premium con cama king, sofá cama y servicios VIP. Incluye desayuno buffet gratuito.',
'https://images.unsplash.com/photo-1589939705066-3d6e7ba6944b?w=800&h=600&fit=crop',
'["https://images.unsplash.com/photo-1589939705066-3d6e7ba6944b?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1530521954074-e64f47babe48?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop"]',
'["WiFi Premium", "TV HD", "Aire acondicionado", "Sofá cama", "Desayuno incluido", "Room service 24h", "Teléfono VIP"]',
'ciudad', 'disponible', 1);

-- ===============================================
-- PASO 4: Insertar HABITACIONES DELUXE (tipo_id = 3)
-- ===============================================

INSERT INTO habitaciones (numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
VALUES
('301', 3, 4,
'Suite deluxe con cama king, sala de estar separada, jacuzzi privado y vistas panorámicas al mar. Lujo absoluto.',
'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
'["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1598928506239-c5986d47eb99?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1590080876975-07ee6c41f515?w=800&h=600&fit=crop"]',
'["WiFi Premium", "TV Smart HD", "Aire acondicionado", "Jacuzzi privado", "Terraza", "Minibar VIP", "Espejo de aumento", "Toallas premium"]',
'mar', 'disponible', 1);

INSERT INTO habitaciones (numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
VALUES
('302', 3, 4,
'Suite deluxe familiar con dormitorio master, sala de estar amplia y habitación separada. Ideal para familias VIP.',
'https://images.unsplash.com/photo-1591088398332-8c716b6f39f7?w=800&h=600&fit=crop',
'["https://images.unsplash.com/photo-1591088398332-8c716b6f39f7?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1618066335917-51453b59a208?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"]',
'["WiFi Premium", "TV Smart HD", "Aire acondicionado", "Dos salones", "Cocina equipada", "Lavadora", "Room service premium"]',
'jardin', 'disponible', 1);

INSERT INTO habitaciones (numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
VALUES
('303', 3, 5,
'Suite deluxe romántica con cama redonda, champagne cortesía y cena romantica a la luz de velas. Perfecta para luna de miel.',
'https://images.unsplash.com/photo-1509066589191-084633290857?w=800&h=600&fit=crop',
'["https://images.unsplash.com/photo-1509066589191-084633290857?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1571896836934-eda523ad1cbe?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1530521954074-e64f47babe48?w=800&h=600&fit=crop"]',
'["WiFi Premium", "TV Smart HD", "Aire acondicionado", "Cama redonda", "Champagne cortesía", "Pétalos de rosa", "Velas aromáticas"]',
'mar', 'disponible', 1);

INSERT INTO habitaciones (numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
VALUES
('304', 3, 5,
'Suite deluxe ejecutiva con oficina privada, cama king y servicio de concierge 24/7. Para ejecutivos exigentes.',
'https://images.unsplash.com/photo-1616594039964-ae9021eadecf?w=800&h=600&fit=crop',
'["https://images.unsplash.com/photo-1616594039964-ae9021eadecf?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1606306107029-0e100e7f07b5?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop"]',
'["WiFi Premium", "TV Smart HD", "Aire acondicionado", "Oficina privada", "Escritorio ejecutivo", "Concierge 24/7", "Prensa diaria"]',
'ciudad', 'disponible', 1);

-- ===============================================
-- PASO 5: Insertar HABITACIONES SUITE (tipo_id = 4)
-- ===============================================

INSERT INTO habitaciones (numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
VALUES
('401', 4, 6,
'Suite presidencial de lujo total con dos dormitorios, sala de estar, cocina equipada y vistas al océano. Máximo esplendor.',
'https://images.unsplash.com/photo-1571508601348-011eb528158f?w=800&h=600&fit=crop',
'["https://images.unsplash.com/photo-1571508601348-011eb528158f?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1578654881228-4b676f7f579e?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop"]',
'["WiFi Premium", "TV Smart HD", "Aire acondicionado", "Cocina completa", "Dos dormitorios", "Sala de estar", "Bar privado"]',
'mar', 'disponible', 1);

INSERT INTO habitaciones (numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
VALUES
('402', 4, 6,
'Suite presidencial familiar con tres dormitorios, dos salas de estar y piscina privada en el balcón. Para familias reales.',
'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=600&fit=crop',
'["https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1554009001-26dfa06ebeb3?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1563811859556-f4c6d0acba47?w=800&h=600&fit=crop"]',
'["WiFi Premium", "TV Smart HD", "Aire acondicionado", "Piscina privada", "Tres dormitorios", "Dos salones", "Chef privado"]',
'mar', 'disponible', 1);

INSERT INTO habitaciones (numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
VALUES
('403', 4, 7,
'Suite presidencial con vista a la ciudad desde el piso 15. SPA privado, sauna y jacuzzi. Relajación total en altura.',
'https://images.unsplash.com/photo-1615873968403-89e1986277bf?w=800&h=600&fit=crop',
'["https://images.unsplash.com/photo-1615873968403-89e1986277bf?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1610644726919-abc4dd1371aa?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1581808298585-a5f63282ab4f?w=800&h=600&fit=crop"]',
'["WiFi Premium", "TV Smart HD", "Aire acondicionado", "SPA privado", "Sauna", "Jacuzzi", "Sala de masajes"]',
'ciudad', 'disponible', 1);

INSERT INTO habitaciones (numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
VALUES
('404', 4, 7,
'Suite presidencial penthouse con terraza privada, bar, cine privado y helipuerto. El máximo exponente de lujo.',
'https://images.unsplash.com/photo-1615873968403-89e1986277bf?w=800&h=600&fit=crop',
'["https://images.unsplash.com/photo-1615873968403-89e1986277bf?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop"]',
'["WiFi Premium", "TV Smart HD", "Aire acondicionado", "Terraza panorámica", "Cine privado", "Bar completo", "Helipuerto"]',
'mar', 'disponible', 1);

-- ===============================================
-- VERIFICACIÓN: Mostrar datos insertados
-- ===============================================

SELECT 'Total habitaciones insertadas' as verificacion, COUNT(*) as cantidad FROM habitaciones WHERE numero_habitacion BETWEEN '101' AND '404';

SELECT t.nombre as tipo, COUNT(h.id_habitacion) as cantidad_habitaciones
FROM habitaciones h
JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
WHERE h.numero_habitacion BETWEEN '101' AND '404'
GROUP BY t.nombre;

SELECT h.numero_habitacion, t.nombre as tipo, t.capacidad_personas, t.precio_base, h.vista, h.estado
FROM habitaciones h
JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
WHERE h.numero_habitacion BETWEEN '101' AND '404'
ORDER BY h.numero_habitacion;
