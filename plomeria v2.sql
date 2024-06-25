-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.4.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for plomeria
CREATE DATABASE IF NOT EXISTS `plomeria` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `plomeria`;

-- Dumping structure for table plomeria.centromateriales
CREATE TABLE IF NOT EXISTS `centromateriales` (
  `ID_Centro` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NOT NULL,
  `Direccion` varchar(255) NOT NULL,
  `Telefono` varchar(20) NOT NULL,
  PRIMARY KEY (`ID_Centro`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table plomeria.centromateriales: ~0 rows (approximately)

-- Dumping structure for table plomeria.detalleserviciomaterial
CREATE TABLE IF NOT EXISTS `detalleserviciomaterial` (
  `ID_Servicio` int(11) NOT NULL,
  `ID_Material` int(11) NOT NULL,
  `CantidadUtilizada` int(11) NOT NULL,
  PRIMARY KEY (`ID_Servicio`,`ID_Material`),
  KEY `ID_Material` (`ID_Material`),
  CONSTRAINT `DetalleServicioMaterial_ibfk_1` FOREIGN KEY (`ID_Servicio`) REFERENCES `servicio` (`ID_Servicio`),
  CONSTRAINT `DetalleServicioMaterial_ibfk_2` FOREIGN KEY (`ID_Material`) REFERENCES `material` (`ID_Material`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table plomeria.detalleserviciomaterial: ~0 rows (approximately)

-- Dumping structure for table plomeria.direccion
CREATE TABLE IF NOT EXISTS `direccion` (
  `ID_Direccion` int(11) NOT NULL AUTO_INCREMENT,
  `Calle` varchar(255) NOT NULL,
  `NumeroExterior` varchar(20) NOT NULL,
  `NumeroInterior` varchar(20) DEFAULT NULL,
  `Colonia` varchar(255) NOT NULL,
  `Alcaldia` varchar(255) NOT NULL,
  `CodigoPostal` varchar(20) NOT NULL,
  PRIMARY KEY (`ID_Direccion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table plomeria.direccion: ~0 rows (approximately)

-- Dumping structure for table plomeria.entregamaterial
CREATE TABLE IF NOT EXISTS `entregamaterial` (
  `ID_Entrega` int(11) NOT NULL AUTO_INCREMENT,
  `ID_Material` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `FechaHora` datetime NOT NULL,
  `ID_Centro` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_Entrega`),
  KEY `ID_Material` (`ID_Material`),
  KEY `ID_Centro` (`ID_Centro`),
  CONSTRAINT `EntregaMaterial_ibfk_1` FOREIGN KEY (`ID_Material`) REFERENCES `material` (`ID_Material`),
  CONSTRAINT `EntregaMaterial_ibfk_2` FOREIGN KEY (`ID_Centro`) REFERENCES `centromateriales` (`ID_Centro`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table plomeria.entregamaterial: ~0 rows (approximately)

-- Dumping structure for table plomeria.evidencia
CREATE TABLE IF NOT EXISTS `evidencia` (
  `ID_Evidencia` int(11) NOT NULL AUTO_INCREMENT,
  `Foto` varchar(255) NOT NULL,
  `FechaHora` datetime NOT NULL,
  `ID_Servicio` int(11) NOT NULL,
  PRIMARY KEY (`ID_Evidencia`),
  KEY `ID_Servicio` (`ID_Servicio`),
  CONSTRAINT `evidencia_ibfk_1` FOREIGN KEY (`ID_Servicio`) REFERENCES `servicio` (`ID_Servicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table plomeria.evidencia: ~0 rows (approximately)

-- Dumping structure for table plomeria.material
CREATE TABLE IF NOT EXISTS `material` (
  `ID_Material` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NOT NULL,
  `CostoUnitario` decimal(10,2) NOT NULL,
  `CantidadDisponible` int(11) NOT NULL,
  PRIMARY KEY (`ID_Material`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table plomeria.material: ~10 rows (approximately)
INSERT INTO `material` (`ID_Material`, `Nombre`, `CostoUnitario`, `CantidadDisponible`) VALUES
	(11, 'Filtro de tinaco', 38.00, 120),
	(12, 'Solución sanitizante antibacterial', 46.00, 100),
	(13, 'Cepillo con extensor', 55.00, 100),
	(14, 'Tubo de cobre de 1/2', 44.00, 100),
	(15, 'Codos de 1/2', 59.00, 100),
	(16, 'Soldadura', 39.00, 100),
	(17, 'Tubo de gas butano de 1/2', 51.00, 100),
	(18, 'Kit de mangueras de agua caliente, fria y gas', 45.00, 100),
	(19, 'Rollo de cinta Teflón', 44.00, 100),
	(20, 'Válvulas de presión inversa de 1/2', 55.00, 100);

-- Dumping structure for table plomeria.persona
CREATE TABLE IF NOT EXISTS `persona` (
  `ID_Persona` int(11) NOT NULL AUTO_INCREMENT,
  `CorreoElectronico` varchar(255) NOT NULL,
  `Contrasena` varchar(255) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Rol` enum('Cliente','Tecnico','Gerente') NOT NULL,
  `Disponible` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`ID_Persona`),
  UNIQUE KEY `CorreoElectronico` (`CorreoElectronico`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table plomeria.persona: ~0 rows (approximately)
INSERT INTO `persona` (`ID_Persona`, `CorreoElectronico`, `Contrasena`, `Nombre`, `Rol`, `Disponible`) VALUES
	(2, 'admin@a', '$2b$10$sLrfWi5kc.iWVYO6Yow2Ae2T84oVRyoN4RMAztDHukjnm/R6ygco2', 'Admin', 'Gerente', 1),
	(4, 'tecnico1@test', '$2b$10$SX4KuF.jGhagPJkaZkie.u8LSGMBdjC34sppe8aD4.xy2jYNggIe2', 'tecnico 1', 'Tecnico', 1),
	(5, 'tecnico2@test', '$2b$10$4mN37UjMix6.fSXjMe1HA.fTbuZ60pZbOLPQRdOw4jq12JRcPq8Ji', 'tecnico 2', 'Tecnico', 1);

-- Dumping structure for table plomeria.servicio
CREATE TABLE IF NOT EXISTS `servicio` (
  `ID_Servicio` int(11) NOT NULL AUTO_INCREMENT,
  `TipoServicio` varchar(255) NOT NULL,
  `CostoTotal` decimal(10,2) NOT NULL,
  `Estado` enum('Pendiente','Aceptado','En Camino','En Proceso','Completado') NOT NULL,
  `ID_Cliente` int(11) NOT NULL,
  `ID_Tecnico` int(11) DEFAULT NULL,
  `ID_Direccion` int(11) NOT NULL,
  `FechaSolicitud` datetime NOT NULL,
  `FechaCompletado` datetime DEFAULT NULL,
  `Calificacion` int(1) DEFAULT NULL CHECK (`Calificacion` between 1 and 5),
  PRIMARY KEY (`ID_Servicio`),
  KEY `ID_Cliente` (`ID_Cliente`),
  KEY `ID_Tecnico` (`ID_Tecnico`),
  KEY `ID_Direccion` (`ID_Direccion`),
  CONSTRAINT `servicio_ibfk_1` FOREIGN KEY (`ID_Cliente`) REFERENCES `persona` (`ID_Persona`),
  CONSTRAINT `servicio_ibfk_2` FOREIGN KEY (`ID_Tecnico`) REFERENCES `persona` (`ID_Persona`),
  CONSTRAINT `servicio_ibfk_3` FOREIGN KEY (`ID_Direccion`) REFERENCES `direccion` (`ID_Direccion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table plomeria.servicio: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
