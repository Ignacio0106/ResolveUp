-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-01-2025 a las 19:50:41
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
-- Base de datos: `movie_rental`
--
CREATE DATABASE IF NOT EXISTS `ResolveUp2` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `ResolveUp2`;

-- --------------------------------------------------------


CREATE TABLE Rol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    ultimoLogin DATETIME,
    idRol INT,
    FOREIGN KEY (idRol) REFERENCES Rol(id)
);

CREATE TABLE Tecnicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    disponibilidad TINYINT(1) DEFAULT 0,
    cargaTrabajo INT DEFAULT 0,
    idUsuario INT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id)
);

CREATE TABLE Especialidad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE TecnicoEspecialidad (
    idTecnico INT NOT NULL,
    idEspecialidad INT NOT NULL,
    PRIMARY KEY (idTecnico, idEspecialidad),
    FOREIGN KEY (idTecnico) REFERENCES Tecnicos(id),
    FOREIGN KEY (idEspecialidad) REFERENCES Especialidad(id)
);

-- ================= TICKETS =================
CREATE TABLE EstadoTicket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE PrioridadTicket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    peso INT DEFAULT 0
);


CREATE TABLE SLA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tiempoRespuesta INT NOT NULL,
    tiempoResolucion INT NOT NULL
);

CREATE TABLE Categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    idSLA INT,
    FOREIGN KEY (idSLA) REFERENCES SLA(id)
);

CREATE TABLE CategoriaEspecialidad (
    idCategoria INT NOT NULL,
    idEspecialidad INT NOT NULL,
    PRIMARY KEY (idCategoria, idEspecialidad),
    FOREIGN KEY (idCategoria) REFERENCES Categoria(id),
    FOREIGN KEY (idEspecialidad) REFERENCES Especialidad(id)
);

CREATE TABLE Etiqueta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE CategoriaEtiqueta (
    idCategoria INT NOT NULL,
    idEtiqueta INT NOT NULL,
    PRIMARY KEY (idCategoria, idEtiqueta),
    FOREIGN KEY (idCategoria) REFERENCES Categoria(id),
    FOREIGN KEY (idEtiqueta) REFERENCES Etiqueta(id)
);

CREATE TABLE Tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fechaCreacion DATETIME NOT NULL,
    fechaCierre DATETIME,
    fechaLimiteRespuesta DATETIME,
    fechaLimiteResolucion DATETIME,
    diasResolucion INT,
    cumplimientoRespuesta TINYINT(1),
    cumplimientoResolucion TINYINT(1),
    estadoId INT NOT NULL DEFAULT 1,
    prioridadId INT NOT NULL,
    idUsuario INT,
    idCategoria INT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idCategoria) REFERENCES Categoria(id),
    FOREIGN KEY (estadoId) REFERENCES EstadoTicket(id),
    FOREIGN KEY (prioridadId) REFERENCES PrioridadTicket(id)
);

-- ================= HISTORIAL DE ESTADOS =================
CREATE TABLE HistorialEstado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idEstadoAnterior INT NOT NULL,
    idEstadoNuevo INT NOT NULL,
    fecha DATETIME NOT NULL,
    observaciones TEXT,
    idTicket INT,
    idUsuario INT,
    FOREIGN KEY (idEstadoAnterior) REFERENCES EstadoTicket(id),
    FOREIGN KEY (idEstadoNuevo) REFERENCES EstadoTicket(id),
    FOREIGN KEY (idTicket) REFERENCES Tickets(id),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id)
);

-- ================= IMÁGENES =================
CREATE TABLE TicketImagen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruta VARCHAR(255) NOT NULL,
    fechaSubida DATETIME NOT NULL,
    idTicket INT,
    idHistorialEstado INT,
    FOREIGN KEY (idTicket) REFERENCES Tickets(id),
    FOREIGN KEY (idHistorialEstado) REFERENCES HistorialEstado(id)
);

-- ================= MÉTODO Y ASIGNACIÓN DE TICKETS =================
CREATE TABLE MetodoAsignacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE ReglasAutotriage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idCategoria INT NOT NULL,
    idPrioridad INT NOT NULL,
    idEspecialidad INT,
    pesoCargaTecnico INT,
    ordenPrioridad INT,
    descripcion TEXT,
    activo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (idCategoria) REFERENCES Categoria(id),
    FOREIGN KEY (idPrioridad) REFERENCES PrioridadTicket(id),
    FOREIGN KEY (idEspecialidad) REFERENCES Especialidad(id)
);

