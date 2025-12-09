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
SELECT t.*, e.nombre as estado, u.nombre as usuarioSolicitante FROM tickets t
                    JOIN estadoTicket e ON t.estadoId = e.id
                    JOIN Usuario u ON t.idUsuario = u.id;
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

-- ================= INSERTS ESTADO NOTIFICACIÓN =================
INSERT INTO EstadoNotificacion (descripcion) VALUES 
('Pendiente'), 
('Enviado'), 
('Leído');

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
SELECT *
            FROM Tecnicos t
            JOIN Usuario u ON t.idUsuario = u.id
            select * from tickets
            select * from tecnicos
            select * from tecnicoespecialidad
            select * from categoriaespecialidad
            SELECT * FROM tickets
                    WHERE id = 1
			
            SELECT *
            FROM Tecnicos t
            JOIN Usuario u ON t.idUsuario = u.id;
            
            SELECT t.id AS idTecnico, u.nombre AS nombreTecnico, u.correo AS correoTecnico,
            t.disponibilidad, t.cargaTrabajo
            FROM Tecnicos t
            JOIN Usuario u ON t.idUsuario = u.id
            JOIN TecnicoEspecialidad te ON t.id = te.idTecnico
            WHERE te.idEspecialidad = 1;
                    
            SELECT e.id, e.nombre
                     FROM Especialidad e
                     JOIN CategoriaEspecialidad ce ON e.id = ce.idEspecialidad
                     WHERE ce.idCategoria = 1;
            
            select * from sla
            SELECT t.*, u.*, te.*
            FROM Tecnicos t
            JOIN Usuario u ON t.idUsuario = u.id
            JOIN tecnicoespecialidad te ON te.idTecnico = t.id;
            
            SELECT t.*
            FROM Tecnicos t
            JOIN Tickets ti ON t. = u.id;
SELECT e.id, e.nombre
                     FROM Especialidad e
                     JOIN tecnicoespecialidad te ON e.id = te.idEspecialidad
                     WHERE te.idTecnico = 14;
                     
select * from 	;
-- ================= INSERTS USUARIOS =================
INSERT INTO Usuario (nombre, correo, contraseña, idRol) VALUES
('Admin', 'juan.admin@email.com', '$2y$10$scI82uL6SHKqI.YV6yimjeFKEtMWySRiUc02lBVZ35AjWVxPTzQj6', 1),
('María Técnico', 'maria.tecnico@email.com', '$2y$10$scI82uL6SHKqI.YV6yimjeFKEtMWySRiUc02lBVZ35AjWVxPTzQj6', 2),
('Luis Técnico', 'luis.tecnico@email.com', '$2y$10$scI82uL6SHKqI.YV6yimjeFKEtMWySRiUc02lBVZ35AjWVxPTzQj6', 2),
('Carlos Cliente', 'carlos.cliente@email.com', '$2y$10$scI82uL6SHKqI.YV6yimjeFKEtMWySRiUc02lBVZ35AjWVxPTzQj6', 3),
('Marcos Pérez', 'marcos.perez@email.com', '$2y$10$scI82uL6SHKqI.YV6yimjeFKEtMWySRiUc02lBVZ35AjWVxPTzQj6', 2),
('Laura Gómez', 'laura.gomez@email.com', '$2y$10$scI82uL6SHKqI.YV6yimjeFKEtMWySRiUc02lBVZ35AjWVxPTzQj6', 2),
('Javier Torres', 'javier.torres@email.com', '$2y$10$scI82uL6SHKqI.YV6yimjeFKEtMWySRiUc02lBVZ35AjWVxPTzQj6', 2),
('Camila Rojas', 'camila.rojas@email.com', '$2y$10$scI82uL6SHKqI.YV6yimjeFKEtMWySRiUc02lBVZ35AjWVxPTzQj6', 2),
('Fernando Castillo', 'fernando.castillo@email.com', '$2y$10$scI82uL6SHKqI.YV6yimjeFKEtMWySRiUc02lBVZ35AjWVxPTzQj6', 2),
('Isabella Fernández', 'isabella.fernandez@email.com', '$2y$10$scI82uL6SHKqI.YV6yimjeFKEtMWySRiUc02lBVZ35AjWVxPTzQj6', 2);
select * from asignacion 
SELECT * FROM tickets
                    WHERE idUsuario = 1
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



 
-- ================= TRIGGERS   =================
 
 
DELIMITER $$

-- 1. Calcular fechas SLA al crear ticket
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

-- 2. Calcular cumplimiento SLA al cerrar ticket y registrar historial
CREATE TRIGGER trg_tickets_before_update
BEFORE UPDATE ON Tickets
FOR EACH ROW
BEGIN
    DECLARE diff INT DEFAULT 0;
    DECLARE cumpleResp TINYINT DEFAULT 0;
    DECLARE cumpleReso TINYINT DEFAULT 0;

    IF OLD.fechaCierre IS NULL AND NEW.fechaCierre IS NOT NULL THEN
        SET diff = TIMESTAMPDIFF(DAY, NEW.fechaCreacion, NEW.fechaCierre);
        SET cumpleResp = IF(NEW.fechaLimiteRespuesta >= NEW.fechaCierre, 1, 0);
        SET cumpleReso = IF(NEW.fechaLimiteResolucion >= NEW.fechaCierre, 1, 0);

        SET NEW.diasResolucion = diff;
        SET NEW.cumplimientoRespuesta = cumpleResp;
        SET NEW.cumplimientoResolucion = cumpleReso;
    END IF;

    -- Registrar historial si cambió el estado
    IF OLD.estadoId != NEW.estadoId THEN
        INSERT INTO HistorialEstado(idEstadoAnterior, idEstadoNuevo, fecha, idTicket, idUsuario)
        VALUES (OLD.estadoId, NEW.estadoId, NOW(), NEW.id, NULL);
    END IF;
