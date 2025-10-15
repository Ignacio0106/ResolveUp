<?php
class TicketModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /*Listar */
    public function all()
    {
        //Consulta sql
        $vSql = "SELECT * FROM ticket;";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado;
    }

    public function get($idTicket)
{
    try {
        // Instancia del enlace a BD
        $response = [];

        // 1️⃣ Información principal del ticket
        $vSqlTicket = "
            SELECT 
                t.id AS idTicket,
                t.titulo,
                t.descripcion,
                t.fechaCreacion,
                t.fechaCierre,
                e.nombre AS estado,
                p.nombre AS prioridad,
                u.nombre AS usuarioSolicitante,
                c.nombre AS categoria,
                t.diasResolucion,
                s.tiempoRespuesta AS slaRespuesta,
                s.tiempoResolucion AS slaResolucion,
                t.cumplimientoRespuesta,
                t.cumplimientoResolucion
            FROM Tickets t
            JOIN EstadoTicket e ON t.estadoId = e.id
            JOIN PrioridadTicket p ON t.prioridadId = p.id
            JOIN Usuario u ON t.idUsuario = u.id
            JOIN Categoria c ON t.idCategoria = c.id
            JOIN SLA s ON c.idSLA = s.id
            WHERE t.id = $idTicket;
        ";
        $ticket = $this->enlace->ExecuteSQL($vSqlTicket);
        $response['ticket'] = $ticket[0] ?? null;

        // 2️⃣ Historial de estados con observaciones e imágenes
        $vSqlHistorial = "
            SELECT 
                h.id AS idHistorial,
                ea.nombre AS estadoAnterior,
                en.nombre AS estadoNuevo,
                h.fecha,
                h.observaciones,
                GROUP_CONCAT(i.ruta) AS imagenes
            FROM HistorialEstado h
            LEFT JOIN EstadoTicket ea ON h.idEstadoAnterior = ea.id
            LEFT JOIN EstadoTicket en ON h.idEstadoNuevo = en.id
            LEFT JOIN TicketImagen i ON h.id = i.idHistorialEstado
            WHERE h.idTicket = $idTicket
            GROUP BY h.id, ea.nombre, en.nombre, h.fecha, h.observaciones
            ORDER BY h.fecha ASC;
        ";
        $historial = $this->enlace->ExecuteSQL($vSqlHistorial);
        $response['historial'] = $historial;

        // 3️⃣ Valoraciones del ticket
        $vSqlValoraciones = "
            SELECT 
                pv.descripcion AS puntaje,
                v.comentario,
                v.fecha
            FROM Valoracion v
            JOIN PuntajeValoracion pv ON v.idPuntaje = pv.id
            WHERE v.idTicket = $idTicket;
        ";
        $valoraciones = $this->enlace->ExecuteSQL($vSqlValoraciones);
        $response['valoraciones'] = $valoraciones;

        return [
            'success' => true,
            'status' => 200,
            'message' => 'Detalle de ticket',
            'data' => $response
        ];
    } catch (Exception $e) {
        handleException($e);
        return [
            'success' => false,
            'status' => 500,
            'message' => 'Error al obtener detalle del ticket',
            'error' => $e->getMessage()
        ];
    }
}

    public function getTicketDetalle()
{
    try {
        // Instancia del enlace a BD
        $response = [];

        // 1️⃣ Información principal del ticket
        $vSqlTicket = "
            SELECT 
                t.id AS idTicket,
                t.titulo,
                t.descripcion,
                t.fechaCreacion,
                t.fechaCierre,
                e.nombre AS estado,
                p.nombre AS prioridad,
                u.nombre AS usuarioSolicitante,
                c.nombre AS categoria,
                t.diasResolucion,
                s.tiempoRespuesta AS slaRespuesta,
                s.tiempoResolucion AS slaResolucion,
                t.cumplimientoRespuesta,
                t.cumplimientoResolucion
            FROM Tickets t
            JOIN EstadoTicket e ON t.estadoId = e.id
            JOIN PrioridadTicket p ON t.prioridadId = p.id
            JOIN Usuario u ON t.idUsuario = u.id
            JOIN Categoria c ON t.idCategoria = c.id
            JOIN SLA s ON c.idSLA = s.id";
        $ticket = $this->enlace->ExecuteSQL($vSqlTicket);
        $response['ticket'] = $ticket[0] ?? null;

        // 2️⃣ Historial de estados con observaciones e imágenes
        $vSqlHistorial = "
            SELECT 
                h.id AS idHistorial,
                ea.nombre AS estadoAnterior,
                en.nombre AS estadoNuevo,
                h.fecha,
                h.observaciones,
                GROUP_CONCAT(i.ruta) AS imagenes
            FROM HistorialEstado h
            LEFT JOIN EstadoTicket ea ON h.idEstadoAnterior = ea.id
            LEFT JOIN EstadoTicket en ON h.idEstadoNuevo = en.id
            LEFT JOIN TicketImagen i ON h.id = i.idHistorialEstado
            GROUP BY h.id, ea.nombre, en.nombre, h.fecha, h.observaciones
            ORDER BY h.fecha ASC;";
        $historial = $this->enlace->ExecuteSQL($vSqlHistorial);
        $response['historial'] = $historial;

        // 3️⃣ Valoraciones del ticket
        $vSqlValoraciones = "
            SELECT 
                pv.descripcion AS puntaje,
                v.comentario,
                v.fecha
            FROM Valoracion v
            JOIN PuntajeValoracion pv ON v.idPuntaje = pv.id";
        $valoraciones = $this->enlace->ExecuteSQL($vSqlValoraciones);
        $response['valoraciones'] = $valoraciones;

        return [
            'success' => true,
            'status' => 200,
            'message' => 'Detalle de ticket',
            'data' => $response
        ];
    } catch (Exception $e) {
        handleException($e);
        return [
            'success' => false,
            'status' => 500,
            'message' => 'Error al obtener detalle del ticket',
            'error' => $e->getMessage()
        ];
    }
}

    public function listadoDetalle() {
    try {
        // Consulta SQL que devuelve todos los tickets
        $vSQL = "
            SELECT 
                t.id AS idTicket,
                t.titulo,
                t.descripcion,
                t.fechaCreacion,
                u.nombre AS usuarioSolicitante,
                CASE 
                    WHEN u.idRol = 1 THEN 'Administrador'
                    WHEN u.idRol = 2 THEN 'Cliente'  -- Rol del creador
                    WHEN u.idRol = 3 THEN 'Cliente'
                    ELSE 'Desconocido'
                END AS rolUsuario,
                CONCAT('http://localhost:81/Proyecto/api/ticket/get/', t.id) AS enlace
            FROM Tickets t
            JOIN Usuario u ON t.idUsuario = u.id
            ORDER BY t.fechaCreacion DESC
        ";

        $resultado = $this->enlace->ExecuteSQL($vSQL);

        return [
            "success" => true,
            "status" => 200,
            "message" => "Tickets encontrados",
            "data" => $resultado
        ];

    } catch (Exception $e) {
        handleException($e);
    }
}


}
