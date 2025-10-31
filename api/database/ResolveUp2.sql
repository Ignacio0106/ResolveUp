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

-- ================= INSERTS USUARIOS =================
INSERT INTO Usuario (nombre, correo, contraseña, idRol) VALUES
('Juan Admin', 'juan.admin@email.com', '1234', 1),
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

-- ================= INSERTS TICKETS =================
INSERT INTO Tickets (titulo, descripcion, fechaCreacion, estadoId, prioridadId, idUsuario, idCategoria)
VALUES
('Problema con Aula Virtual', 'No puedo ingresar al aula virtual', NOW(), 1, 3, 4, 1),
('Problema con Usuarios', 'No puedo agregar nuevos usuarios al sistema', NOW(), 3, 2, 4, 1),
('Laptop no enciende', 'La laptop se apaga sola al encender', NOW(), 4, 2, 4, 2),
('Wifi intermitente', 'Se cae la conexión cada 10 minutos', NOW(), 4, 2, 4, 3),
('Antivirus desactualizado', 'El antivirus muestra errores de actualización', NOW(), 5, 1, 4, 4),
('Correo no funciona', 'No puedo enviar ni recibir correos', NOW(), 1, 2, 4, 1),
('Monitor no responde', 'El monitor queda en negro al encender el PC', NOW(), 2, 2, 4, 2),
('VPN no conecta', 'No se puede establecer conexión VPN desde casa', NOW(), 3, 3, 4, 3),
('Acceso no autorizado', 'Se detectó acceso no autorizado en la red', NOW(), 4, 1, 4, 4),
('Proyector falla', 'El proyector no enciende en la sala de reuniones', NOW(), 5, 2, 4, 2),
('Problema con Aula Virtual', 'No puedo ingresar al aula virtual', NOW(), 1, 3, 4, 1);

-- ================= INSERTS ASIGNACIONES =================
INSERT INTO Asignacion (fecha, descripcion, idMetodo, idTicket, idTecnico, tiempoRestanteResolucion, puntajePrioridad)
VALUES
('2025-10-30 09:00:00', 'Asignación manual', 1, 1, 1, 360, 75.25),
('2025-10-30 09:00:00', 'Asignación manual', 1, 2, 1, 360, 55.25),
('2025-10-28 09:00:00', 'Asignación manual', 1, 3, 1, 360, 45.25),
('2025-10-29 09:00:00', 'Asignación manual', 1, 4, 1, 360, 70.25),
('2025-11-04 09:00:00', 'Asignación manual', 1, 5, 3, 360, 70.25),
('2025-11-04 09:00:00', 'Asignación manual', 1, 2, 3, 360, 70.25),
('2025-10-20 09:00:00', 'Asignación manual', 1, 3, 5, 240, 82.50),
('2025-10-30 09:00:00', 'Asignación manual', 1, 4, 6, 720, 55.00),
('2025-11-09 09:00:00', 'Asignación manual', 1, 5, 7,  180, 90.00),
('2025-10-28 09:00:00', 'Asignación manual', 1, 6, 3,  600, 60.10),
('2025-11-06 09:00:00', 'Asignación manual', 1, 7, 5,  300, 75.80),
('2025-10-23 09:00:00', 'Asignación manual', 1, 8, 6,  840, 50.00),
('2025-11-02 09:00:00', 'Asignación manual', 1, 9, 7,  120, 88.40),
('2025-10-28 09:00:00', 'Asignación manual', 1, 10, 5, 420, 68.90),
('2025-11-08 09:00:00', 'Asignación manual', 1, 1, 3,  90, 92.30),
('2025-10-24 09:00:00', 'Asignación manual', 1, 11, 1, 540, 66.50),
('2025-11-05 09:00:00', 'Asignación manual', 1, 2, 2, 300, 74.20),
('2025-10-27 09:00:00', 'Asignación manual', 1, 2, 4, 660, 58.75),
('2025-11-03 09:00:00', 'Asignación manual', 1, 3, 8, 240, 85.60),
('2025-10-23 09:00:00', 'Asignación manual', 1, 8, 7,  840, 50.00),
('2025-11-02 09:00:00', 'Asignación manual', 1, 9, 7,  120, 88.40),
('2025-10-28 09:00:00', 'Asignación manual', 1, 10, 8, 420, 68.90);

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



-- ================= INSERTS NOTIFICACIONES =================
INSERT INTO Notificacion (tipo, mensaje, fecha, idEstado, idUsuario, idRemitente)
VALUES
('Asignación de Ticket', 'Se le ha asignado el ticket ID 1', NOW(), 1, 3, NULL),
('Asignación de Ticket', 'Se le ha asignado el ticket ID 2', NOW(), 1, 3, NULL),
('Asignación de Ticket', 'Se le ha asignado el ticket ID 3', NOW(), 1, 5, NULL),
('Asignación de Ticket', 'Se le ha asignado el ticket ID 4', NOW(), 1, 6, NULL),
('Asignación de Ticket', 'Se le ha asignado el ticket ID 5', NOW(), 1, 7, NULL),
('Asignación de Ticket', 'Se le ha asignado el ticket ID 6', NOW(), 1, 3, NULL),
('Asignación de Ticket', 'Se le ha asignado el ticket ID 7', NOW(), 1, 5, NULL),
('Asignación de Ticket', 'Se le ha asignado el ticket ID 8', NOW(), 1, 6, NULL),
('Asignación de Ticket', 'Se le ha asignado el ticket ID 9', NOW(), 1, 7, NULL),
('Asignación de Ticket', 'Se le ha asignado el ticket ID 10', NOW(), 1, 5, NULL),
('Asignación de Ticket', 'Se le ha asignado el ticket ID 11', NOW(), 1, 3, NULL);


 
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
                1,   	-- Pendiente
                NEW.idTecnico, -- receptor
                NULL 	-- remitente
        	);
    	END IF;
 
    	-- Actualizar estado del ticket a 'Asignado'
    	UPDATE Tickets
    	SET estadoId = (SELECT id FROM EstadoTicket WHERE nombre = 'Asignado')
    	WHERE id = NEW.idTicket;
	END IF;
END$$
 
DELIMITER ;




/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