END$$

-- 3. AFTER INSERT en Tickets: crear asignación automática
CREATE TRIGGER trg_tickets_after_insert_asignacion
AFTER INSERT ON Tickets
FOR EACH ROW
BEGIN
    DECLARE tecnicoId INT DEFAULT NULL;

    -- Buscar primer técnico disponible
    SELECT id INTO tecnicoId
    FROM Tecnicos
    WHERE cargaTrabajo < 5
    ORDER BY cargaTrabajo ASC, id ASC
    LIMIT 1;

    -- Insertar asignación si hay técnico disponible
    IF tecnicoId IS NOT NULL THEN
        INSERT INTO Asignacion(fecha, descripcion, idMetodo, idTicket, idTecnico)
        VALUES (NOW(), 'Asignación automática', 2, NEW.id, tecnicoId);
    END IF;
END$$

-- 4. AFTER INSERT en Asignacion: actualizar carga y crear notificación
CREATE TRIGGER trg_asignacion_after_insert
AFTER INSERT ON Asignacion
FOR EACH ROW
BEGIN
    DECLARE usuarioTecnico INT DEFAULT NULL;

    IF NEW.idTecnico IS NOT NULL THEN
        -- Actualizar carga del técnico
        UPDATE Tecnicos
        SET cargaTrabajo = (SELECT COUNT(*) FROM Asignacion WHERE idTecnico = NEW.idTecnico)
        WHERE id = NEW.idTecnico;

        -- Crear notificación
        SELECT idUsuario INTO usuarioTecnico FROM Tecnicos WHERE id = NEW.idTecnico LIMIT 1;
        INSERT INTO Notificacion(tipo, mensaje, fecha, idEstado, idUsuario, idRemitente)
        VALUES ('Asignación de Ticket', CONCAT('Se le ha asignado el ticket: ', NEW.idTicket), NOW(), 1, usuarioTecnico, NULL);
    END IF;
END$$

-- 5. AFTER DELETE en Asignacion: actualizar carga del técnico
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

-- 6. AFTER UPDATE en Asignacion: recalcular carga de técnicos si cambia idTecnico
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

-- 7. BEFORE UPDATE en Tecnicos: evitar carga negativa
CREATE TRIGGER trg_tecnicos_before_update
BEFORE UPDATE ON Tecnicos
FOR EACH ROW
BEGIN
    IF NEW.cargaTrabajo < 0 THEN
        SET NEW.cargaTrabajo = 0;
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_historial_ticket_creado
AFTER INSERT ON Tickets
FOR EACH ROW
BEGIN
    INSERT INTO HistorialEstado (
        idEstadoAnterior,
        idEstadoNuevo,
        fecha,
        idTicket,
        idUsuario,
        observaciones
    ) VALUES (
        NEW.estadoId,     -- ← No permite NULL
        NEW.estadoId,     -- ← Mismo estado para el registro inicial
        NOW(),
        NEW.id,
        NEW.idUsuario,
        'Ticket creado'
    );
END$$

DELIMITER ;

-- ================= INSERTS TICKETS =================
INSERT INTO Tickets (titulo, descripcion, fechaCreacion, estadoId, prioridadId, idUsuario, idCategoria)
VALUES
('Problema con Aula Virtual', 'No puedo ingresar al aula virtual', NOW(), 1, 1, 4, 1),
('Problema con Usuarios', 'No puedo agregar nuevos usuarios al sistema', NOW(), 2, 2, 4, 1),
('Laptop no enciende', 'La laptop se apaga sola al encender', NOW(), 3, 2, 4, 2),
('Wifi intermitente', 'Se cae la conexión cada 10 minutos', NOW(), 4, 2, 4, 3),
('Antivirus desactualizado', 'El antivirus muestra errores de actualización', NOW(), 5, 1, 4, 4),
('Correo no funciona', 'No puedo enviar ni recibir correos', NOW(), 1, 2, 4, 1),
('Monitor no responde', 'El monitor queda en negro al encender el PC', NOW(), 2, 2, 4, 2),
('VPN no conecta', 'No se puede establecer conexión VPN desde casa', NOW(), 3, 2, 4, 3),
('Acceso no autorizado', 'Se detectó acceso no autorizado en la red', NOW(), 4, 1, 4, 4),
('Proyector falla', 'El proyector no enciende en la sala de reuniones', NOW(), 5, 2, 4, 2),
('Problema con Aula Virtual', 'No puedo ingresar al aula virtual', NOW(), 1, 2, 4, 1);
select * from tickets
select * from categoria
select * from sla
select * from prioridadticket
SELECT t.*, c.nombre as categoria, p.nombre as prioridad FROM tickets t
                    JOIN categoria c ON t.idCategoria = c.id
                    JOIN prioridadticket p ON t.prioridadId = p.id
                    WHERE t.estadoId = 1;

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
