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

        // Información principal del ticket
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

        // Historial de estados con observaciones e imágenes
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

        // imagenes 
        
        //  Valoraciones del ticket
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

public function getById($idTicket){
    $vSql = "SELECT * FROM tickets
                    WHERE id = $idTicket;";
    $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
    return $vResultado[0] ?? null;
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

        //
        //  Valoraciones del ticket
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
       
        $idUsuario = 1;

        // Obtener el rol del usuario
        $vSQLRol = "
    SELECT u.idRol, r.nombre AS nombreRol, u.nombre AS nombreUsuario
    FROM Usuario u
    INNER JOIN Rol r ON u.idRol = r.id
    WHERE u.id = $idUsuario
";
$rolResultado = $this->enlace->ExecuteSQL($vSQLRol);

if (empty($rolResultado)) {
    return [
        "success" => false,
        "status" => 404,
        "message" => "Usuario no encontrado",
        "data" => null
    ];
}

$rolUsuario = $rolResultado[0]->idRol;
$nombreUsuario = $rolResultado[0]->nombreUsuario;
$rol = $rolResultado[0]->nombreRol;

        // Construir WHERE según rol
        $where = "";
        if ($rolUsuario == 1) {
            // Admin: todos los tickets
            $where = "1=1";
        } elseif ($rolUsuario == 3) {
            // Cliente: solo sus tickets
            $where = "t.idUsuario = $idUsuario";
        } elseif ($rolUsuario == 2) {
            // Técnico: solo tickets asignados
            $where = "EXISTS (
                SELECT 1
                FROM Asignacion a
                JOIN Tecnicos tec ON a.idTecnico = tec.id
                WHERE a.idTicket = t.id AND tec.idUsuario = $idUsuario
            )";
        }

        // SQL principal
        $vSQL = "
            SELECT 
                t.id AS idTicket,
                t.titulo,
                t.descripcion,
                t.fechaCreacion,
                u.nombre AS usuarioSolicitante,
                r.nombre AS rolUsuario,
                CONCAT('http://localhost:81/Proyecto/api/ticket/') AS ruta
            FROM Tickets t
            JOIN Usuario u ON t.idUsuario = u.id
            JOIN Rol r ON u.idRol = r.id
            WHERE $where
            ORDER BY t.fechaCreacion DESC
        ";

        $result = $this->enlace->ExecuteSQL($vSQL);

        return [
            "success" => true,
            "status" => 200,
            "message" => "Listado obtenido correctamente",
            "usuario" => $nombreUsuario,
            "rol" => $rol,
            "data" => $result
        ];

    } catch (Exception $e) {
        return [
            "success" => false,
            "status" => 500,
            "message" => "Error: " . $e->getMessage(),
            "data" => null
        ];
    }
}




    public function create($objeto)
    {
        //Consulta sql
        $sql = "INSERT INTO Tickets (titulo, descripcion, fechaCreacion, estadoId, prioridadId, idUsuario, idCategoria)" .
            " Values ('$objeto->titulo','$objeto->descripcion','$objeto->fechaCreacion','$objeto->estadoId','$objeto->prioridadId',
                    '$objeto->idUsuario','$objeto->idCategoria')";
        //Ejecutar la consulta
        $insertId = $this->enlace->executeSQL_DML_last($sql);
        //Retornar resultado
        return ["success" => true, "status" => 201, "message" => "Ticket creado", "id" => $insertId,"titulo" => $objeto->titulo];
    }


    public function update($objeto)
    {
        //Consulta sql
        $sql = "Update Tickets SET titulo ='$objeto->titulo'," .
            "descripcion ='$objeto->descripcion',fechaCreacion ='$objeto->fechaCreacion'," .
            "idEstado='$objeto->idEstado',idPrioridad='$objeto->idPrioridad'," .
            "idUsuario='$objeto->idUsuario',idCategoria='$objeto->idCategoria'" .
            " Where id=$objeto->id  ";

        //Ejecutar la consulta
        $cResults = $this->enlace->executeSQL_DML($sql);
        //--- Generos ---
        //Eliminar generos asociados a la pelicula
        $sql = "Delete from movie_genre where movie_id=$objeto->id";
        $vResultadoD = $this->enlace->executeSQL_DML($sql); 
        //Insertar generos
        foreach ($objeto->genres as $item) {
            $sql = "Insert into movie_genre(movie_id,genre_id)" .
                " Values($objeto->id,$item)";
            $vResultadoG = $this->enlace->executeSQL_DML($sql);
        }
        //--- Actores ---
        //Eliminar actores asociados a la pelicula
        $sql = "Delete from movie_cast where movie_id=$objeto->id";
        $vResultadoD = $this->enlace->executeSQL_DML($sql);
        //Crear actores
        foreach ($objeto->actors as $item) {
            $sql = "Insert into movie_cast(movie_id,actor_id,role)" .
                " Values($objeto->id, $item->actor_id, '$item->role')";
            $vResultadoA = $this->enlace->executeSQL_DML($sql);
        }

        //Retornar pelicula
        return $this->get($objeto->id);
    }

}
