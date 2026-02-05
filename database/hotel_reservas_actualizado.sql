-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-02-2026 a las 16:16:27
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hotel_reservas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `id_comentario` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_habitacion` int(11) DEFAULT NULL,
  `id_reserva` int(11) DEFAULT NULL,
  `tipo_comentario` enum('hotel','habitacion') DEFAULT 'hotel',
  `calificacion` int(11) DEFAULT NULL CHECK (`calificacion` between 1 and 5),
  `titulo` varchar(200) DEFAULT NULL,
  `comentario` text NOT NULL,
  `respuesta_hotel` text DEFAULT NULL,
  `fecha_comentario` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_respuesta` timestamp NULL DEFAULT NULL,
  `aprobado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favoritos`
--

CREATE TABLE `favoritos` (
  `id_favorito` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_habitacion` int(11) NOT NULL,
  `fecha_agregado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitaciones`
--

CREATE TABLE `habitaciones` (
  `id_habitacion` int(11) NOT NULL,
  `numero_habitacion` varchar(20) NOT NULL,
  `id_tipo` int(11) NOT NULL,
  `piso` int(11) DEFAULT NULL,
  `descripcion_detallada` text DEFAULT NULL,
  `imagen_principal` varchar(255) DEFAULT NULL,
  `galeria_imagenes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`galeria_imagenes`)),
  `amenidades` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amenidades`)),
  `vista` enum('mar','ciudad','jardin','montaña') DEFAULT NULL,
  `estado` enum('disponible','ocupada','mantenimiento','limpieza') DEFAULT 'disponible',
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habitaciones`
--

