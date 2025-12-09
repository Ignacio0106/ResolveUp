<?php
class NotificacionModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function crearNotificacionLogin($idUsuario)
    {
        $tipo = "login";
        $mensaje = "Se ha iniciado sesión en su cuenta.";
        
        $sql = "INSERT INTO Notificacion
                (tipo, mensaje, fecha, idEstado, idUsuario, idRemitente, leida, leidaPor, leidaAt)
                VALUES
                ('$tipo', '$mensaje', NOW(), 1, $idUsuario, $idUsuario, 0, NULL, NULL)";

        return $this->enlace->executeSQL_DML($sql);
    }

    // ====================================================
    // Obtener TODAS las notificaciones de un usuario
    // ====================================================
    public function allByUser($idUsuario)
    {
        $sql = "SELECT 
    n.id,
    n.tipo,
    n.mensaje,
    n.fecha,
    n.leida,
    n.leidaPor,
    n.leidaAt,
    r.nombre AS remitente
FROM Notificacion n
LEFT JOIN Usuario r ON r.id = n.idRemitente
WHERE n.idUsuario = $idUsuario
ORDER BY  n.fecha DESC;";

        return $this->enlace->ExecuteSQL($sql);
    }
    

    // ====================================================
    // Ver solo las NO LEÍDAS
    // ====================================================
    public function unreadCount($idUsuario)
    {
        $sql = "SELECT COUNT(*) AS total
                FROM Notificacion
                WHERE idUsuario = $idUsuario AND leida = 0";
        
        return $this->enlace->ExecuteSQL($sql)[0];
    }

    // ====================================================
    // Marcar como leída
    // ====================================================
    public function marcarLeida($idNotificacion, $idUsuarioActual)
    {
        
        $sql = "UPDATE Notificacion 
                SET leida = 1,
                    leidaAt = NOW(),
                    leidaPor = $idUsuarioActual
                WHERE id = $idNotificacion 
                  AND idUsuario = $idUsuarioActual";

        return $this->enlace->executeSQL_DML($sql);
    }

    // ====================================================
    // Obtener una notificación
    // ====================================================
    public function get($id)
    {
        $sql = "SELECT 
                    n.*,
                    r.nombre AS remitente,
                    u.nombre AS destinatario
                FROM Notificacion n
                LEFT JOIN Usuario r ON r.id = n.idRemitente
                LEFT JOIN Usuario u ON u.id = n.idUsuario
                WHERE n.id = $id";

        return  $this->enlace->ExecuteSQL($sql);

    }

    // ====================================================
    // Marcar todas como leídas
    // ====================================================
    public function marcarTodas($idUsuario)
    {
        $sql = "UPDATE Notificacion 
                SET leida = 1,
                    leidaAt = NOW(),
                    leidaPor = $idUsuario
                WHERE idUsuario = $idUsuario 
                  AND leida = 0";

        return $this->enlace->executeSQL_DML($sql);
    }
}
