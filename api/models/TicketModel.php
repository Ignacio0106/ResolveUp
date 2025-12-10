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
        $vSql = "SELECT t.*, s.tiempoRespuesta AS slaRespuesta,
                s.tiempoResolucion AS slaResolucion
               FROM tickets t
            JOIN Categoria c ON t.idCategoria = c.id
            JOIN SLA s ON c.idSLA = s.id;";
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
    return $vResultado[0];
}

public function getTicketsByUsuario($idUsuario){
    $usuarioM = new UsuarioModel();
    $user = $usuarioM->get($idUsuario);
    switch ($user->rol->id) {
        case '1':
            $vSql = "SELECT t.*, e.nombre as estado, u.nombre as usuarioSolicitante FROM tickets t
                    JOIN estadoTicket e ON t.estadoId = e.id
                    JOIN Usuario u ON t.idUsuario = u.id;";
            break;
        case '2':
            $vSql = "SELECT t.*, e.nombre as estado, u.nombre as usuarioSolicitante FROM tickets t
                     JOIN asignacion a ON t.id = a.idTicket
                     JOIN tecnicos tec ON a.idTecnico = tec.id
                     JOIN estadoTicket e ON t.estadoId = e.id
                     JOIN Usuario u ON t.idUsuario = u.id
                     WHERE tec.idUsuario = $idUsuario;";
            break;
        case '3':
    $vSql = "SELECT t.*, e.nombre as estado, u.nombre as usuarioSolicitante FROM tickets t
                    JOIN estadoTicket e ON t.estadoId = e.id
                    JOIN Usuario u ON t.idUsuario = u.id
                    WHERE idUsuario = $idUsuario;";
    }
    $vResultado = $this->enlace->ExecuteSQL($vSql);

    return $vResultado ?? [];
}

