-- Crear la base de datos
CREATE DATABASE plomeria;
GO

USE plomeria;
GO

-- Crear tablas
CREATE TABLE persona (
  ID_Persona INT NOT NULL IDENTITY(1,1),
  CorreoElectronico NVARCHAR(255) NOT NULL,
  Contrasena NVARCHAR(255) NOT NULL,
  Nombre NVARCHAR(255) NOT NULL,
  Rol NVARCHAR(10) NOT NULL,
  Disponible BIT DEFAULT 1,
  PRIMARY KEY (ID_Persona),
  UNIQUE (CorreoElectronico)
);
GO



CREATE TABLE direccion (
  ID_Direccion INT NOT NULL IDENTITY(1,1),
  Calle NVARCHAR(255) NOT NULL,
  NumeroExterior NVARCHAR(20) NOT NULL,
  NumeroInterior NVARCHAR(20),
  Colonia NVARCHAR(255) NOT NULL,
  Alcaldia NVARCHAR(255) NOT NULL,
  CodigoPostal NVARCHAR(20) NOT NULL,
  PRIMARY KEY (ID_Direccion)
);
GO

CREATE TABLE evidencia (
  ID_Evidencia INT NOT NULL IDENTITY(1,1),
  Foto NVARCHAR(255) NOT NULL,
  FechaHora DATETIME NOT NULL,
  ID_Servicio INT NOT NULL,
  PRIMARY KEY (ID_Evidencia),
  FOREIGN KEY (ID_Servicio) REFERENCES servicio(ID_Servicio)
);
GO

CREATE TABLE material (
  ID_Material INT NOT NULL IDENTITY(1,1),
  Nombre NVARCHAR(255) NOT NULL,
  CostoUnitario DECIMAL(10,2) NOT NULL,
  CantidadDisponible INT NOT NULL,
  PRIMARY KEY (ID_Material)
);
GO



CREATE TABLE servicio (
  ID_Servicio INT NOT NULL IDENTITY(1,1),
  TipoServicio NVARCHAR(255) NOT NULL,
  CostoTotal DECIMAL(10,2) NOT NULL,
  Estado NVARCHAR(20) NOT NULL,
  ID_Cliente INT NOT NULL,
  ID_Tecnico INT,
  ID_Direccion INT NOT NULL,
  FechaSolicitud DATETIME NOT NULL,
  FechaCompletado DATETIME,
  Calificacion INT CHECK (Calificacion BETWEEN 1 AND 5),
  recogerMateriales BIT DEFAULT 0,
  dirigirseDireccion BIT DEFAULT 0,
  concluirTrabajo BIT DEFAULT 0,
  Comentario NVARCHAR(MAX),
  PRIMARY KEY (ID_Servicio),
  FOREIGN KEY (ID_Cliente) REFERENCES persona(ID_Persona),
  FOREIGN KEY (ID_Tecnico) REFERENCES persona(ID_Persona),
  FOREIGN KEY (ID_Direccion) REFERENCES direccion(ID_Direccion)
);
GO

CREATE TABLE detalleserviciomaterial (
  ID_Servicio INT NOT NULL,
  ID_Material INT NOT NULL,
  CantidadUtilizada INT NOT NULL,
  PRIMARY KEY (ID_Servicio, ID_Material),
  FOREIGN KEY (ID_Servicio) REFERENCES servicio(ID_Servicio),
  FOREIGN KEY (ID_Material) REFERENCES material(ID_Material)
);
GO

-- Insertar datos
INSERT INTO detalleserviciomaterial (ID_Servicio, ID_Material, CantidadUtilizada) VALUES
  (3, 11, 2),
  (4, 12, 1);
GO


INSERT INTO material (Nombre, CostoUnitario, CantidadDisponible) VALUES
  ('Filtro de tinaco', 38.00, 120),
  ('Solución sanitizante antibacterial', 46.00, 100),
  ('Cepillo con extensor', 55.00, 100),
  ('Tubo de cobre de 1/2', 44.00, 100),
  ('Codos de 1/2', 59.00, 105),
  ('Soldadura', 39.00, 100),
  ('Tubo de gas butano de 1/2', 51.00, 100),
  ('Kit de mangueras de agua caliente, fria y gas', 45.00, 100),
  ('Rollo de cinta Teflón', 44.00, 100),
  ('Válvulas de presión inversa de 1/2', 55.00, 100);
GO

