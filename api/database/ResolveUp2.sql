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
CREATE DATABASE IF NOT EXISTS ResolveUp2;
USE ResolveUp2;
 
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

 
CREATE TABLE Notificacion (
	id INT AUTO_INCREMENT PRIMARY KEY,
	tipo VARCHAR(50),
	mensaje TEXT,
	fecha DATETIME NOT NULL,
	idUsuario INT,
	idRemitente INT,
    leida TINYINT(1) DEFAULT 0,
    leidaPor INT NULL,
    leidaAt DATETIME NULL,
	FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
	FOREIGN KEY (idRemitente) REFERENCES Usuario(id)
);
 

 
-- ================= INSERTS =================

 
-- ================= INSERTS PRUEBA  =================
-- ================= INSERTS ROLES =================
INSERT INTO Rol (nombre) VALUES 
('Administrador'), 
('Técnico'), 
('Cliente');

-- ================= INSERTS ESTADO TICKET =================
INSERT INTO EstadoTicket (nombre) VALUES 
('Pendiente'), 
('Asignado'), 
('En Proceso'), 
('Resuelto'), 
('Cerrado');

-- ================= INSERTS PRIORIDAD =================
INSERT INTO PrioridadTicket (nombre, peso) VALUES 
('Alta', 3), 
('Media', 2), 
('Baja', 1);

-- ================= INSERTS MÉTODO ASIGNACIÓN =================
INSERT INTO MetodoAsignacion (nombre) VALUES 
('Manual'), 
('Autotriage');

-- ================= INSERTS VALORACIONES =================
INSERT INTO PuntajeValoracion (descripcion) VALUES 
('Muy Insatisfactorio'), 
('Insatisfactorio'), 
('Regular'), 
('Satisfactorio'), 
('Excelente');



-- ================= INSERTS SLA =================
INSERT INTO SLA (tiempoRespuesta, tiempoResolucion) VALUES
(180, 600),    -- Soporte a sistemas educativos: 3h resp, 10h reso
(240, 1440),   -- Hardware: 4h resp, 24h reso
(120, 480),    -- Redes y conectividad: 2h resp, 8h reso
(60, 240);     -- Seguridad informática: 1h resp, 4h reso

-- ================= INSERTS CATEGORÍA =================
INSERT INTO Categoria (nombre, idSLA) VALUES
('Soporte a sistemas educativos', 1),
('Hardware', 2),
('Redes y conectividad', 3),
('Seguridad informática', 4);

-- ================= INSERTS ESPECIALIDADES =================
INSERT INTO Especialidad (nombre) VALUES
('Soporte a sistemas educativos'),
('Administración de sistemas'),
('Técnico en reparación de equipos'),
('Administrador de redes'),
('Especialista en ciberseguridad');

-- ================= INSERTS CATEGORÍA - ESPECIALIDAD =================
INSERT INTO CategoriaEspecialidad (idCategoria, idEspecialidad) VALUES
(1, 1), (1, 2),
(2, 3),
(3, 4),
(4, 5);

-- ================= INSERTS ETIQUETAS =================
INSERT INTO Etiqueta (nombre) VALUES
('Aula Virtual'), ('Correo'), ('Login'), ('Usuarios'),
('Laptop'), ('Proyector'), ('Impresora'), ('Monitor'),
('Wifi'), ('Internet'), ('Servidor'), ('VPN'),
('Contraseñas comprometidas'), ('Accesos no autorizados'), ('Antivirus');

-- ================= INSERTS CATEGORÍA - ETIQUETA =================
INSERT INTO CategoriaEtiqueta (idCategoria, idEtiqueta) VALUES
-- Soporte a sistemas educativos
(1, 1), (1, 2), (1, 3), (1, 4),
-- Hardware
(2, 5), (2, 6), (2, 7), (2, 8),
-- Redes y conectividad
(3, 9), (3, 10), (3, 11), (3, 12),
-- Seguridad informática
(4, 13), (4, 14), (4, 15);

-- ================= INSERTS USUARIOS =================
INSERT INTO Usuario (nombre, correo, contraseña, idRol) VALUES
('Juan Admin', 'juan.admin@email.com', '12345678', 1),
('María Técnico', 'maria.tecnico@email.com', '1234', 2),
('Luis Técnico', 'luis.tecnico@email.com', '1234', 2),
('Carlos Cliente', 'carlos.cliente@email.com', '1234', 3),
('Marcos Pérez', 'marcos.perez@email.com', '1234', 2),
('Laura Gómez', 'laura.gomez@email.com', '1234', 2),
('Javier Torres', 'javier.torres@email.com', '1234', 2),
('Camila Rojas', 'camila.rojas@email.com', '1234', 2),
('Fernando Castillo', 'fernando.castillo@email.com', '1234', 2),
('Isabella Fernández', 'isabella.fernandez@email.com', '1234', 2);

