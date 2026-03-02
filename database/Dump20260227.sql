CREATE DATABASE  IF NOT EXISTS `railway` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `railway`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: shinkansen.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comentarios`
--

DROP TABLE IF EXISTS `comentarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comentarios` (
  `id_comentario` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_habitacion` int DEFAULT NULL,
  `id_reserva` int DEFAULT NULL,
  `tipo_comentario` enum('hotel','habitacion') COLLATE utf8mb4_general_ci DEFAULT 'hotel',
  `calificacion` int DEFAULT NULL,
  `titulo` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `comentario` text COLLATE utf8mb4_general_ci NOT NULL,
  `respuesta_hotel` text COLLATE utf8mb4_general_ci,
  `fecha_comentario` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_respuesta` timestamp NULL DEFAULT NULL,
  `aprobado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_comentario`),
  KEY `id_reserva` (`id_reserva`),
  KEY `idx_habitacion_comentario` (`id_habitacion`),
  KEY `idx_usuario_comentario` (`id_usuario`),
  KEY `idx_aprobado` (`aprobado`),
  CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`id_habitacion`) REFERENCES `habitaciones` (`id_habitacion`) ON DELETE SET NULL,
  CONSTRAINT `comentarios_ibfk_3` FOREIGN KEY (`id_reserva`) REFERENCES `reservas` (`id_reserva`) ON DELETE SET NULL,
  CONSTRAINT `comentarios_chk_1` CHECK ((`calificacion` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentarios`
--

