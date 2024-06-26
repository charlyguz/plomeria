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

-- Dumping data for table plomeria.detalleserviciomaterial: ~2 rows (approximately)
INSERT INTO `detalleserviciomaterial` (`ID_Servicio`, `ID_Material`, `CantidadUtilizada`) VALUES
	(3, 11, 2),
	(4, 12, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table plomeria.direccion: ~10 rows (approximately)
INSERT INTO `direccion` (`ID_Direccion`, `Calle`, `NumeroExterior`, `NumeroInterior`, `Colonia`, `Alcaldia`, `CodigoPostal`) VALUES
	(1, 'Calle 1', '123', 'A', 'Colonia 1', 'Alcaldia 1', '12345'),
	(2, 'Calle 2', '456', 'B', 'Colonia 2', 'Alcaldia 2', '67890'),
	(3, 'Calle 1', '123', 'A', 'Colonia 1', 'Alcaldia 1', '12345'),
	(4, 'Calle 2', '456', 'B', 'Colonia 2', 'Alcaldia 2', '67890'),
	(5, 'calle inventada ', '123', '123', 'del valle ', 'gam ', '07100'),
	(6, 'calle inventada ', '123', '123', 'cuautepec', 'gam ', '07100'),
	(7, 'calle inventada ', '123', '123', 'cuautepec', 'gam ', '07100'),
	(8, '123', '123', '123', '123', '123', '123'),
	(9, '11', '111', '111', '111', '11', '11'),
	(10, '1', '1', '1', '1', '1', '1');

-- Dumping structure for table plomeria.evidencia
CREATE TABLE IF NOT EXISTS `evidencia` (
  `ID_Evidencia` int(11) NOT NULL AUTO_INCREMENT,
  `Foto` varchar(255) NOT NULL,
  `FechaHora` datetime NOT NULL,
  `ID_Servicio` int(11) NOT NULL,
  PRIMARY KEY (`ID_Evidencia`),
  KEY `ID_Servicio` (`ID_Servicio`),
  CONSTRAINT `evidencia_ibfk_1` FOREIGN KEY (`ID_Servicio`) REFERENCES `servicio` (`ID_Servicio`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table plomeria.persona: ~5 rows (approximately)
INSERT INTO `persona` (`ID_Persona`, `CorreoElectronico`, `Contrasena`, `Nombre`, `Rol`, `Disponible`) VALUES
	(2, 'admin@a', '$2b$10$sLrfWi5kc.iWVYO6Yow2Ae2T84oVRyoN4RMAztDHukjnm/R6ygco2', 'Admin', 'Gerente', 1),
	(4, 'tecnico1@test', '$2b$10$SX4KuF.jGhagPJkaZkie.u8LSGMBdjC34sppe8aD4.xy2jYNggIe2', 'tecnico 1', 'Tecnico', 1),
	(5, 'tecnico2@test', '$2b$10$4mN37UjMix6.fSXjMe1HA.fTbuZ60pZbOLPQRdOw4jq12JRcPq8Ji', 'tecnico 2', 'Tecnico', 1),
	(6, 'cliente1@test.com', '$2b$10$4mN37UjMix6.fSXjMe1HA.fTbuZ60pZbOLPQRdOw4jq12JRcPq8Ji', 'Cliente 1', 'Cliente', 1),
	(7, 'cliente2@test.com', '$2b$10$4mN37UjMix6.fSXjMe1HA.fTbuZ60pZbOLPQRdOw4jq12JRcPq8Ji', 'Cliente 2', 'Cliente', 1);

-- Dumping structure for table plomeria.servicio
CREATE TABLE IF NOT EXISTS `servicio` (
  `ID_Servicio` int(11) NOT NULL AUTO_INCREMENT,
  `TipoServicio` varchar(255) NOT NULL,
  `CostoTotal` decimal(10,2) NOT NULL,
  `Estado` enum('Pendiente','Aceptado','En Camino','En Proceso','Esperando Calificación','Completado') NOT NULL,
  `ID_Cliente` int(11) NOT NULL,
  `ID_Tecnico` int(11) DEFAULT NULL,
  `ID_Direccion` int(11) NOT NULL,
  `FechaSolicitud` datetime NOT NULL,
  `FechaCompletado` datetime DEFAULT NULL,
  `Calificacion` int(1) DEFAULT NULL CHECK (`Calificacion` between 1 and 5),
  `recogerMateriales` tinyint(1) DEFAULT 0,
  `dirigirseDireccion` tinyint(1) DEFAULT 0,
  `concluirTrabajo` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`ID_Servicio`),
  KEY `ID_Cliente` (`ID_Cliente`),
  KEY `ID_Tecnico` (`ID_Tecnico`),
  KEY `ID_Direccion` (`ID_Direccion`),
  CONSTRAINT `servicio_ibfk_1` FOREIGN KEY (`ID_Cliente`) REFERENCES `persona` (`ID_Persona`),
  CONSTRAINT `servicio_ibfk_2` FOREIGN KEY (`ID_Tecnico`) REFERENCES `persona` (`ID_Persona`),
  CONSTRAINT `servicio_ibfk_3` FOREIGN KEY (`ID_Direccion`) REFERENCES `direccion` (`ID_Direccion`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table plomeria.servicio: ~6 rows (approximately)
INSERT INTO `servicio` (`ID_Servicio`, `TipoServicio`, `CostoTotal`, `Estado`, `ID_Cliente`, `ID_Tecnico`, `ID_Direccion`, `FechaSolicitud`, `FechaCompletado`, `Calificacion`, `recogerMateriales`, `dirigirseDireccion`, `concluirTrabajo`) VALUES
	(3, 'Mantenimiento preventivo y lavado de tinacos', 580.00, 'Completado', 2, 4, 1, '2024-06-01 10:00:00', '2024-06-01 12:00:00', 4, 1, 1, 1),
	(4, 'Reparación de fuga de agua', 928.00, 'Completado', 2, 5, 2, '2024-06-02 14:00:00', '2024-06-02 16:00:00', 5, 1, 1, 1),
	(7, 'Mantenimiento preventivo y lavado de tinacos', 580.00, 'Completado', 6, 5, 7, '2024-06-25 06:57:26', '2024-06-26 21:43:20', 1, 1, 1, 1),
	(8, 'Reparación de fuga de agua', 928.00, 'Completado', 7, 5, 8, '2024-06-26 21:59:53', '2024-06-26 22:10:09', 5, 1, 1, 1),
	(9, 'Mantenimiento preventivo y lavado de tinacos', 580.00, 'Completado', 7, 5, 9, '2024-06-26 22:13:05', '2024-06-26 22:33:59', 2, 1, 1, 1),
	(10, 'Reparación de fuga de agua', 928.00, 'Completado', 7, 5, 10, '2024-06-26 22:34:18', '2024-06-26 23:19:09', 1, 1, 1, 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