INSERT INTO `habitaciones` (`id_habitacion`, `numero_habitacion`, `id_tipo`, `piso`, `descripcion_detallada`, `imagen_principal`, `galeria_imagenes`, `amenidades`, `vista`, `estado`, `activo`) VALUES
(1, '102', 1, 1, 'Hermosa habitación estándar con cama queen size de alta calidad. Equipada con TV smart de 55 pulgadas, aire acondicionado silencioso, baño con ducha lluvia y amenities de lujo de marca internacional. WiFi de alta velocidad incluido. Ventanas amplias con vista al jardín del hotel. Decoración moderna y acogedora. Servicio de limpieza diario incluido.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80', '[\"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80\", \"https://images.unsplash.com/photo-1585399546746-1f4fbef50e9d?w=800&q=80\", \"https://images.unsplash.com/photo-1578500495991-246f6c2b3c3d?w=800&q=80\"]', '[\"WiFi Gratis\", \"Smart TV 55 Pulgadas\", \"Aire Acondicionado\", \"Baño Privado Completo\", \"Minibar\", \"Caja Fuerte\", \"Secador de Cabello\", \"Servicio de Limpieza Diario\"]', 'jardin', 'disponible', 1),
(2, '101', 1, 1, 'Habitación estándar acogedora con cama doble, baño privado y escritorio. Perfecta para parejas. Incluye WiFi, TV por cable y aire acondicionado.', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop', '[\"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1611967611181-979a0c3a7caa?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1598928506239-c5986d47eb99?w=800&h=600&fit=crop\"]', '[\"WiFi gratuito\", \"TV HD\", \"Aire acondicionado\", \"Minibar\", \"Caja fuerte\"]', 'ciudad', 'disponible', 1),
(3, '103', 1, 1, 'Habitación estándar con vistas a la calle principal. Incluye WiFi gratuito y TV por cable. Baño renovado con ducha de lluvia.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', '[\"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1571896836934-eda523ad1cbe?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1591088398332-8c716b6f39f7?w=800&h=600&fit=crop\"]', '[\"WiFi gratuito\", \"TV HD\", \"Aire acondicionado\", \"Escritorio de trabajo\", \"Teléfono directo\"]', 'ciudad', 'disponible', 1),
(4, '104', 1, 1, 'Habitación estándar con dos camas individuales y sofá cama. Ideal para familias pequeñas o grupos de 3 personas.', 'https://images.unsplash.com/photo-1578654881228-4b676f7f579e?w=800&h=600&fit=crop', '[\"https://images.unsplash.com/photo-1578654881228-4b676f7f579e?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop\"]', '[\"WiFi gratuito\", \"TV HD\", \"Aire acondicionado\", \"Zona de estar\", \"Nevera\"]', 'jardin', 'disponible', 1),
(5, '105', 1, 2, 'Habitación estándar con balcón privado. Excelente relación precio-calidad con servicio de primera. Vistas al jardín interior del hotel.', 'https://images.unsplash.com/photo-1561595206-61dff92283df?w=800&h=600&fit=crop', '[\"https://images.unsplash.com/photo-1561595206-61dff92283df?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1606396481200-7d405b60228e?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop\"]', '[\"WiFi gratuito\", \"TV HD\", \"Aire acondicionado\", \"Balcón privado\", \"Secador de pelo\"]', 'jardin', 'disponible', 1),
(6, '201', 2, 2, 'Habitación confort elegante con cama king, área de estar y minibar. Diseño moderno y acogedor con acabados de lujo.', 'https://images.unsplash.com/photo-1551632786-de41ec297e58?w=800&h=600&fit=crop', '[\"https://images.unsplash.com/photo-1551632786-de41ec297e58?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1543353521-892cb6553df1?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop\"]', '[\"WiFi Premium\", \"TV HD 50 pulgadas\", \"Aire acondicionado\", \"Minibar completo\", \"Caja fuerte\", \"Bata de baño\", \"Productos de baño\"]', 'ciudad', 'disponible', 1),
(7, '202', 2, 2, 'Habitación confort familiar con dos camas queen, sala de estar amplia y dos baños completos. Perfecta para familias.', 'https://images.unsplash.com/photo-1611967611181-979a0c3a7caa?w=800&h=600&fit=crop', '[\"https://images.unsplash.com/photo-1611967611181-979a0c3a7caa?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1618066335917-51453b59a208?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1596178065887-8f519182f725?w=800&h=600&fit=crop\"]', '[\"WiFi Premium\", \"TV HD\", \"Aire acondicionado\", \"Dos baños\", \"Sala de estar\", \"Nevera grande\", \"Cafetera\"]', 'jardin', 'disponible', 1),
(8, '203', 2, 3, 'Habitación confort con vista al jardín, jacuzzi privado en el baño y balcón amplio. Ambiente romántico y relajante.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', '[\"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1537909352454-79e1b13e7ae0?w=800&h=600&fit=crop\"]', '[\"WiFi Premium\", \"TV HD\", \"Aire acondicionado\", \"Jacuzzi privado\", \"Balcón\", \"Minibar\", \"Prensa diaria\"]', 'jardin', 'disponible', 1),
(9, '204', 2, 3, 'Habitación confort premium con cama king, sofá cama y servicios VIP. Incluye desayuno buffet gratuito.', 'https://images.unsplash.com/photo-1589939705066-3d6e7ba6944b?w=800&h=600&fit=crop', '[\"https://images.unsplash.com/photo-1589939705066-3d6e7ba6944b?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1530521954074-e64f47babe48?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop\"]', '[\"WiFi Premium\", \"TV HD\", \"Aire acondicionado\", \"Sofá cama\", \"Desayuno incluido\", \"Room service 24h\", \"Teléfono VIP\"]', 'ciudad', 'disponible', 1),
(10, '301', 3, 4, 'Suite deluxe con cama king, sala de estar separada, jacuzzi privado y vistas panorámicas al mar. Lujo absoluto.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', '[\"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1598928506239-c5986d47eb99?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1590080876975-07ee6c41f515?w=800&h=600&fit=crop\"]', '[\"WiFi Premium\", \"TV Smart HD\", \"Aire acondicionado\", \"Jacuzzi privado\", \"Terraza\", \"Minibar VIP\", \"Espejo de aumento\", \"Toallas premium\"]', 'mar', 'disponible', 1),
(11, '302', 3, 4, 'Suite deluxe familiar con dormitorio master, sala de estar amplia y habitación separada. Ideal para familias VIP.', 'https://images.unsplash.com/photo-1591088398332-8c716b6f39f7?w=800&h=600&fit=crop', '[\"https://images.unsplash.com/photo-1591088398332-8c716b6f39f7?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1618066335917-51453b59a208?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop\"]', '[\"WiFi Premium\", \"TV Smart HD\", \"Aire acondicionado\", \"Dos salones\", \"Cocina equipada\", \"Lavadora\", \"Room service premium\"]', 'jardin', 'disponible', 1),
(12, '303', 3, 5, 'Suite deluxe romántica con cama redonda, champagne cortesía y cena romantica a la luz de velas. Perfecta para luna de miel.', 'https://images.unsplash.com/photo-1509066589191-084633290857?w=800&h=600&fit=crop', '[\"https://images.unsplash.com/photo-1509066589191-084633290857?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1571896836934-eda523ad1cbe?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1530521954074-e64f47babe48?w=800&h=600&fit=crop\"]', '[\"WiFi Premium\", \"TV Smart HD\", \"Aire acondicionado\", \"Cama redonda\", \"Champagne cortesía\", \"Pétalos de rosa\", \"Velas aromáticas\"]', 'mar', 'disponible', 1),
(13, '304', 3, 5, 'Suite deluxe ejecutiva con oficina privada, cama king y servicio de concierge 24/7. Para ejecutivos exigentes.', 'https://images.unsplash.com/photo-1616594039964-ae9021eadecf?w=800&h=600&fit=crop', '[\"https://images.unsplash.com/photo-1616594039964-ae9021eadecf?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1606306107029-0e100e7f07b5?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop\"]', '[\"WiFi Premium\", \"TV Smart HD\", \"Aire acondicionado\", \"Oficina privada\", \"Escritorio ejecutivo\", \"Concierge 24/7\", \"Prensa diaria\"]', 'ciudad', 'disponible', 1),
(14, '401', 4, 6, 'Suite presidencial de lujo total con dos dormitorios, sala de estar, cocina equipada y vistas al océano. Máximo esplendor.', 'https://images.unsplash.com/photo-1571508601348-011eb528158f?w=800&h=600&fit=crop', '[\"https://images.unsplash.com/photo-1571508601348-011eb528158f?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1578654881228-4b676f7f579e?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop\"]', '[\"WiFi Premium\", \"TV Smart HD\", \"Aire acondicionado\", \"Cocina completa\", \"Dos dormitorios\", \"Sala de estar\", \"Bar privado\"]', 'mar', 'disponible', 1),
(15, '402', 4, 6, 'Suite presidencial familiar con tres dormitorios, dos salas de estar y piscina privada en el balcón. Para familias reales.', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=600&fit=crop', '[\"https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1554009001-26dfa06ebeb3?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1563811859556-f4c6d0acba47?w=800&h=600&fit=crop\"]', '[\"WiFi Premium\", \"TV Smart HD\", \"Aire acondicionado\", \"Piscina privada\", \"Tres dormitorios\", \"Dos salones\", \"Chef privado\"]', 'mar', 'disponible', 1),
(16, '403', 4, 7, 'Suite presidencial con vista a la ciudad desde el piso 15. SPA privado, sauna y jacuzzi. Relajación total en altura.', 'https://images.unsplash.com/photo-1615873968403-89e1986277bf?w=800&h=600&fit=crop', '[\"https://images.unsplash.com/photo-1615873968403-89e1986277bf?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1610644726919-abc4dd1371aa?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1581808298585-a5f63282ab4f?w=800&h=600&fit=crop\"]', '[\"WiFi Premium\", \"TV Smart HD\", \"Aire acondicionado\", \"SPA privado\", \"Sauna\", \"Jacuzzi\", \"Sala de masajes\"]', 'ciudad', 'disponible', 1),
(17, '404', 4, 7, 'Suite presidencial penthouse con terraza privada, bar, cine privado y helipuerto. El máximo exponente de lujo.', 'https://images.unsplash.com/photo-1615873968403-89e1986277bf?w=800&h=600&fit=crop', '[\"https://images.unsplash.com/photo-1615873968403-89e1986277bf?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop\"]', '[\"WiFi Premium\", \"TV Smart HD\", \"Aire acondicionado\", \"Terraza panorámica\", \"Cine privado\", \"Bar completo\", \"Helipuerto\"]', 'mar', 'disponible', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo` enum('nueva_habitacion','confirmacion_reserva','recordatorio','cancelacion','oferta','sistema') NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `mensaje` text NOT NULL,
  `leida` tinyint(1) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_lectura` timestamp NULL DEFAULT NULL,
  `datos_adicionales` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_adicionales`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id_reserva` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_habitacion` int(11) NOT NULL,
  `fecha_entrada` date NOT NULL,
  `fecha_salida` date NOT NULL,
  `hora_entrada` time DEFAULT '15:00:00',
  `hora_salida` time DEFAULT '11:00:00',
  `numero_huespedes` int(11) NOT NULL,
  `precio_total` decimal(10,2) NOT NULL,
  `descuento_aplicado` decimal(10,2) DEFAULT 0.00,
  `estado` enum('pendiente','confirmada','cancelada','completada','no_show') DEFAULT 'pendiente',
  `notas_especiales` text DEFAULT NULL,
  `confirmada_por` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_modificacion` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `fecha_cancelacion` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_habitacion`
--

CREATE TABLE `tipos_habitacion` (
  `id_tipo` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `capacidad_personas` int(11) NOT NULL,
  `precio_base` decimal(10,2) NOT NULL,
  `precio_empleado` decimal(10,2) NOT NULL,
  `metros_cuadrados` decimal(6,2) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipos_habitacion`
--

INSERT INTO `tipos_habitacion` (`id_tipo`, `nombre`, `descripcion`, `capacidad_personas`, `precio_base`, `precio_empleado`, `metros_cuadrados`, `activo`) VALUES
(1, 'Habitación Estándar Confort', 'Habitación confortable con todas las comodidades básicas y premium. Perfecta para parejas o viajeros individuales.', 2, 150.00, 100.00, 32.00, 1),
(2, 'Habitación Estándar Confort', 'Habitación confortable con todas las comodidades básicas y premium', 2, 150.00, 100.00, 32.00, 1),
(3, 'Estándar', 'Habitación básica con cama doble y baño privado', 0, 0.00, 0.00, NULL, 1),
(4, 'Confort', 'Habitación espaciosa con cama doble, área de estar y comodidades mejoradas', 0, 0.00, 0.00, NULL, 1),
(5, 'Deluxe', 'Suite lujosa con cama king, jacuzzi y vistas panorámicas', 0, 0.00, 0.00, NULL, 1),
(6, 'Suite', 'Suite presidencial con sala de estar, dormitorio separado y servicios premium', 0, 0.00, 0.00, NULL, 1),
(7, 'Estándar', 'Habitación básica con cama doble y baño privado', 2, 50.00, 40.00, 20.00, 1),
(8, 'Confort', 'Habitación espaciosa con cama doble, área de estar y comodidades mejoradas', 2, 85.00, 68.00, 28.00, 1),
(9, 'Deluxe', 'Suite lujosa con cama king, jacuzzi y vistas panorámicas', 2, 150.00, 120.00, 40.00, 1),
(10, 'Suite', 'Suite presidencial con sala de estar, dormitorio separado y servicios premium', 4, 250.00, 200.00, 60.00, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tokens_sesion`
--

CREATE TABLE `tokens_sesion` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `refresh_token` varchar(500) NOT NULL,
  `dispositivo` varchar(100) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `expira_en` timestamp NULL DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tokens_sesion`
--

INSERT INTO `tokens_sesion` (`id`, `id_usuario`, `refresh_token`, `dispositivo`, `ip`, `creado_en`, `expira_en`, `activo`) VALUES
(20, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ2YW5pbmFzYW5jaGV6MjAyNkB5YWhvby5jb20iLCJpYXQiOjE3Njk0MzY1OTEsImV4cCI6MTc3MDA0MTM5MSwiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.fHb34RIKw3W3A4ty_WMG5Ld_qRhW2yx9qriiwcbf3ag', 'unknown', '::1', '2026-01-26 14:09:51', '2026-01-27 14:09:51', 1),
(21, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ2YW5pbmFzYW5jaGV6MjAyNkB5YWhvby5jb20iLCJpYXQiOjE3Njk0MzkyMTEsImV4cCI6MTc3MDA0NDAxMSwiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.xCfrPvrpUpCA7Xru4y5kWIM-54hm5dLYxacO5ik8vGI', 'unknown', '::1', '2026-01-26 14:53:31', '2026-01-27 14:53:31', 1),
(22, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJjZWxlczQ1MzI5MEBnbWFpbC5jb20iLCJpYXQiOjE3Njk0NDA3OTEsImV4cCI6MTc3MDA0NTU5MSwiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.QHgFj56XZKI-cgA2OjRKasMB6w9gZQ2danernE5Iyt4', 'unknown', '::1', '2026-01-26 15:19:51', '2026-01-27 15:19:51', 1),
(23, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ2YW5pbmFzYW5jaGV6MjAyNkB5YWhvby5jb20iLCJpYXQiOjE3Njk0NDI3ODQsImV4cCI6MTc3MDA0NzU4NCwiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.9nQ7lLN7_wQCFU7VL6z05BbNxiWI-xwiML5KOTqCVVM', 'unknown', '::1', '2026-01-26 15:53:04', '2026-01-27 15:53:04', 1),
(24, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ2YW5pbmFzYW5jaGV6MjAyNkB5YWhvby5jb20iLCJpYXQiOjE3Njk0NDM3ODQsImV4cCI6MTc3MDA0ODU4NCwiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.4EvwFDPHrLS-wvgj4xioNrrg4mnEe8jUyfeUmQp3R54', 'unknown', '::1', '2026-01-26 16:09:44', '2026-01-27 16:09:44', 1),
(25, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ2YW5pbmFzYW5jaGV6MjAyNkB5YWhvby5jb20iLCJpYXQiOjE3Njk0NjE2NjksImV4cCI6MTc3MDA2NjQ2OSwiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.OPYFTJwBuTLiPajmn9BgHvj3Ngv3WGs8Vs1O4TsKP_8', 'unknown', '::1', '2026-01-26 21:07:49', '2026-01-27 21:07:49', 1),
(26, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ2YW5pbmFzYW5jaGV6MjAyNkB5YWhvby5jb20iLCJpYXQiOjE3Njk0NjI4MTIsImV4cCI6MTc3MDA2NzYxMiwiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.EcEXhznbQ5ZFhvDTzA-n7j_LhTu3zdyEwz6vZ_wGgpY', 'unknown', '::1', '2026-01-26 21:26:52', '2026-01-27 21:26:52', 1),
(27, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ2YW5pbmFzYW5jaGV6MjAyNkB5YWhvby5jb20iLCJpYXQiOjE3Njk0NjM2MjQsImV4cCI6MTc3MDA2ODQyNCwiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.nU8osSgewxTYC7m0Ay3h-mk9RfnXqCfZBzO2jRB2sso', 'unknown', '::1', '2026-01-26 21:40:24', '2026-01-27 21:40:24', 1),
(28, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ2YW5pbmFzYW5jaGV6MjAyNkB5YWhvby5jb20iLCJpYXQiOjE3Njk0NjM4NjUsImV4cCI6MTc3MDA2ODY2NSwiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.BG3A6yTBi6O7z-iUGPHZER-F1-kVtIdEyDOCxGOjN24', 'unknown', '::1', '2026-01-26 21:44:25', '2026-01-27 21:44:25', 1),
(29, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ2YW5pbmFzYW5jaGV6MjAyNkB5YWhvby5jb20iLCJpYXQiOjE3Njk0NjM5ODMsImV4cCI6MTc3MDA2ODc4MywiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.JRZQqIV0q0bBLekCX1oIJ9hxdaH-PAcyFAITOZeTfBA', 'unknown', '::1', '2026-01-26 21:46:23', '2026-01-27 21:46:23', 1),
(30, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ2YW5pbmFzYW5jaGV6MjAyNkB5YWhvby5jb20iLCJpYXQiOjE3Njk0NjQyNTMsImV4cCI6MTc3MDA2OTA1MywiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.Rsp0zQ1uLk-8DRe4H41w3lWlHLybLzEAGozamaoVTgI', 'unknown', '::1', '2026-01-26 21:50:53', '2026-01-27 21:50:53', 1),
(31, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ2YW5pbmFzYW5jaGV6MjAyNkB5YWhvby5jb20iLCJpYXQiOjE3Njk0NjQzNDUsImV4cCI6MTc3MDA2OTE0NSwiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.CDGzjrE-PlZda62--_x6yEfWX0hOKXgDwkbraHxrIRM', 'unknown', '::1', '2026-01-26 21:52:25', '2026-01-27 21:52:25', 1),
(32, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ2YW5pbmFzYW5jaGV6MjAyNkB5YWhvby5jb20iLCJpYXQiOjE3Njk1MjAxNzAsImV4cCI6MTc3MDEyNDk3MCwiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.ZgQjcuYdNCLyyIWDkA4T_CIGg1CSvPSwFTVB-IbyFYw', 'web', '::1', '2026-01-27 13:22:50', '2026-01-28 13:22:50', 1),
(33, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ2YW5pbmFzYW5jaGV6MjAyNkB5YWhvby5jb20iLCJpYXQiOjE3Njk1MjE3NjYsImV4cCI6MTc3MDEyNjU2NiwiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.sWijeFcbH1ZNMnOIKGEFwsg3e_1vxsHRoe1RXhOH-pU', 'web', '::1', '2026-01-27 13:49:26', '2026-01-28 13:49:26', 1),
(34, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ2YW5pbmFzYW5jaGV6MjAyNkB5YWhvby5jb20iLCJpYXQiOjE3Njk1MjQ1MDgsImV4cCI6MTc3MDEyOTMwOCwiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.Ia08ZnPetIlscSuPK-FfzLsvmM3GRRyaSf87Y5v0cUE', 'web', '::1', '2026-01-27 14:35:08', '2026-01-28 14:35:08', 1),
(35, 10, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoicHJ1ZWJhQGdtYWlsLmNvbSIsImlhdCI6MTc2OTUyODAyMSwiZXhwIjoxNzcwMTMyODIxLCJhdWQiOiJob3RlbC1sdW5hLXNlcmVuYS1hcHAiLCJpc3MiOiJob3RlbC1sdW5hLXNlcmVuYS1hcGkifQ.iJQF68GI6-D_STeu-cP7zPUYWAgg0gqRbW7K9rfyLws', 'web', '::1', '2026-01-27 15:33:41', '2026-01-28 15:33:41', 1),
(37, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoiYWJpZ2FpbGRpbnVjY2lAZ21haWwuY29tIiwiaWF0IjoxNzcwMTIzMDI1LCJleHAiOjE3NzA3Mjc4MjUsImF1ZCI6ImhvdGVsLWx1bmEtc2VyZW5hLWFwcCIsImlzcyI6ImhvdGVsLWx1bmEtc2VyZW5hLWFwaSJ9.GY_iCtkzTGhytscFS1oJMBrV_yCpUCueKCoq7WwbMVA', 'web', '::1', '2026-02-03 12:50:25', '2026-02-04 12:50:25', 1),
(38, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoiYWJpZ2FpbGRpbnVjY2lAZ21haWwuY29tIiwiaWF0IjoxNzcwMTI1MTQ4LCJleHAiOjE3NzA3Mjk5NDgsImF1ZCI6ImhvdGVsLWx1bmEtc2VyZW5hLWFwcCIsImlzcyI6ImhvdGVsLWx1bmEtc2VyZW5hLWFwaSJ9.U0OcYJbYGF4jzxl18aLWs2ws5GU7DgU06yzZsDKkxZA', 'web', '::1', '2026-02-03 13:25:48', '2026-02-04 13:25:48', 1),
(39, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoiYWJpZ2FpbGRpbnVjY2lAZ21haWwuY29tIiwiaWF0IjoxNzcwMTI2MTIxLCJleHAiOjE3NzA3MzA5MjEsImF1ZCI6ImhvdGVsLWx1bmEtc2VyZW5hLWFwcCIsImlzcyI6ImhvdGVsLWx1bmEtc2VyZW5hLWFwaSJ9.2KAZmXk5C0hYiNRQlKu1Hs8m1feJcOpdlGuYUr3pvSw', 'web', '::1', '2026-02-03 13:42:01', '2026-02-04 13:42:01', 1),
(40, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJjZWxlczQ1MzI5MEBnbWFpbC5jb20iLCJpYXQiOjE3NzAxMjY2MjgsImV4cCI6MTc3MDczMTQyOCwiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.Vh50eVW5ZqJUsPYcnLSKcAvZFCdAu_FJm61MeQWBsSA', 'web', '::1', '2026-02-03 13:50:28', '2026-02-04 13:50:28', 1),
(41, 7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJ2YW5pbmFzYW5jaGV6MjAyNkB5YWhvby5jb20iLCJpYXQiOjE3NzAxMjY3MjMsImV4cCI6MTc3MDczMTUyMywiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.hLbKIFMizx5UrkfdKteCyrRbQJrLRVVofSJip0SD8fE', 'web', '::1', '2026-02-03 13:52:03', '2026-02-04 13:52:03', 1),
(42, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJjZWxlczQ1MzI5MEBnbWFpbC5jb20iLCJpYXQiOjE3NzAxMzEzMzksImV4cCI6MTc3MDczNjEzOSwiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.P-zUkrrz-MbNFT2g5WVPIZDTRpy7dDYsjKE44IY-lIo', 'web', '::1', '2026-02-03 15:08:59', '2026-02-04 15:08:59', 1),
(43, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJjZWxlczQ1MzI5MEBnbWFpbC5jb20iLCJpYXQiOjE3NzAxNDkzNjYsImV4cCI6MTc3MDc1NDE2NiwiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.QcxIaWrm_SCwKxZgcl-o1WJS0I47Tv7N59bxTDd11es', 'web', '::1', '2026-02-03 20:09:26', '2026-02-04 20:09:26', 1),
(44, 13, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoiYWJpZ2FpbGRpbnVjY2k1LWh1ZUBnaXRodWIubG9jYWwiLCJpYXQiOjE3NzAyMTY2MTksImV4cCI6MTc3MDgyMTQxOSwiYXVkIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBwIiwiaXNzIjoiaG90ZWwtbHVuYS1zZXJlbmEtYXBpIn0.rnU3HFClBEDeAAOvviEj8JnNWNKDdGtThjQW6G_D9r4', 'web', '::1', '2026-02-04 14:50:20', '2026-02-05 14:50:19', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `auth_provider` enum('local','google','github','facebook') DEFAULT 'local',
  `rol` enum('cliente','empleado','admin') DEFAULT 'cliente',
  `foto_perfil` varchar(255) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `ultimo_acceso` timestamp NULL DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `google_id` varchar(255) DEFAULT NULL,
  `github_id` varchar(255) DEFAULT NULL,
  `facebook_id` varchar(255) DEFAULT NULL,
  `verificado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `email`, `telefono`, `password_hash`, `auth_provider`, `rol`, `foto_perfil`, `fecha_registro`, `ultimo_acceso`, `activo`, `google_id`, `github_id`, `facebook_id`, `verificado`) VALUES
(4, 'Celeste', 'Di Nucci', 'celes453290@gmail.com', '2235066452', '$2b$10$4psjFI35rZ1S66DIi3J7aeZsM6kN3/5gsGZFd./T2QDq5HxZO7PO6', 'google', 'cliente', 'https://lh3.googleusercontent.com/a/ACg8ocIzDWBMhbUiijs_kcbMfytr5-cqGsN-R0sPSZRfzLaHmXKgaQ=s96-c', '2026-01-06 22:14:59', '2026-02-03 20:09:26', 1, '111400145042571448651', NULL, NULL, 0),
(7, 'Vane', 'Sanchez', 'vaninasanchez2026@yahoo.com', NULL, '$2b$10$q8W0kl67ZZgwjT4kgOtw/uI10wyI06D44daWeZ4FF7zss3mtH5OAW', 'local', 'cliente', NULL, '2026-01-07 14:58:33', '2026-02-03 13:52:03', 1, NULL, NULL, NULL, 1),
(9, 'Axel', 'Sanchez', 'axl_sanchez@yahoo.com', NULL, '$2b$10$Oehyh5QCb7gVreVcNqBX1.rmHucaTupEtMglF4GIwdlGh4fkfB1na', 'local', 'cliente', NULL, '2026-01-20 23:50:52', NULL, 1, NULL, NULL, NULL, 1),
(10, 'Usuario', 'Prueba', 'prueba@gmail.com', NULL, '$2b$10$9j3mgXWi4O0ELE3KOriqUO3qCmFZZh7iqYzJdtt.C7VJe3PVU2Hem', 'local', 'cliente', NULL, '2026-01-27 15:33:41', NULL, 1, NULL, NULL, NULL, 1),
(12, 'Abigail Celeste', 'Di Nucci', 'abigaildinucci@gmail.com', NULL, NULL, 'google', 'cliente', 'https://lh3.googleusercontent.com/a/ACg8ocJqDcdk-M9C81pT0nhSKnN4hikq9DWETzQzTeBdA42kF-AIfg=s96-c', '2026-02-03 12:50:25', '2026-02-03 13:42:01', 1, '112825145529148573129', NULL, NULL, 1),
(13, 'abigaildinucci5-hue', 'GitHub', 'abigaildinucci5-hue@github.local', NULL, NULL, 'github', 'cliente', 'https://avatars.githubusercontent.com/u/258935244?v=4', '2026-02-04 14:50:19', '2026-02-04 14:50:20', 1, NULL, '258935244', NULL, 1),
(14, 'Admin', 'Sistema', 'admin@hotel.com', NULL, '$2b$10$9j3mgXWi4O0ELE3KOriqUO3qCmFZZh7iqYzJdtt.C7V9Jw7ixwkVK', 'local', 'admin', NULL, '2026-02-05 15:04:55', NULL, 1, NULL, NULL, NULL, 1),
(15, 'Recepcionista', 'Hotel', 'recepcionista@hotel.com', NULL, '$2b$10$9j3mgXWi4O0ELE3KOriqUO3qCmFZZh7iqYzJdtt.C7V9Jw7ixwkVK', 'local', 'empleado', NULL, '2026-02-05 15:04:55', NULL, 1, NULL, NULL, NULL, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id_comentario`),
  ADD KEY `id_reserva` (`id_reserva`),
  ADD KEY `idx_habitacion_comentario` (`id_habitacion`),
  ADD KEY `idx_usuario_comentario` (`id_usuario`),
  ADD KEY `idx_aprobado` (`aprobado`);

--
-- Indices de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD PRIMARY KEY (`id_favorito`),
  ADD UNIQUE KEY `unique_favorito` (`id_usuario`,`id_habitacion`),
  ADD KEY `id_habitacion` (`id_habitacion`),
  ADD KEY `idx_usuario_favorito` (`id_usuario`);

--
-- Indices de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD PRIMARY KEY (`id_habitacion`),
  ADD UNIQUE KEY `numero_habitacion` (`numero_habitacion`),
  ADD KEY `idx_tipo` (`id_tipo`),
  ADD KEY `idx_estado` (`estado`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `idx_usuario_notificacion` (`id_usuario`),
  ADD KEY `idx_leida` (`leida`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id_reserva`),
  ADD KEY `confirmada_por` (`confirmada_por`),
  ADD KEY `idx_usuario` (`id_usuario`),
  ADD KEY `idx_habitacion` (`id_habitacion`),
  ADD KEY `idx_fechas` (`fecha_entrada`,`fecha_salida`),
  ADD KEY `idx_estado` (`estado`);

--
-- Indices de la tabla `tipos_habitacion`
--
ALTER TABLE `tipos_habitacion`
  ADD PRIMARY KEY (`id_tipo`);

--
-- Indices de la tabla `tokens_sesion`
--
ALTER TABLE `tokens_sesion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tokens_usuario` (`id_usuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `google_id` (`google_id`),
  ADD UNIQUE KEY `facebook_id` (`facebook_id`),
  ADD UNIQUE KEY `github_id` (`github_id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_rol` (`rol`),
  ADD KEY `idx_google_id` (`google_id`),
  ADD KEY `idx_github_id` (`github_id`),
  ADD KEY `idx_auth_provider` (`auth_provider`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id_comentario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  MODIFY `id_favorito` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  MODIFY `id_habitacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id_reserva` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipos_habitacion`
--
ALTER TABLE `tipos_habitacion`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `tokens_sesion`
--
ALTER TABLE `tokens_sesion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`id_habitacion`) REFERENCES `habitaciones` (`id_habitacion`) ON DELETE SET NULL,
  ADD CONSTRAINT `comentarios_ibfk_3` FOREIGN KEY (`id_reserva`) REFERENCES `reservas` (`id_reserva`) ON DELETE SET NULL;

--
-- Filtros para la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`id_habitacion`) REFERENCES `habitaciones` (`id_habitacion`) ON DELETE CASCADE;

--
-- Filtros para la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD CONSTRAINT `habitaciones_ibfk_1` FOREIGN KEY (`id_tipo`) REFERENCES `tipos_habitacion` (`id_tipo`);

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`id_habitacion`) REFERENCES `habitaciones` (`id_habitacion`),
  ADD CONSTRAINT `reservas_ibfk_3` FOREIGN KEY (`confirmada_por`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `tokens_sesion`
--
ALTER TABLE `tokens_sesion`
  ADD CONSTRAINT `fk_tokens_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