-- ================= INSERTS TÉCNICOS =================
INSERT INTO Tecnicos (idUsuario, disponibilidad, cargaTrabajo) VALUES
(2, 1, 0), -- María
(3, 1, 0), -- Luis
(5, 1, 0), -- Marcos
(6, 1, 0), -- Laura
(7, 1, 0), -- Javier
(8, 1, 0), -- Camila
(9, 1, 0), -- Fernando
(10, 1, 0); -- Isabella

-- ================= INSERTS TÉCNICO - ESPECIALIDAD =================
INSERT INTO TecnicoEspecialidad (idTecnico, idEspecialidad) VALUES
-- María
(1, 3), -- Técnico en reparación de equipos
(1, 1), -- Soporte a sistemas educativos
(1, 2), -- Administración de sistemas

-- Luis
(2, 4), -- Administrador de redes
(2, 5), -- Especialista en ciberseguridad
(2, 2), -- Administración de sistemas

-- Marcos
(3, 1), -- Soporte a sistemas educativos
(3, 2), -- Administración de sistemas
(3, 3), -- Técnico en reparación de equipos

-- Laura
(4, 3), -- Técnico en reparación de equipos
(4, 1), -- Soporte a sistemas educativos
(4, 5), -- Especialista en ciberseguridad

-- Javier
(5, 4), -- Administrador de redes
(5, 2), -- Administración de sistemas
(5, 5), -- Especialista en ciberseguridad

-- Camila
(6, 5), -- Especialista en ciberseguridad
(6, 4), -- Administrador de redes
(6, 1), -- Soporte a sistemas educativos

-- Fernando
(7, 2), -- Administración de sistemas
(7, 1), -- Soporte a sistemas educativos
(7, 3), -- Técnico en reparación de equipos

-- Isabella
(8, 1), -- Soporte a sistemas educativos
(8, 3), -- Técnico en reparación de equipos
(8, 2); -- Administración de sistemas

INSERT INTO Notificacion (tipo, mensaje, fecha, idUsuario, idRemitente, leida, leidaPor, leidaAt) VALUES
('Asignación de Ticket', 'Se le ha asignado el ticket #1: Problema con Aula Virtual', NOW(), 2, 1, 0, NULL, NULL),
('Asignación de Ticket', 'Se le ha asignado el ticket #2: Problema con Usuarios', NOW(), 3, 1, 0, NULL, NULL),
('Cambio de estado', 'El ticket #3: Laptop no enciende ha pasado a En Proceso', NOW(), 5, 1, 0, NULL, NULL),
('Comentario', 'El usuario Carlos Cliente comentó en el ticket #4: Wifi intermitente', NOW(), 6, 4, 0, NULL, NULL),
('Asignación de Ticket', 'Se le ha asignado el ticket #5: Antivirus desactualizado', NOW(), 7, 1, 0, NULL, NULL),
('Recordatorio', 'El ticket #6: Correo no funciona está próximo a su fecha límite', NOW(), 3, NULL, 0, NULL, NULL),
('Aviso', 'Se ha cerrado el ticket #7: Monitor no responde', NOW(), 5, NULL, 0, NULL, NULL),
('Asignación de Ticket', 'Se le ha asignado el ticket #8: VPN no conecta', NOW(), 6, 1, 0, NULL, NULL),
('Notificación general', 'Se realizará mantenimiento en el sistema este viernes', NOW(), 2, NULL, 0, NULL, NULL),
('Comentario', 'El técnico Marcos Pérez agregó un comentario al ticket #10: Proyector falla', NOW(), 5, 3, 0, NULL, NULL);


INSERT INTO Usuario (nombre, correo, contraseña, idRol) VALUES
('Admin', 'juan.admin@email2.com', '$2y$10$scI82uL6SHKqI.YV6yimjeFKEtMWySRiUc02lBVZ35AjWVxPTzQj6', 1);


INSERT INTO ReglasAutotriage (
    idCategoria,
    idPrioridad,
    idEspecialidad,
    pesoCargaTecnico,
    ordenPrioridad,
    descripcion,
    activo
)
VALUES
(1, 1, NULL, 10, 1, 'Alta prioridad en categoría 1', 1),
(1, 2, NULL, 8, 2, 'Prioridad media en categoría 1', 1),
(2, 1, NULL, 9, 1, 'Alta prioridad en categoría 2', 1);

