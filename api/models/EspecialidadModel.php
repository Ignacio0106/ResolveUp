<?php
class EspecialidadesModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Listar todas las especialidades
    public function all()
    {
        try {
            $vSql = "SELECT 
                        e.id, 
                        e.nombre,
                        CONCAT('http://localhost:81/Proyecto/api/especialidades/get/', e.id) AS enlaceAlDetalle
                     FROM Especialidad e
                     ORDER BY e.id DESC;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Obtener una especialidad por id
    public function get($id)
    {
        try {
            $vSql = "SELECT id, nombre
                     FROM Especialidad
                     WHERE id = $id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado ? $vResultado[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getByTecnico($idTecnico)
    {
        try {
            $vSql = "SELECT e.id, e.nombre
                     FROM Especialidad e
                     JOIN tecnicoespecialidad te ON e.id = te.idEspecialidad
                     WHERE te.idTecnico = $idTecnico;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getByCategoria($idCategoria)
    {
            $vSql = "SELECT e.id, e.nombre
                     FROM Especialidad e
                     JOIN CategoriaEspecialidad ce ON e.id = ce.idEspecialidad
                     WHERE ce.idCategoria = $idCategoria;";
            return $this->enlace->ExecuteSQL($vSql);
    }
/*     public function getTecnicoByTicket($id){
        $ticketM = new TicketModel();
        $categoriaS = $ticketM->getById($id)->idCategoria;
        $especialidadM = new EspecialidadesModel();
        $especialidades = $especialidadM->getByCategoria($categoriaS);

        $vSql = "SELECT t.id AS idTecnico, u.nombre AS nombreTecnico, u.correo AS correoTecnico,
            t.disponibilidad, t.cargaTrabajo
            FROM Tecnicos t
            JOIN Usuario u ON t.idUsuario = u.id
            JOIN Tickets ti ON ti.idTecnico = t.id
            WHERE ti.id = {$_GET['idTicket']};";
        $vResultado = $this->enlace->ExecuteSQL ( $vSql);
        return $vResultado ? $vResultado[0] : null;
    } */

    public function getByTicket($idTicket)
    {
        $ticketM = new TicketModel();
        $categoriaS = $ticketM->getById($idTicket)->idCategoria;
        $especialidadM = new EspecialidadesModel();
        $especialidades = $especialidadM->getByCategoria($categoriaS);
        return $especialidades;
    }
    // Crear una nueva especialidad
    public function create($objeto)
    {
        try {
            $nombre = $objeto->nombre;
            $vSql = "INSERT INTO Especialidad (nombre) VALUES ('$nombre')";
            $this->enlace->ExecuteSQL_DML($vSql);
            return ["success" => true, "message" => "Especialidad creada correctamente"];
        } catch (Exception $e) {
            return ["success" => false, "message" => $e->getMessage()];
        }
    }

    // Eliminar una especialidad
    public function delete($id)
    {
        try {
            $vSql = "DELETE FROM Especialidad WHERE id = $id";
            $this->enlace->ExecuteSQL_DML($vSql);
            return ["success" => true, "message" => "Especialidad eliminada correctamente"];
        } catch (Exception $e) {
            return ["success" => false, "message" => $e->getMessage()];
        }
    }
}