LOCK TABLES `comentarios` WRITE;
/*!40000 ALTER TABLE `comentarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `comentarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos` (
  `id_favorito` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_habitacion` int NOT NULL,
  `fecha_agregado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_favorito`),
  UNIQUE KEY `unique_favorito` (`id_usuario`,`id_habitacion`),
  KEY `id_habitacion` (`id_habitacion`),
  KEY `idx_usuario_favorito` (`id_usuario`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`id_habitacion`) REFERENCES `habitaciones` (`id_habitacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habitaciones`
--

DROP TABLE IF EXISTS `habitaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habitaciones` (
  `id_habitacion` int NOT NULL AUTO_INCREMENT,
  `numero_habitacion` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `id_tipo` int NOT NULL,
  `piso` int DEFAULT NULL,
  `descripcion_detallada` text COLLATE utf8mb4_general_ci,
  `imagen_principal` text COLLATE utf8mb4_general_ci,
  `galeria_imagenes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `amenidades` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `vista` enum('mar','ciudad','jardin','montaña') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` enum('disponible','ocupada','mantenimiento','limpieza') COLLATE utf8mb4_general_ci DEFAULT 'disponible',
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_habitacion`),
  UNIQUE KEY `numero_habitacion` (`numero_habitacion`),
  KEY `idx_tipo` (`id_tipo`),
  KEY `idx_estado` (`estado`),
  CONSTRAINT `habitaciones_ibfk_1` FOREIGN KEY (`id_tipo`) REFERENCES `tipos_habitacion` (`id_tipo`),
  CONSTRAINT `habitaciones_chk_1` CHECK (json_valid(`galeria_imagenes`)),
  CONSTRAINT `habitaciones_chk_2` CHECK (json_valid(`amenidades`))
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habitaciones`
--

LOCK TABLES `habitaciones` WRITE;
/*!40000 ALTER TABLE `habitaciones` DISABLE KEYS */;
INSERT INTO `habitaciones` VALUES (1,'102',1,1,'Hermosa habitación estándar con cama queen size de alta calidad. Equipada con TV smart de 55 pulgadas, aire acondicionado silencioso, baño con ducha lluvia y amenities de lujo de marca internacional. WiFi de alta velocidad incluido. Ventanas amplias con vista al jardín del hotel. Decoración moderna y acogedora. Servicio de limpieza diario incluido.','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80','[\"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80\", \"https://images.unsplash.com/photo-1585399546746-1f4fbef50e9d?w=800&q=80\", \"https://images.unsplash.com/photo-1578500495991-246f6c2b3c3d?w=800&q=80\"]','[\"WiFi Gratis\", \"Smart TV 55 Pulgadas\", \"Aire Acondicionado\", \"Baño Privado Completo\", \"Minibar\", \"Caja Fuerte\", \"Secador de Cabello\", \"Servicio de Limpieza Diario\"]','jardin','disponible',1),(2,'101',1,1,'Habitación estándar acogedora con cama doble, baño privado y escritorio. Perfecta para parejas. Incluye WiFi, TV por cable y aire acondicionado.','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop','[\"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1611967611181-979a0c3a7caa?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1598928506239-c5986d47eb99?w=800&h=600&fit=crop\"]','[\"WiFi gratuito\", \"TV HD\", \"Aire acondicionado\", \"Minibar\", \"Caja fuerte\"]','ciudad','disponible',1),(3,'103',1,1,'Habitación estándar con vistas a la calle principal. Incluye WiFi gratuito y TV por cable. Baño renovado con ducha de lluvia.','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop','[\"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1571896836934-eda523ad1cbe?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1591088398332-8c716b6f39f7?w=800&h=600&fit=crop\"]','[\"WiFi gratuito\", \"TV HD\", \"Aire acondicionado\", \"Escritorio de trabajo\", \"Teléfono directo\"]','ciudad','disponible',1),(4,'104',1,1,'Habitación estándar con dos camas individuales y sofá cama. Ideal para familias pequeñas o grupos de 3 personas.','https://images.unsplash.com/photo-1578654881228-4b676f7f579e?w=800&h=600&fit=crop','[\"https://images.unsplash.com/photo-1578654881228-4b676f7f579e?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop\"]','[\"WiFi gratuito\", \"TV HD\", \"Aire acondicionado\", \"Zona de estar\", \"Nevera\"]','jardin','disponible',1),(5,'105',1,2,'Habitación estándar con balcón privado. Excelente relación precio-calidad con servicio de primera. Vistas al jardín interior del hotel.','https://images.unsplash.com/photo-1561595206-61dff92283df?w=800&h=600&fit=crop','[\"https://images.unsplash.com/photo-1561595206-61dff92283df?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1606396481200-7d405b60228e?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop\"]','[\"WiFi gratuito\", \"TV HD\", \"Aire acondicionado\", \"Balcón privado\", \"Secador de pelo\"]','jardin','disponible',1),(6,'201',2,2,'Habitación confort elegante con cama king, área de estar y minibar. Diseño moderno y acogedor con acabados de lujo.','https://images.unsplash.com/photo-1551632786-de41ec297e58?w=800&h=600&fit=crop','[\"https://images.unsplash.com/photo-1551632786-de41ec297e58?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1543353521-892cb6553df1?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop\"]','[\"WiFi Premium\", \"TV HD 50 pulgadas\", \"Aire acondicionado\", \"Minibar completo\", \"Caja fuerte\", \"Bata de baño\", \"Productos de baño\"]','ciudad','disponible',1),(7,'202',2,2,'Habitación confort familiar con dos camas queen, sala de estar amplia y dos baños completos. Perfecta para familias.','https://images.unsplash.com/photo-1611967611181-979a0c3a7caa?w=800&h=600&fit=crop','[\"https://images.unsplash.com/photo-1611967611181-979a0c3a7caa?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1618066335917-51453b59a208?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1596178065887-8f519182f725?w=800&h=600&fit=crop\"]','[\"WiFi Premium\", \"TV HD\", \"Aire acondicionado\", \"Dos baños\", \"Sala de estar\", \"Nevera grande\", \"Cafetera\"]','jardin','disponible',1),(8,'203',2,3,'Habitación confort con vista al jardín, jacuzzi privado en el baño y balcón amplio. Ambiente romántico y relajante.','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop','[\"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1537909352454-79e1b13e7ae0?w=800&h=600&fit=crop\"]','[\"WiFi Premium\", \"TV HD\", \"Aire acondicionado\", \"Jacuzzi privado\", \"Balcón\", \"Minibar\", \"Prensa diaria\"]','jardin','disponible',1),(9,'204',2,3,'Habitación confort premium con cama king, sofá cama y servicios VIP. Incluye desayuno buffet gratuito.','https://images.unsplash.com/photo-1589939705066-3d6e7ba6944b?w=800&h=600&fit=crop','[\"https://images.unsplash.com/photo-1589939705066-3d6e7ba6944b?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1530521954074-e64f47babe48?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop\"]','[\"WiFi Premium\", \"TV HD\", \"Aire acondicionado\", \"Sofá cama\", \"Desayuno incluido\", \"Room service 24h\", \"Teléfono VIP\"]','ciudad','disponible',1),(10,'301',3,4,'Suite deluxe con cama king, sala de estar separada, jacuzzi privado y vistas panorámicas al mar. Lujo absoluto.','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop','[\"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1598928506239-c5986d47eb99?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1590080876975-07ee6c41f515?w=800&h=600&fit=crop\"]','[\"WiFi Premium\", \"TV Smart HD\", \"Aire acondicionado\", \"Jacuzzi privado\", \"Terraza\", \"Minibar VIP\", \"Espejo de aumento\", \"Toallas premium\"]','mar','disponible',1),(11,'302',3,4,'Suite deluxe familiar con dormitorio master, sala de estar amplia y habitación separada. Ideal para familias VIP.','https://images.unsplash.com/photo-1591088398332-8c716b6f39f7?w=800&h=600&fit=crop','[\"https://images.unsplash.com/photo-1591088398332-8c716b6f39f7?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1618066335917-51453b59a208?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop\"]','[\"WiFi Premium\", \"TV Smart HD\", \"Aire acondicionado\", \"Dos salones\", \"Cocina equipada\", \"Lavadora\", \"Room service premium\"]','jardin','disponible',1),(12,'303',3,5,'Suite deluxe romántica con cama redonda, champagne cortesía y cena romantica a la luz de velas. Perfecta para luna de miel.','https://images.unsplash.com/photo-1509066589191-084633290857?w=800&h=600&fit=crop','[\"https://images.unsplash.com/photo-1509066589191-084633290857?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1571896836934-eda523ad1cbe?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1530521954074-e64f47babe48?w=800&h=600&fit=crop\"]','[\"WiFi Premium\", \"TV Smart HD\", \"Aire acondicionado\", \"Cama redonda\", \"Champagne cortesía\", \"Pétalos de rosa\", \"Velas aromáticas\"]','mar','disponible',1),(13,'304',3,5,'Suite deluxe ejecutiva con oficina privada, cama king y servicio de concierge 24/7. Para ejecutivos exigentes.','https://images.unsplash.com/photo-1616594039964-ae9021eadecf?w=800&h=600&fit=crop','[\"https://images.unsplash.com/photo-1616594039964-ae9021eadecf?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1606306107029-0e100e7f07b5?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop\"]','[\"WiFi Premium\", \"TV Smart HD\", \"Aire acondicionado\", \"Oficina privada\", \"Escritorio ejecutivo\", \"Concierge 24/7\", \"Prensa diaria\"]','ciudad','disponible',1),(14,'401',4,6,'Suite presidencial de lujo total con dos dormitorios, sala de estar, cocina equipada y vistas al océano. Máximo esplendor.','https://images.unsplash.com/photo-1571508601348-011eb528158f?w=800&h=600&fit=crop','[\"https://images.unsplash.com/photo-1571508601348-011eb528158f?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1578654881228-4b676f7f579e?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop\"]','[\"WiFi Premium\", \"TV Smart HD\", \"Aire acondicionado\", \"Cocina completa\", \"Dos dormitorios\", \"Sala de estar\", \"Bar privado\"]','mar','disponible',1),(15,'402',4,6,'Suite presidencial familiar con tres dormitorios, dos salas de estar y piscina privada en el balcón. Para familias reales.','https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=600&fit=crop','[\"https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1554009001-26dfa06ebeb3?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1563811859556-f4c6d0acba47?w=800&h=600&fit=crop\"]','[\"WiFi Premium\", \"TV Smart HD\", \"Aire acondicionado\", \"Piscina privada\", \"Tres dormitorios\", \"Dos salones\", \"Chef privado\"]','mar','disponible',1),(16,'403',4,7,'Suite presidencial con vista a la ciudad desde el piso 15. SPA privado, sauna y jacuzzi. Relajación total en altura.','https://images.unsplash.com/photo-1615873968403-89e1986277bf?w=800&h=600&fit=crop','[\"https://images.unsplash.com/photo-1615873968403-89e1986277bf?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1610644726919-abc4dd1371aa?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1581808298585-a5f63282ab4f?w=800&h=600&fit=crop\"]','[\"WiFi Premium\", \"TV Smart HD\", \"Aire acondicionado\", \"SPA privado\", \"Sauna\", \"Jacuzzi\", \"Sala de masajes\"]','ciudad','disponible',1),(17,'404',4,7,'Suite presidencial penthouse con terraza privada, bar, cine privado y helipuerto. El máximo exponente de lujo.','https://images.unsplash.com/photo-1615873968403-89e1986277bf?w=800&h=600&fit=crop','[\"https://images.unsplash.com/photo-1615873968403-89e1986277bf?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop\", \"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop\"]','[\"WiFi Premium\", \"TV Smart HD\", \"Aire acondicionado\", \"Terraza panorámica\", \"Cine privado\", \"Bar completo\", \"Helipuerto\"]','mar','disponible',1);
/*!40000 ALTER TABLE `habitaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
  `id_notificacion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `tipo` enum('nueva_habitacion','confirmacion_reserva','recordatorio','cancelacion','oferta','sistema') COLLATE utf8mb4_general_ci NOT NULL,
  `titulo` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `mensaje` text COLLATE utf8mb4_general_ci NOT NULL,
  `leida` tinyint(1) DEFAULT '0',
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_lectura` timestamp NULL DEFAULT NULL,
  `datos_adicionales` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`id_notificacion`),
  KEY `idx_usuario_notificacion` (`id_usuario`),
  KEY `idx_leida` (`leida`),
  CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `notificaciones_chk_1` CHECK (json_valid(`datos_adicionales`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservas`
--

DROP TABLE IF EXISTS `reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservas` (
  `id_reserva` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_habitacion` int NOT NULL,
  `fecha_entrada` date NOT NULL,
  `fecha_salida` date NOT NULL,
  `hora_entrada` time DEFAULT '15:00:00',
  `hora_salida` time DEFAULT '11:00:00',
  `numero_huespedes` int NOT NULL,
  `precio_total` decimal(10,2) NOT NULL,
  `descuento_aplicado` decimal(10,2) DEFAULT '0.00',
  `estado` enum('pendiente','confirmada','cancelada','completada','no_show') COLLATE utf8mb4_general_ci DEFAULT 'pendiente',
  `notas_especiales` text COLLATE utf8mb4_general_ci,
  `confirmada_por` int DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_modificacion` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `fecha_cancelacion` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_reserva`),
  KEY `confirmada_por` (`confirmada_por`),
  KEY `idx_usuario` (`id_usuario`),
  KEY `idx_habitacion` (`id_habitacion`),
  KEY `idx_fechas` (`fecha_entrada`,`fecha_salida`),
  KEY `idx_estado` (`estado`),
  CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`id_habitacion`) REFERENCES `habitaciones` (`id_habitacion`),
  CONSTRAINT `reservas_ibfk_3` FOREIGN KEY (`confirmada_por`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_habitacion`
--

DROP TABLE IF EXISTS `tipos_habitacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_habitacion` (
  `id_tipo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `capacidad_personas` int NOT NULL,
  `precio_base` decimal(10,2) NOT NULL,
  `precio_empleado` decimal(10,2) NOT NULL,
  `metros_cuadrados` decimal(6,2) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_habitacion`
--

LOCK TABLES `tipos_habitacion` WRITE;
/*!40000 ALTER TABLE `tipos_habitacion` DISABLE KEYS */;
INSERT INTO `tipos_habitacion` VALUES (1,'Habitación Estándar Confort','Habitación confortable con todas las comodidades básicas y premium. Perfecta para parejas o viajeros individuales.',2,150.00,100.00,32.00,1),(2,'Habitación Estándar Confort','Habitación confortable con todas las comodidades básicas y premium',2,150.00,100.00,32.00,1),(3,'Estándar','Habitación básica con cama doble y baño privado',0,0.00,0.00,NULL,1),(4,'Confort','Habitación espaciosa con cama doble, área de estar y comodidades mejoradas',0,0.00,0.00,NULL,1),(5,'Deluxe','Suite lujosa con cama king, jacuzzi y vistas panorámicas',0,0.00,0.00,NULL,1),(6,'Suite','Suite presidencial con sala de estar, dormitorio separado y servicios premium',0,0.00,0.00,NULL,1),(7,'Estándar','Habitación básica con cama doble y baño privado',2,50.00,40.00,20.00,1),(8,'Confort','Habitación espaciosa con cama doble, área de estar y comodidades mejoradas',2,85.00,68.00,28.00,1),(9,'Deluxe','Suite lujosa con cama king, jacuzzi y vistas panorámicas',2,150.00,120.00,40.00,1),(10,'Suite','Suite presidencial con sala de estar, dormitorio separado y servicios premium',4,250.00,200.00,60.00,1);
/*!40000 ALTER TABLE `tipos_habitacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens_sesion`
--

DROP TABLE IF EXISTS `tokens_sesion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens_sesion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `refresh_token` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `dispositivo` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ip` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expira_en` timestamp NULL DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_tokens_usuario` (`id_usuario`),
  CONSTRAINT `fk_tokens_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens_sesion`
--

LOCK TABLES `tokens_sesion` WRITE;
/*!40000 ALTER TABLE `tokens_sesion` DISABLE KEYS */;
/*!40000 ALTER TABLE `tokens_sesion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `auth_provider` enum('local','google','github','facebook') COLLATE utf8mb4_general_ci DEFAULT 'local',
  `rol` enum('cliente','empleado','admin') COLLATE utf8mb4_general_ci DEFAULT 'cliente',
  `foto_perfil` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ultimo_acceso` timestamp NULL DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `google_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `github_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `facebook_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `verificado` tinyint(1) DEFAULT '1',
  `puntos_acumulados` int DEFAULT '0',
  `total_reservas_completadas` int DEFAULT '0',
  `total_reseñas` int DEFAULT '0',
  `preferencias` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `google_id` (`google_id`),
  UNIQUE KEY `facebook_id` (`facebook_id`),
  UNIQUE KEY `github_id` (`github_id`),
  KEY `idx_email` (`email`),
  KEY `idx_rol` (`rol`),
  KEY `idx_google_id` (`google_id`),
  KEY `idx_github_id` (`github_id`),
  KEY `idx_auth_provider` (`auth_provider`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (4,'Celeste','Di Nucci','celes453290@gmail.com','2235066452','$2b$10$4psjFI35rZ1S66DIi3J7aeZsM6kN3/5gsGZFd./T2QDq5HxZO7PO6','google','cliente','https://lh3.googleusercontent.com/a/ACg8ocIzDWBMhbUiijs_kcbMfytr5-cqGsN-R0sPSZRfzLaHmXKgaQ=s96-c','2026-01-06 22:14:59','2026-02-03 20:09:26',1,'111400145042571448651',NULL,NULL,0,0,0,0,NULL),(7,'Vane','Sanchez','vaninasanchez2026@yahoo.com',NULL,'$2b$10$q8W0kl67ZZgwjT4kgOtw/uI10wyI06D44daWeZ4FF7zss3mtH5OAW','local','cliente',NULL,'2026-01-07 14:58:33','2026-02-24 15:59:08',1,NULL,NULL,NULL,1,0,0,0,NULL),(9,'Axel','Sanchez','axl_sanchez@yahoo.com',NULL,'$2b$10$Oehyh5QCb7gVreVcNqBX1.rmHucaTupEtMglF4GIwdlGh4fkfB1na','local','cliente',NULL,'2026-01-20 23:50:52','2026-02-25 20:58:18',1,NULL,NULL,NULL,1,0,0,0,NULL),(10,'Usuario','Prueba','prueba@gmail.com',NULL,'$2b$10$9j3mgXWi4O0ELE3KOriqUO3qCmFZZh7iqYzJdtt.C7VJe3PVU2Hem','local','cliente',NULL,'2026-01-27 15:33:41',NULL,1,NULL,NULL,NULL,1,0,0,0,NULL),(12,'Abigail Celeste','Di Nucci','abigaildinucci@gmail.com',NULL,NULL,'google','cliente','https://lh3.googleusercontent.com/a/ACg8ocJqDcdk-M9C81pT0nhSKnN4hikq9DWETzQzTeBdA42kF-AIfg=s96-c','2026-02-03 12:50:25','2026-02-03 13:42:01',1,'112825145529148573129',NULL,NULL,1,0,0,0,NULL),(13,'abigaildinucci5-hue','GitHub','abigaildinucci5-hue@github.local',NULL,NULL,'github','cliente','https://avatars.githubusercontent.com/u/258935244?v=4','2026-02-04 14:50:19','2026-02-04 14:50:20',1,NULL,'258935244',NULL,1,0,0,0,NULL),(16,'Luciana','Ortega','admin@hotel.com',NULL,'$2a$10$BIxBD2yp/ZHcM3Fdr1Fy8O616v62UO5e5Pct59XWAkA3zfXtng68a','local','admin',NULL,'2026-02-24 19:19:32','2026-02-24 19:46:41',1,NULL,NULL,NULL,1,0,0,0,NULL),(17,'Martín','Salvatierra','recepcion@hotel.com',NULL,'$2a$10$1fJ0cOA74RrhRMJ/XdGpVO4/JXmWHpyGiIwOfYbr.IFJhAuzsaKsm','local','empleado',NULL,'2026-02-24 19:19:32','2026-02-24 20:05:05',1,NULL,NULL,NULL,1,0,0,0,NULL),(18,'juan','di nucci','juandinucci@gmail.com',NULL,'$2a$10$cOfVYMFDLsqfVf9owHIYbuU/WfBxUdhoYfC4oBSTnAynN9Q0kpmea','local','cliente',NULL,'2026-02-25 20:49:38',NULL,1,NULL,NULL,NULL,1,0,0,0,NULL),(19,'juan','di nucci','martin@gmail.com',NULL,'$2a$10$T3GkXBFlkGCyT2LjS0/TnuAGBJFDebwOx277md9hi6yeWXGjaD442','local','cliente',NULL,'2026-02-25 20:50:09',NULL,1,NULL,NULL,NULL,1,0,0,0,NULL),(20,'maria','db','mariadb@gmail.com',NULL,'$2a$10$ReZ6XsH/LvDTad.C/jf/.emYR82ShIzibgLV222pIJxN6ZUuLCEXG','local','cliente',NULL,'2026-02-25 21:02:17',NULL,1,NULL,NULL,NULL,1,0,0,0,NULL),(21,'maria','hola','mariadbcompleta@gmail.com',NULL,'$2a$10$DozE5Aw02i3g8B4ckkaXX.z7mWMgPNU3pC6WzAx1bh11LSSBqUpUa','local','cliente',NULL,'2026-02-25 21:04:44','2026-02-25 21:06:48',1,NULL,NULL,NULL,1,0,0,0,NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-27 16:26:00