CREATE TABLE Asignacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    descripcion TEXT,
    idMetodo INT NOT NULL,
    idTicket INT,
    idTecnico INT,
    idRegla INT,
    tiempoRestanteResolucion INT,
    puntajePrioridad DECIMAL(10,2),
    FOREIGN KEY (idTicket) REFERENCES Tickets(id),
    FOREIGN KEY (idTecnico) REFERENCES Tecnicos(id),
    FOREIGN KEY (idMetodo) REFERENCES MetodoAsignacion(id),
    FOREIGN KEY (idRegla) REFERENCES ReglasAutotriage(id)
);

-- ================= VALORACIONES =================
CREATE TABLE PuntajeValoracion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE Valoracion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idPuntaje INT NOT NULL,
    comentario TEXT,
    fecha DATETIME NOT NULL,
    idTicket INT UNIQUE,
    idUsuario INT,
    FOREIGN KEY (idPuntaje) REFERENCES PuntajeValoracion(id),
    FOREIGN KEY (idTicket) REFERENCES Tickets(id),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id)
);

-- ================= NOTIFICACIONES =================
CREATE TABLE EstadoNotificacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE Notificacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50),
    mensaje TEXT,
    fecha DATETIME NOT NULL,
    idEstado INT NOT NULL DEFAULT 1,
    idUsuario INT,
    idRemitente INT,
    FOREIGN KEY (idEstado) REFERENCES EstadoNotificacion(id),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idRemitente) REFERENCES Usuario(id)
);



-- ================= INSERTS =================
INSERT INTO Rol (nombre) VALUES ('Administrador'), ('Técnico'), ('Cliente');

INSERT INTO EstadoTicket (nombre) VALUES ('Pendiente'), ('Asignado'), ('En Proceso'), ('Resuelto'), ('Cerrado');

INSERT INTO PrioridadTicket (nombre, peso) VALUES ('Alta', 3), ('Media', 2), ('Baja', 1);

INSERT INTO MetodoAsignacion (nombre) VALUES ('Manual'), ('Autotriage');

INSERT INTO PuntajeValoracion (descripcion) VALUES ('Muy Insatisfactorio'), ('Insatisfactorio'), ('Regular'), ('Satisfactorio'), ('Excelente');

INSERT INTO EstadoNotificacion (descripcion) VALUES ('Pendiente'), ('Enviado'), ('Leído');

-- ================= INSERTS PRUEBA  =================

-- 🔹 SLA
INSERT INTO SLA (tiempoRespuesta, tiempoResolucion) VALUES
(180, 600),   -- Soporte a sistemas educativos: 3h resp, 10h reso
(240, 1440),  -- Hardware: 4h resp, 24h reso
(120, 480),   -- Redes y conectividad: 2h resp, 8h reso
(60, 240);    -- Seguridad informática: 1h resp, 4h reso

-- 🔹 Categorías
INSERT INTO Categoria (nombre, idSLA) VALUES
('Soporte a sistemas educativos', 1),
('Hardware', 2),
('Redes y conectividad', 3),
('Seguridad informática', 4);

-- 🔹 Especialidades
INSERT INTO Especialidad (nombre) VALUES
('Soporte a sistemas educativos'),
('Administración de sistemas'),
('Técnico en reparación de equipos'),
('Administrador de redes'),
('Especialista en ciberseguridad');

-- 🔹 Categoria - Especialidad
INSERT INTO CategoriaEspecialidad (idCategoria, idEspecialidad) VALUES
(1, 1), (1, 2),
(2, 3),
(3, 4),
(4, 5);

-- 🔹 Etiquetas
INSERT INTO Etiqueta (nombre) VALUES
('Aula Virtual'), ('Correo'), ('Login'), ('Usuarios'),
('Laptop'), ('Proyector'), ('Impresora'), ('Monitor'),
('Wifi'), ('Internet'), ('Servidor'), ('VPN'),
('Contraseñas comprometidas'), ('Accesos no autorizados'), ('Antivirus');

-- 🔹 Categoria - Etiqueta
INSERT INTO CategoriaEtiqueta (idCategoria, idEtiqueta) VALUES
-- Soporte a sistemas educativos
(1, 1), (1, 2), (1, 3), (1, 4),
-- Hardware
(2, 5), (2, 6), (2, 7), (2, 8),
-- Redes y conectividad
(3, 9), (3, 10), (3, 11), (3, 12),
-- Seguridad informática
(4, 13), (4, 14), (4, 15);

