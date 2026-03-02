-- ============================================
-- Script para agregar habitación de ejemplo
-- Hotel Luna Serena - Habitación Estándar Confort
-- ============================================

-- 1. Verificar si el tipo de habitación existe, si no crearlo
INSERT IGNORE INTO tipos_habitacion 
(id_tipo, nombre, descripcion, capacidad_personas, precio_base, precio_empleado, metros_cuadrados, activo)
VALUES 
(1, 'Habitación Estándar Confort', 'Habitación confortable con todas las comodidades básicas y premium. Perfecta para parejas o viajeros individuales.', 2, 150.00, 100.00, 32, TRUE);

-- 2. Agregar la habitación 102 con imagen de IA (Unsplash)
-- Imagen: Habitación de hotel moderno y acogedor
INSERT INTO habitaciones 
(numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, galeria_imagenes, amenidades, vista, estado, activo)
VALUES 
(
  '102',
  1,
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
);

-- 3. Verificar que se insertó correctamente
SELECT 
  h.id_habitacion,
  h.numero_habitacion,
  h.piso,
  t.nombre as tipo,
  h.vista,
  h.estado,
  h.imagen_principal,
  h.amenidades
FROM habitaciones h
JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
WHERE h.numero_habitacion = '102'
ORDER BY h.id_habitacion DESC
LIMIT 1;