public function getTicketPendiente(){
    $vResultado = [];

    $vSql = "SELECT t.*, c.nombre as categoria, p.nombre as prioridad FROM tickets t
                    JOIN categoria c ON t.idCategoria = c.id
                    JOIN prioridadticket p ON t.prioridadId = p.id
                    WHERE t.estadoId = 1;";
    $vResultado = $this->enlace->ExecuteSQL($vSql);

        return $vResultado;
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
        $fechaCreacion = $objeto->fechaCreacion;
        $idCategoria   = (int)$objeto->idCategoria;

         $sqlSla = "
        SELECT 
            s.tiempoRespuesta,
            s.tiempoResolucion
        FROM Categoria c
        JOIN SLA s ON c.idSLA = s.id
        WHERE c.id = $idCategoria
        LIMIT 1;
    ";
    $sla = $this->enlace->ExecuteSQL($sqlSla);

    $tiempoRespuesta  = (int)$sla[0]->tiempoRespuesta; 
    $tiempoResolucion = (int)$sla[0]->tiempoResolucion;  
    
    $fechaLimiteRespuesta  = date('Y-m-d H:i:s', strtotime("$fechaCreacion + $tiempoRespuesta MINUTE"));
    $fechaLimiteResolucion = date('Y-m-d H:i:s', strtotime("$fechaCreacion + $tiempoResolucion MINUTE"));

        //Consulta sql
        $sql = "INSERT INTO Tickets (titulo, descripcion, fechaCreacion, fechaLimiteRespuesta, fechaLimiteResolucion, estadoId, prioridadId, idUsuario, idCategoria)" .
            " Values ('$objeto->titulo','$objeto->descripcion','$objeto->fechaCreacion', '$fechaLimiteRespuesta', '$fechaLimiteResolucion','$objeto->estadoId','$objeto->prioridadId',
                    '$objeto->idUsuario','$objeto->idCategoria')";
        //Ejecutar la consulta
        $insertId = $this->enlace->executeSQL_DML_last($sql);
        //Retornar resultado
        return ["success" => true, "status" => 201, "message" => "Ticket creado", "id" => $insertId,"titulo" => $objeto->titulo];
    }


    public function update($objeto)
    {
        $idTicket       = (int)$objeto->idTicket;
        $idEstadoNuevo  = (int)$objeto->idEstadoNuevo;
        $comentario     = trim($objeto->comentario ?? '');
        $idUsuario      = (int)$objeto->idUsuario;
        date_default_timezone_set('America/Costa_Rica');
        $fecha = (new DateTime())->format('Y-m-d H:i:s');

        $ticket = $this->getById($idTicket);

        $idEstadoAnterior = (int)$ticket->estadoId;

        $sqlHist = "
            INSERT INTO HistorialEstado 
                (idEstadoAnterior, idEstadoNuevo, fecha, observaciones, idTicket, idUsuario)
            VALUES
                ($idEstadoAnterior, $idEstadoNuevo, '$fecha', '$comentario', $idTicket, $idUsuario);
        ";
        $this->enlace->executeSQL_DML_last($sqlHist);

        $sqlTicket = "UPDATE Tickets SET estadoId = $idEstadoNuevo WHERE id = $idTicket;";
        $this->enlace->executeSQL_DML($sqlTicket);

        if($idEstadoNuevo == 5){
            $sqlTecnico = "SELECT a.idTecnico FROM Asignacion a WHERE a.idTicket = $idTicket;";
            $resTecnico = $this->enlace->executeSQL($sqlTecnico);
            $sqlUpdTec = "UPDATE Tecnicos SET cargaTrabajo = cargaTrabajo - 1 WHERE id = $resTecnico[0]->idTecnico;";
            $this->enlace->executeSQL_DML($sqlUpdTec);
        }

        $sqlNoti =  "INSERT INTO Notificacion 
        (tipo, 
        mensaje, 
        fecha, 
        idUsuario, 
        idRemitente, 
        leida, 
        leidaPor,
        leidaAt) VALUES
        ('Actualización de Ticket', 
        'Se actualizó el estado del ticket #$idTicket', 
        '$fecha', 
        $idUsuario, 
        NULL, 
        0, 
        NULL, 
        NULL);";

        $this->enlace->executeSQL_DML($sqlNoti);

        return $this->get($idTicket);
    }

    public function asignarManual($objeto)
{
    try {
        $idTicket            = $objeto->idTicket;
        $idTecnico           = $objeto->idTecnico;
        $justificacion       = $objeto->justificacion ?? '';
        $idUsuarioAsignador  = $objeto->idUsuarioAsignador ?? '';

        $ticket = $this->getById($idTicket);

        $sqlMetodo = "SELECT id FROM MetodoAsignacion WHERE nombre = 'Manual';";
        $metodoRes = $this->enlace->ExecuteSQL($sqlMetodo);
        $idMetodo = (int)$metodoRes[0]->id;
        

        date_default_timezone_set('America/Costa_Rica');
        $fecha = (new DateTime())->format('Y-m-d H:i:s');

        // 3️⃣ Calcular tiempo restante
        $tiempoRestante = "NULL";
        if (!empty($ticket->fechaLimiteResolucion)) {
            $limite = strtotime($ticket->fechaLimiteResolucion);
            $ahora  = time();
            $minRestantes = (int)(($limite - $ahora) / 60);
            $tiempoRestante = $minRestantes;
        }

        $sqlAsign = "
            INSERT INTO Asignacion (
                fecha,
                descripcion,
                idMetodo,
                idTicket,
                idTecnico,
                idRegla,
                tiempoRestanteResolucion,
                puntajePrioridad
            ) VALUES (
                '$fecha',
                '$justificacion',
                $idMetodo,
                $idTicket,
                $idTecnico,
                NULL,
                $tiempoRestante,
                NULL
            );
        ";
        $this->enlace->executeSQL_DML($sqlAsign);

        $sqlUpdTicket = "UPDATE Tickets SET estadoId = 2 WHERE id = $idTicket;";
        $this->enlace->executeSQL_DML($sqlUpdTicket);

        $sqlUpdTec = "UPDATE Tecnicos SET cargaTrabajo = cargaTrabajo + 1 WHERE id = $idTecnico;";
        $this->enlace->executeSQL_DML($sqlUpdTec);

        $mensaje  = 'Se le ha asignado el ticket #' . $ticket->id . ': ' . $ticket->titulo;

        $sqlNoti =  "INSERT INTO Notificacion 
        (tipo, 
        mensaje, 
        fecha, 
        idUsuario, 
        idRemitente, 
        leida, 
        leidaPor,
        leidaAt) VALUES
        ('Asignación de Ticket', 
        '$mensaje', 
        '$fecha', 
        $idTecnico, 
        $idUsuarioAsignador, 
        0, 
        NULL, 
        NULL);";

        $this->enlace->executeSQL_DML($sqlNoti);

        $sqlNoti2 =  "INSERT INTO Notificacion 
        (tipo, 
        mensaje, 
        fecha, 
        idUsuario, 
        idRemitente, 
        leida, 
        leidaPor,
        leidaAt) VALUES
        ('Asignación de Ticket', 
        '$mensaje', 
        '$fecha', 
        $idUsuarioAsignador, 
        NULL, 
        0, 
        NULL, 
        NULL);";

        $this->enlace->executeSQL_DML($sqlNoti2);

        return [
            "success" => true,
            "status"  => 200,
            "message" => "Asignación manual realizada correctamente"
        ];

    } catch (Exception $e) {
        handleException($e);
        return [
            "success" => false,
            "status"  => 500,
            "message" => "Error en la asignación manual",
            "error"   => $e->getMessage()
        ];
    }
}
}