INSERT INTO ReglasAutotriage (idCategoria, idPrioridad, idEspecialidad, pesoCargaTecnico, ordenPrioridad, descripcion, activo)
VALUES
(4, 1, NULL, 10, 1, 'Alta prioridad en categoría 4', 1),
(4, 2, NULL, 8, 2, 'Media prioridad en categoría 4', 1),
(4, 3, NULL, 5, 3, 'Baja prioridad en categoría 4', 1);


-- ================= TRIGGERS   =================
 
 SHOW CREATE TABLE reglasautotriage;

DELIMITER $$

/* ============================================================
   1. BEFORE INSERT - Calcular fechas SLA
   ============================================================ */
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

        SET NEW.fechaLimiteRespuesta =
            DATE_ADD(NEW.fechaCreacion, INTERVAL resp MINUTE);

        SET NEW.fechaLimiteResolucion =
            DATE_ADD(NEW.fechaCreacion, INTERVAL reso MINUTE);
    END IF;
END$$



/* ============================================================
   2. BEFORE UPDATE - Cálculo SLA + Historial
   ============================================================ */
CREATE TRIGGER trg_tickets_before_update
BEFORE UPDATE ON Tickets
FOR EACH ROW
BEGIN
    DECLARE diff INT;
    DECLARE cumpleResp TINYINT;
    DECLARE cumpleReso TINYINT;

    IF OLD.fechaCierre IS NULL AND NEW.fechaCierre IS NOT NULL THEN
        
        SET diff = TIMESTAMPDIFF(DAY, NEW.fechaCreacion, NEW.fechaCierre);
        SET NEW.diasResolucion = diff;

        SET cumpleResp = IF(NEW.fechaLimiteRespuesta >= NEW.fechaCierre, 1, 0);
        SET NEW.cumplimientoRespuesta = cumpleResp;

        SET cumpleReso = IF(NEW.fechaLimiteResolucion >= NEW.fechaCierre, 1, 0);
        SET NEW.cumplimientoResolucion = cumpleReso;
    END IF;

    IF OLD.estadoId <> NEW.estadoId THEN
        INSERT INTO HistorialEstado(idEstadoAnterior, idEstadoNuevo, fecha, idTicket, idUsuario)
        VALUES (OLD.estadoId, NEW.estadoId, NOW(), NEW.id, NULL);
    END IF;

END$$



/* ============================================================
   3. AFTER INSERT - Asignación automática / manual
   ============================================================ */
CREATE TRIGGER trg_tickets_after_insert_asignacion
AFTER INSERT ON Tickets
FOR EACH ROW
BEGIN
    DECLARE tecnicoId INT DEFAULT NULL;
    DECLARE tiempoRest INT;
    DECLARE puntaje INT;
    DECLARE regla INT DEFAULT NULL;
    DECLARE metodo INT;

    SET tiempoRest = TIMESTAMPDIFF(MINUTE, NOW(), NEW.fechaLimiteResolucion);
    SET puntaje = (NEW.prioridadId * 1000) - tiempoRest;

    /* ============================================================
       🚀 REGLA MODIFICADA:
       Prioridad 2 y 3 → AUTOMÁTICA (mayoría)
       Prioridad 1 → MANUAL (pocos)
       ============================================================ */
    IF NEW.prioridadId >= 2 THEN
        SET regla = 1;  -- Regla automática
        SET metodo = 2; -- Automático

        SELECT id
        INTO tecnicoId
        FROM Tecnicos
        WHERE cargaTrabajo < 5
        ORDER BY cargaTrabajo ASC, id ASC
        LIMIT 1;

    ELSE
        SET regla = 2;  -- Regla manual
        SET metodo = 1; -- Manual
    END IF;

    INSERT INTO Asignacion(
        fecha,
        descripcion,
        idMetodo,
        idRegla,
        tiempoRestanteResolucion,
        puntajePrioridad,
        idTicket,
        idTecnico
    )
    VALUES(
        NOW(),
        IF(metodo = 2, 'Asignación automática', 'Pendiente asignación manual'),
        metodo,
        regla,
        tiempoRest,
        puntaje,
        NEW.id,
        tecnicoId
    );

END$$



/* ============================================================
   4. AFTER INSERT en Asignacion - Actualizar carga + Notificación
   ============================================================ */