-- 🔹 Usuarios
INSERT INTO Usuario (nombre, correo, contraseña, idRol) VALUES
('Juan Admin', 'juan.admin@email.com', '1234', 1),
('María Técnico', 'maria.tecnico@email.com', '1234', 2),
('Luis Técnico', 'luis.tecnico@email.com', '1234', 2),
('Carlos Cliente', 'carlos.cliente@email.com', '1234', 3);

-- 🔹 Técnicos vinculados a usuarios
INSERT INTO Tecnicos (idUsuario, disponibilidad, cargaTrabajo) VALUES
(2, 1, 0), -- María
(3, 1, 0); -- Luis

-- 🔹 Técnico - Especialidad
INSERT INTO TecnicoEspecialidad (idTecnico, idEspecialidad) VALUES
(1, 3), -- María: Técnico en reparación de equipos
(2, 4); -- Luis: Administrador de redes


-- 🔹 Usuarios adicionales (Técnicos)
INSERT INTO Usuario (nombre, correo, contraseña, idRol) VALUES
('Marcos Pérez', 'marcos.perez@email.com', '1234', 2),
('Laura Gómez', 'laura.gomez@email.com', '1234', 2),
('Javier Torres', 'javier.torres@email.com', '1234', 2),
('Camila Rojas', 'camila.rojas@email.com', '1234', 2),
('Fernando Castillo', 'fernando.castillo@email.com', '1234', 2),
('Isabella Fernández', 'isabella.fernandez@email.com', '1234', 2);

-- 🔹 Técnicos vinculados a los nuevos usuarios
INSERT INTO Tecnicos (idUsuario, disponibilidad, cargaTrabajo) VALUES
(5, 1, 0), -- Marcos
(6, 1, 0), -- Laura
(7, 1, 0), -- Javier
(8, 1, 0), -- Camila
(9, 1, 0), -- Fernando
(10, 1, 0); -- Isabella

-- 🔹 Técnicos - Especialidad
INSERT INTO TecnicoEspecialidad (idTecnico, idEspecialidad) VALUES
(3, 1), -- Marcos: Soporte a sistemas educativos
(4, 3), -- Laura: Técnico en reparación de equipos
(5, 4), -- Javier: Administrador de redes
(6, 5), -- Camila: Especialista en ciberseguridad
(7, 2), -- Fernando: Administración de sistemas
(8, 1); -- Isabella: Soporte a sistemas educativos

-- ================= TRIGGERS   =================


DELIMITER $$

-- calcular fechas SLA al crear ticket
CREATE TRIGGER trg_tickets_before_insert
BEFORE INSERT ON Tickets
FOR EACH ROW
BEGIN
    DECLARE resp INT DEFAULT 0;
    DECLARE reso INT DEFAULT 0;

    IF NEW.idCategoria IS NOT NULL THEN
        SELECT s.tiempoRespuesta, s.tiempoResolucion
        INTO resp, reso
        FROM Categoria c
        JOIN SLA s ON c.idSLA = s.id
        WHERE c.id = NEW.idCategoria;

        SET NEW.fechaLimiteRespuesta = DATE_ADD(NEW.fechaCreacion, INTERVAL resp MINUTE);
        SET NEW.fechaLimiteResolucion = DATE_ADD(NEW.fechaCreacion, INTERVAL reso MINUTE);
    END IF;
END$$

-- calcular días y cumplimiento SLA al cerrar ticket
CREATE TRIGGER trg_tickets_before_update
BEFORE UPDATE ON Tickets
FOR EACH ROW
BEGIN
    DECLARE diff INT DEFAULT 0;
    DECLARE cumpleResp TINYINT DEFAULT 0;
    DECLARE cumpleReso TINYINT DEFAULT 0;

    -- Solo si se está cerrando el ticket
    IF OLD.fechaCierre IS NULL AND NEW.fechaCierre IS NOT NULL THEN
        -- Calcular días y cumplimiento SLA
        SET diff = TIMESTAMPDIFF(DAY, NEW.fechaCreacion, NEW.fechaCierre);
        SET cumpleResp = IF(NEW.fechaLimiteRespuesta >= NEW.fechaCierre, 1, 0);
        SET cumpleReso = IF(NEW.fechaLimiteResolucion >= NEW.fechaCierre, 1, 0);

        -- Asignar directamente a NEW
        SET NEW.diasResolucion = diff;
        SET NEW.cumplimientoRespuesta = cumpleResp;
        SET NEW.cumplimientoResolucion = cumpleReso;

        -- Actualizar carga de trabajo del técnico si estaba asignado
        UPDATE Tecnicos t
        JOIN Asignacion a ON t.id = a.idTecnico
        SET t.cargaTrabajo = t.cargaTrabajo - 1
        WHERE a.idTicket = NEW.id;
    END IF;

    -- Registrar historial si cambió el estado
    IF OLD.estadoId != NEW.estadoId THEN
        INSERT INTO HistorialEstado(idEstadoAnterior, idEstadoNuevo, fecha, idTicket, idUsuario)
        VALUES (OLD.estadoId, NEW.estadoId, NOW(), NEW.id, NULL);
    END IF;
