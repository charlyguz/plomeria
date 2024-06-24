/*!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.4.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: plomeria
-- ------------------------------------------------------
-- Server version	11.4.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `CentroMateriales`
--

DROP TABLE IF EXISTS `CentroMateriales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CentroMateriales` (
  `ID_Centro` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NOT NULL,
  `Direccion` varchar(255) NOT NULL,
  `Telefono` varchar(20) NOT NULL,
  PRIMARY KEY (`ID_Centro`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CentroMateriales`
--

LOCK TABLES `CentroMateriales` WRITE;
/*!40000 ALTER TABLE `CentroMateriales` DISABLE KEYS */;
/*!40000 ALTER TABLE `CentroMateriales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DetalleServicioMaterial`
--

DROP TABLE IF EXISTS `DetalleServicioMaterial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DetalleServicioMaterial` (
  `ID_Servicio` int(11) NOT NULL,
  `ID_Material` int(11) NOT NULL,
  `CantidadUtilizada` int(11) NOT NULL,
  PRIMARY KEY (`ID_Servicio`,`ID_Material`),
  KEY `ID_Material` (`ID_Material`),
  CONSTRAINT `DetalleServicioMaterial_ibfk_1` FOREIGN KEY (`ID_Servicio`) REFERENCES `Servicio` (`ID_Servicio`),
  CONSTRAINT `DetalleServicioMaterial_ibfk_2` FOREIGN KEY (`ID_Material`) REFERENCES `Material` (`ID_Material`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DetalleServicioMaterial`
--

LOCK TABLES `DetalleServicioMaterial` WRITE;
/*!40000 ALTER TABLE `DetalleServicioMaterial` DISABLE KEYS */;
/*!40000 ALTER TABLE `DetalleServicioMaterial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EntregaMaterial`
--

DROP TABLE IF EXISTS `EntregaMaterial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EntregaMaterial` (
  `ID_Entrega` int(11) NOT NULL AUTO_INCREMENT,
  `ID_Material` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `FechaHora` datetime NOT NULL,
  `ID_Centro` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_Entrega`),
  KEY `ID_Material` (`ID_Material`),
  KEY `ID_Centro` (`ID_Centro`),
  CONSTRAINT `EntregaMaterial_ibfk_1` FOREIGN KEY (`ID_Material`) REFERENCES `Material` (`ID_Material`),
  CONSTRAINT `EntregaMaterial_ibfk_2` FOREIGN KEY (`ID_Centro`) REFERENCES `CentroMateriales` (`ID_Centro`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EntregaMaterial`
--

LOCK TABLES `EntregaMaterial` WRITE;
/*!40000 ALTER TABLE `EntregaMaterial` DISABLE KEYS */;
/*!40000 ALTER TABLE `EntregaMaterial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Evidencia`
--

DROP TABLE IF EXISTS `Evidencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Evidencia` (
  `ID_Evidencia` int(11) NOT NULL AUTO_INCREMENT,
  `Foto` varchar(255) NOT NULL,
  `FechaHora` datetime NOT NULL,
  `ID_Servicio` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_Evidencia`),
  KEY `ID_Servicio` (`ID_Servicio`),
  CONSTRAINT `Evidencia_ibfk_1` FOREIGN KEY (`ID_Servicio`) REFERENCES `Servicio` (`ID_Servicio`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Evidencia`
--

LOCK TABLES `Evidencia` WRITE;
/*!40000 ALTER TABLE `Evidencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `Evidencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Material`
--

DROP TABLE IF EXISTS `Material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Material` (
  `ID_Material` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NOT NULL,
  `CostoUnitario` decimal(10,2) NOT NULL,
  `CantidadDisponible` int(11) NOT NULL,
  PRIMARY KEY (`ID_Material`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Material`
--

LOCK TABLES `Material` WRITE;
/*!40000 ALTER TABLE `Material` DISABLE KEYS */;
INSERT INTO `Material` VALUES
(11,'Filtro de tinaco',38.00,100),
(12,'Solución sanitizante antibacterial',46.00,100),
(13,'Cepillo con extensor',55.00,100),
(14,'Tubo de cobre de 1/2',44.00,100),
(15,'Codos de 1/2',59.00,100),
(16,'Soldadura',39.00,100),
(17,'Tubo de gas butano de 1/2',51.00,100),
(18,'Kit de mangueras de agua caliente, fria y gas',45.00,100),
(19,'Rollo de cinta Teflón',44.00,100),
(20,'Válvulas de presión inversa de 1/2',55.00,100);
/*!40000 ALTER TABLE `Material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Persona`
--

DROP TABLE IF EXISTS `Persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Persona` (
  `ID_Persona` int(11) NOT NULL AUTO_INCREMENT,
  `CorreoElectronico` varchar(255) NOT NULL,
  `Contrasena` varchar(255) NOT NULL,
  `Rol` enum('Cliente','Tecnico','Gerente') NOT NULL,
  PRIMARY KEY (`ID_Persona`),
  UNIQUE KEY `CorreoElectronico` (`CorreoElectronico`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Persona`
--

LOCK TABLES `Persona` WRITE;
/*!40000 ALTER TABLE `Persona` DISABLE KEYS */;
INSERT INTO `Persona` VALUES
(3,'cliente1@example.com','contrasena1','Cliente'),
(4,'cliente2@example.com','contrasena2','Cliente'),
(5,'cliente3@example.com','contrasena3','Cliente'),
(6,'cliente4@example.com','contrasena4','Cliente'),
(7,'cliente5@example.com','contrasena5','Cliente'),
(8,'tecnico1@example.com','contrasena1','Tecnico'),
(9,'tecnico2@example.com','contrasena2','Tecnico'),
(10,'tecnico3@example.com','contrasena3','Tecnico');
/*!40000 ALTER TABLE `Persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Servicio`
--

DROP TABLE IF EXISTS `Servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Servicio` (
  `ID_Servicio` int(11) NOT NULL AUTO_INCREMENT,
  `TipoServicio` varchar(255) NOT NULL,
  `CostoTotal` decimal(10,2) NOT NULL,
  `Estado` enum('Pendiente','En Curso','Completado') NOT NULL,
  `ID_Tecnico` int(11) DEFAULT NULL,
  `Direccion` varchar(255) NOT NULL,
  PRIMARY KEY (`ID_Servicio`),
  KEY `ID_Tecnico` (`ID_Tecnico`),
  CONSTRAINT `Servicio_ibfk_1` FOREIGN KEY (`ID_Tecnico`) REFERENCES `Persona` (`ID_Persona`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Servicio`
--

LOCK TABLES `Servicio` WRITE;
/*!40000 ALTER TABLE `Servicio` DISABLE KEYS */;
INSERT INTO `Servicio` VALUES
(2,'Mantenimiento preventivo y lavado de tinacos',500.00,'Pendiente',NULL,'Dirección de ejemplo 1'),
(3,'Reparación de fuga de agua',800.00,'Pendiente',NULL,'Dirección de ejemplo 2'),
(4,'Instalación de calentador de agua',1200.00,'Pendiente',NULL,'Dirección de ejemplo 3');
/*!40000 ALTER TABLE `Servicio` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2024-06-22 19:53:31