CREATE TRIGGER trg_asignacion_after_insert
AFTER INSERT ON Asignacion
FOR EACH ROW
BEGIN
    DECLARE usuarioTecnico INT;

    IF NEW.idTecnico IS NOT NULL THEN
        
        UPDATE Tecnicos
        SET cargaTrabajo = (SELECT COUNT(*) FROM Asignacion WHERE idTecnico = NEW.idTecnico)
        WHERE id = NEW.idTecnico;

        SELECT idUsuario INTO usuarioTecnico
        FROM Tecnicos
        WHERE id = NEW.idTecnico
        LIMIT 1;

        INSERT INTO Notificacion(tipo, mensaje, fecha, idUsuario, idRemitente)
        VALUES (
            'Asignación de Ticket',
            CONCAT('Se le asignó el ticket ', NEW.idTicket),
            NOW(),
            usuarioTecnico,
            NULL
        );

    END IF;

END$$



/* ============================================================
   5. AFTER DELETE - Recalcular carga
   ============================================================ */
CREATE TRIGGER trg_asignacion_after_delete
AFTER DELETE ON Asignacion
FOR EACH ROW
BEGIN
    IF OLD.idTecnico IS NOT NULL THEN
        UPDATE Tecnicos
        SET cargaTrabajo = (SELECT COUNT(*) FROM Asignacion WHERE idTecnico = OLD.idTecnico)
        WHERE id = OLD.idTecnico;
    END IF;
END$$



/* ============================================================
   6. AFTER UPDATE - Recalcular cargas si cambia técnico
   ============================================================ */
CREATE TRIGGER trg_asignacion_after_update
AFTER UPDATE ON Asignacion
FOR EACH ROW
BEGIN
    IF OLD.idTecnico IS NOT NULL THEN
        UPDATE Tecnicos
        SET cargaTrabajo = (SELECT COUNT(*) FROM Asignacion WHERE idTecnico = OLD.idTecnico)
        WHERE id = OLD.idTecnico;
    END IF;

    IF NEW.idTecnico IS NOT NULL THEN
        UPDATE Tecnicos
        SET cargaTrabajo = (SELECT COUNT(*) FROM Asignacion WHERE idTecnico = NEW.idTecnico)
        WHERE id = NEW.idTecnico;
    END IF;

END$$



/* ============================================================
   7. BEFORE UPDATE en Técnicos - Evitar carga negativa
   ============================================================ */
CREATE TRIGGER trg_tecnicos_before_update
BEFORE UPDATE ON Tecnicos
FOR EACH ROW
BEGIN
    IF NEW.cargaTrabajo < 0 THEN
        SET NEW.cargaTrabajo = 0;
    END IF;
END$$

DELIMITER ;


SELECT * FROM reglasautotriage;


-- ================= INSERTS DE NOTIFICACIONES =================
INSERT INTO Notificacion (tipo, mensaje, fecha, idUsuario, idRemitente, leida) VALUES
('Asignación de Ticket', 'Se le ha asignado el ticket #1: Problema con Aula Virtual', NOW(), 2, 1, 0),
('Asignación de Ticket', 'Se le ha asignado el ticket #2: Problema con Usuarios', NOW(), 3, 1, 0),
('Cambio de estado', 'El ticket #3: Laptop no enciende ha pasado a En Proceso', NOW(), 5, 1, 0),
('Comentario', 'El usuario Carlos Cliente comentó en el ticket #4: Wifi intermitente', NOW(), 6, 4, 0),
('Asignación de Ticket', 'Se le ha asignado el ticket #5: Antivirus desactualizado', NOW(), 7, 1, 0),
('Recordatorio', 'El ticket #6: Correo no funciona está próximo a su fecha límite', NOW(), 3, NULL, 0),
('Aviso', 'Se ha cerrado el ticket #7: Monitor no responde', NOW(), 5, NULL, 0),
('Asignación de Ticket', 'Se le ha asignado el ticket #8: VPN no conecta', NOW(), 6, 1, 0),
('Notificación general', 'Se realizará mantenimiento en el sistema este viernes', NOW(), 2, NULL, 0),
('Comentario', 'El técnico Marcos Pérez agregó un comentario al ticket #10: Proyector falla', NOW(), 5, 3, 0);
-- ================= INSERTS TICKETS =================
INSERT INTO Tickets (titulo, descripcion, fechaCreacion, estadoId, prioridadId, idUsuario, idCategoria)
VALUES
('Problema con Aula Virtual', 'No puedo ingresar al aula virtual', NOW(), 1, 1, 4, 1),
('Problema con Usuarios', 'No puedo agregar nuevos usuarios al sistema', NOW(), 1, 2, 4, 1),
('Laptop no enciende', 'La laptop se apaga sola al encender', NOW(), 1, 2, 4, 2),
('Wifi intermitente', 'Se cae la conexión cada 10 minutos', NOW(), 1, 2, 4, 3),
('Antivirus desactualizado', 'El antivirus muestra errores de actualización', NOW(), 1, 1, 4, 4),
('Correo no funciona', 'No puedo enviar ni recibir correos', NOW(), 1, 2, 4, 1),
('Monitor no responde', 'El monitor queda en negro al encender el PC', NOW(), 1, 2, 4, 2),
('VPN no conecta', 'No se puede establecer conexión VPN desde casa', NOW(), 1, 2, 4, 3),
('Acceso no autorizado', 'Se detectó acceso no autorizado en la red', NOW(), 1, 1, 4, 4),
('Proyector falla', 'El proyector no enciende en la sala de reuniones', NOW(), 1, 2, 4, 2),
('Problema con Aula Virtual', 'No puedo ingresar al aula virtual', NOW(), 1, 2, 4, 1);