END$$

-- calcular puntaje y tiempo restante al asignar ticket
CREATE TRIGGER trg_asignacion_before_insert
BEFORE INSERT ON Asignacion
FOR EACH ROW
BEGIN
    DECLARE peso INT DEFAULT 0;
    DECLARE limite DATETIME;
    DECLARE minutos INT DEFAULT 0;

    IF NEW.idTicket IS NOT NULL THEN
        SELECT pt.peso, t.fechaLimiteResolucion
        INTO peso, limite
        FROM Tickets t
        JOIN PrioridadTicket pt ON t.prioridadId = pt.id
        WHERE t.id = NEW.idTicket;

        SET minutos = TIMESTAMPDIFF(MINUTE, NOW(), limite);
        IF minutos < 0 THEN
            SET minutos = 0;
        END IF;

        SET NEW.tiempoRestanteResolucion = minutos;
        SET NEW.puntajePrioridad = (peso * 1000) - (minutos / 60);

        -- Actualizar carga de trabajo del técnico
        IF NEW.idTecnico IS NOT NULL THEN
            UPDATE Tecnicos
            SET cargaTrabajo = cargaTrabajo + 1
            WHERE id = NEW.idTecnico;
        END IF;

        -- Crear notificación para el técnico
        IF NEW.idTecnico IS NOT NULL THEN
            INSERT INTO Notificacion(tipo, mensaje, fecha, idEstado, idUsuario, idRemitente)
            VALUES (
                'Asignación de Ticket',
                CONCAT('Se le ha asignado el ticket ID ', NEW.idTicket),
                NOW(),
                1,       -- Pendiente
                NEW.idTecnico, -- receptor
                NULL     -- remitente
            );
        END IF;

        -- Actualizar estado del ticket a 'Asignado'
        UPDATE Tickets
        SET estadoId = (SELECT id FROM EstadoTicket WHERE nombre = 'Asignado')
        WHERE id = NEW.idTicket;
    END IF;
END$$

DELIMITER ;



-- ================= PRUEBA TRIGGERS   =================

-- Insertar un ticket de prueba
INSERT INTO Tickets (titulo, descripcion, fechaCreacion, estadoId, prioridadId, idUsuario, idCategoria)
VALUES ('Problema con Aula Virtual', 'No puedo ingresar al aula virtual', NOW(), 1, 1, 4, 1);

-- Revisar que se calculó fechaLimiteRespuesta y fechaLimiteResolucion
SELECT id, titulo, fechaCreacion, fechaLimiteRespuesta, fechaLimiteResolucion, estadoId
FROM Tickets
WHERE id = 1;

--  Asignar el ticket a un técnico
INSERT INTO Asignacion (fecha, descripcion, idMetodo, idTicket, idTecnico)
VALUES (NOW(), 'Asignación manual', 1, 1, 1);

-- Revisar que se calculó tiempoRestanteResolucion y puntajePrioridad
SELECT a.id, a.idTicket, a.idTecnico, a.tiempoRestanteResolucion, a.puntajePrioridad
FROM Asignacion a
WHERE a.idTicket = 1;

-- Revisar carga de trabajo del técnico
SELECT id, idUsuario, cargaTrabajo
FROM Tecnicos
WHERE id = 1;

-- Revisar notificación creada
SELECT id, tipo, mensaje, idUsuario
FROM Notificacion
WHERE idUsuario = 1;

-- Cambiar estado del ticket a 'Cerrado'
UPDATE Tickets
SET estadoId = (SELECT id FROM EstadoTicket WHERE nombre='Cerrado'),
    fechaCierre = NOW()
WHERE id = 1;

-- Revisar ticket cerrado y cumplimiento SLA
SELECT id, titulo, estadoId, fechaCierre, diasResolucion, cumplimientoRespuesta, cumplimientoResolucion
FROM Tickets
WHERE id = 1;

-- Revisar carga de trabajo del técnico después de cerrar
SELECT id, idUsuario, cargaTrabajo
FROM Tecnicos
WHERE id = 1;

-- Revisar historial de estado creado
SELECT * FROM HistorialEstado
WHERE idTicket = 1;





/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
