-- ============================================
-- VERIFICAR E INSERTAR HABITACIÓN 102
-- ============================================

-- 1. Verificar si la habitación 102 existe
SELECT 'PASO 1: Verificar habitación 102' as paso;
SELECT h.id_habitacion, h.numero_habitacion, h.estado, h.activo, t.nombre
FROM habitaciones h
LEFT JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
WHERE h.numero_habitacion = '102';

-- 2. Contar todas las habitaciones
SELECT 'PASO 2: Total de habitaciones en BD' as paso;
SELECT COUNT(*) as total_habitaciones FROM habitaciones;

-- 3. Contar tipos de habitación
SELECT 'PASO 3: Tipos de habitación' as paso;
SELECT * FROM tipos_habitacion;

-- 4. Si la habitación 102 NO existe, crearla correctamente
-- (Si ejecutas esto y la habitación YA existe, no pasa nada porque usamos INSERT IGNORE)

INSERT IGNORE INTO tipos_habitacion 
(nombre, descripcion, capacidad_personas, precio_base, precio_empleado, metros_cuadrados, activo)
VALUES 
('Habitación Estándar Confort', 'Habitación confortable con todas las comodidades básicas y premium', 2, 150.00, 100.00, 32, TRUE);

-- 5. Insertar habitación 102
INSERT IGNORE INTO habitaciones 
(numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
SELECT
  '102',
  id_tipo,
  1,
  'Hermosa habitación estándar con cama queen size de alta calidad. Equipada con TV smart de 55 pulgadas, aire acondicionado silencioso, baño con ducha lluvia y amenities de lujo de marca internacional. WiFi de alta velocidad incluido. Ventanas amplias con vista al jardín del hotel. Decoración moderna y acogedora. Servicio de limpieza diario incluido.',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    'https://images.unsplash.com/photo-1585399546746-1f4fbef50e9d?w=800&q=80',
    'https://images.unsplash.com/photo-1578500495991-246f6c2b3c3d?w=800&q=80'
  ),
  JSON_ARRAY('WiFi Gratis', 'Smart TV 55 Pulgadas', 'Aire Acondicionado', 'Baño Privado Completo', 'Minibar', 'Caja Fuerte', 'Secador de Cabello', 'Servicio de Limpieza Diario'),
  'jardin',
  'disponible',
  TRUE
FROM tipos_habitacion
WHERE nombre = 'Habitación Estándar Confort'
AND NOT EXISTS (
  SELECT 1 FROM habitaciones WHERE numero_habitacion = '102'
);

-- 6. Si ya existe, actualizar su estado
UPDATE habitaciones 
SET estado = 'disponible', activo = TRUE
WHERE numero_habitacion = '102';

-- 7. VERIFICAR FINAL - Ver todas las habitaciones disponibles
SELECT 'PASO 7: Habitaciones disponibles' as paso;
SELECT 
  h.id_habitacion,
  h.numero_habitacion,
  h.estado,
  h.activo,
  h.imagen_principal,
  t.nombre as tipo
FROM habitaciones h
JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
WHERE h.activo = TRUE AND h.estado = 'disponible'
ORDER BY h.id_habitacion DESC
LIMIT 10;