INSERT INTO persona (CorreoElectronico, Contrasena, Nombre, Rol, Disponible) VALUES
  ('admin@a.com', '$2b$10$4mN37UjMix6.fSXjMe1HA.fTbuZ60pZbOLPQRdOw4jq12JRcPq8Ji', 'Admin', 'Gerente', 1),
  ('tecnico1@test.com', '$2b$10$4mN37UjMix6.fSXjMe1HA.fTbuZ60pZbOLPQRdOw4jq12JRcPq8Ji', 'tecnico 1', 'Tecnico', 1),
  ('tecnico2@test.com', '$2b$10$4mN37UjMix6.fSXjMe1HA.fTbuZ60pZbOLPQRdOw4jq12JRcPq8Ji', 'tecnico 2', 'Tecnico', 1),
  ('cliente1@test.com', '$2b$10$4mN37UjMix6.fSXjMe1HA.fTbuZ60pZbOLPQRdOw4jq12JRcPq8Ji', 'Cliente 1', 'Cliente', 1),
  ('cliente2@test.com', '$2b$10$4mN37UjMix6.fSXjMe1HA.fTbuZ60pZbOLPQRdOw4jq12JRcPq8Ji', 'Cliente 2', 'Cliente', 1);
GO

INSERT INTO servicio (TipoServicio, CostoTotal, Estado, ID_Cliente, ID_Tecnico, ID_Direccion, FechaSolicitud, FechaCompletado, Calificacion, recogerMateriales, dirigirseDireccion, concluirTrabajo, Comentario) VALUES
  ('Mantenimiento preventivo y lavado de tinacos', 580.00, 'Completado', 4, 2, 1, '2024-06-01 10:00:00', '2024-06-01 12:00:00', 4, 1, 1, 1, NULL),
  ('Reparación de fuga de agua', 928.00, 'Completado', 4, 3, 2, '2024-06-02 14:00:00', '2024-06-02 16:00:00', 5, 1, 1, 1, NULL),
  ('Mantenimiento preventivo y lavado de tinacos', 580.00, 'Completado', 5, 3, 7, '2024-06-25 06:57:26', '2024-06-26 21:43:20', 1, 1, 1, 1, NULL),
  ('Reparación de fuga de agua', 928.00, 'Completado', 5, 3, 8, '2024-06-26 21:59:53', '2024-06-26 22:10:09', 5, 1, 1, 1, NULL),
  ('Mantenimiento preventivo y lavado de tinacos', 580.00, 'Completado', 5, 3, 9, '2024-06-26 22:13:05', '2024-06-26 22:33:59', 2, 1, 1, 1, NULL),
  ('Reparación de fuga de agua', 928.00, 'Completado', 5, 3, 10, '2024-06-26 22:34:18', '2024-06-26 23:19:09', 1, 1, 1, 1, NULL),
  ('Mantenimiento preventivo y lavado de tinacos', 580.00, 'Completado', 4, 2, 11, '2024-06-27 21:56:30', '2024-06-27 21:59:59', 2, 1, 1, 1, 'mal'),
  ('Mantenimiento preventivo y lavado de tinacos', 580.00, 'Completado', 4, 2, 12, '2024-06-27 22:02:47', '2024-06-27 22:05:08', 4, 1, 1, 1, 'bien');
GO


INSERT INTO direccion (Calle, NumeroExterior, NumeroInterior, Colonia, Alcaldia, CodigoPostal) VALUES
  ('Calle 1', '123', 'A', 'Colonia 1', 'Alcaldia 1', '12345'),
  ('Calle 2', '456', 'B', 'Colonia 2', 'Alcaldia 2', '67890'),
  ('Calle 1', '123', 'A', 'Colonia 1', 'Alcaldia 1', '12345'),
  ('Calle 2', '456', 'B', 'Colonia 2', 'Alcaldia 2', '67890'),
  ('calle inventada', '123', '123', 'del valle', 'gam', '07100'),
  ('calle inventada', '123', '123', 'cuautepec', 'gam', '07100'),
  ('calle inventada', '123', '123', 'cuautepec', 'gam', '07100'),
  ('123', '123', '123', '123', '123', '123'),
  ('11', '111', '111', '111', '11', '11'),
  ('1', '1', '1', '1', '1', '1'),
  ('12', 'qq', 'qqq', 'San Ángel', 'Álvaro Obregón', '11111'),
  ('12', 'qq', 'qq', 'Aculco', 'Iztapalapa', '11111');
GO