-- ================= INSERTS HISTORIAL =================
INSERT INTO HistorialEstado (idEstadoAnterior, idEstadoNuevo, fecha, idTicket, idUsuario, observaciones)
VALUES
(1, 2, NOW(), 1, 3, 'Ticket asignado a María Técnico'),
(1, 2, NOW(), 2, 3, 'Ticket asignado a María Técnico'),
(1, 2, NOW(), 3, 5, 'Ticket asignado a Marcos Pérez'),
(1, 2, NOW(), 4, 6, 'Ticket asignado a Laura Gómez'),
(1, 2, NOW(), 5, 7, 'Ticket asignado a Javier Torres'),
(1, 2, NOW(), 6, 3, 'Ticket asignado a María Técnico'),
(1, 2, NOW(), 7, 5, 'Ticket asignado a Marcos Pérez'),
(1, 2, NOW(), 8, 6, 'Ticket asignado a Laura Gómez'),
(1, 2, NOW(), 9, 7, 'Ticket asignado a Javier Torres'),
(1, 2, NOW(), 10, 5, 'Ticket asignado a Marcos Pérez'),
(1, 2, NOW(), 11, 3, 'Ticket asignado a María Técnico');



-- ================= INSERTS VALORACIONES =================
INSERT INTO Valoracion (idPuntaje, comentario, fecha, idTicket, idUsuario)
VALUES
(5, 'Excelente atención y resolución rápida', NOW(), 1, 4),
(3, 'Regular, la solución fue parcial', NOW(), 2, 4),
(4, 'Se encendió correctamente, buen soporte técnico', NOW(), 3, 4),
(3, 'Solución regular, sigue fallando a veces', NOW(), 4, 4),
(5, 'Excelente atención, antivirus actualizado correctamente', NOW(), 5, 4),
(4, 'Funcionó bien después de la intervención', NOW(), 6, 4),
(4, 'Buen servicio, se solucionó rápido', NOW(), 7, 4),
(3, 'Solución parcial, algunos problemas persisten', NOW(), 8, 4),
(2, 'No se resolvió completamente', NOW(), 9, 4),
(5, 'Proyector listo a tiempo, muy satisfecho', NOW(), 10, 4),
(2, 'Problema solucionado parcialmente', NOW(), 11, 4);


INSERT INTO TicketImagen (ruta, fechaSubida, idTicket, idHistorialEstado)
VALUES
('Problema_con_Usuarios.webp', NOW(), 1, 1),
('Laptop_no_enciende.webp', NOW(), 2, 2),
('Wifi_intermitente.webp', NOW(), 3, 3),
('Antivirus_desactualizado.webp', NOW(), 4, 4),
('Correo_no_funciona.webp', NOW(), 5, 5),
('Monitor_no_responde.webp', NOW(), 6, 6),
('VPN_no_conecta.webp', NOW(), 7, 7),
('Acceso_no_autorizado.webp', NOW(), 8, 8),
('Proyector_falla.webp', NOW(), 9, 9),
('Problema_con_Aula_Virtual.jpg', NOW(), 11, 11);

select * from asignacion;

INSERT INTO Tickets (
    titulo, descripcion, fechaCreacion, estadoId, prioridadId, idUsuario, idCategoria
) VALUES

('Ticket Automático 3', 'Problema de acceso remoto', NOW(), 1, 3, 4, 4);





/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
