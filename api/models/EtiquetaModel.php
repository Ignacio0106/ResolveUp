<?php
class EtiquetasModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT 
                        id, 
                        nombre,
                        CONCAT('http://localhost:81/Proyecto/api/etiquetas/get/', id) AS enlaceAlDetalle
                     FROM Etiqueta
                     ORDER BY id DESC;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $vSql = "SELECT id, nombre FROM Etiqueta WHERE id = $id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado ? $vResultado[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create($objeto)
    {
        try {
            $nombre = $objeto->nombre;
            $vSql = "INSERT INTO Etiqueta (nombre) VALUES ('$nombre')";
            $this->enlace->ExecuteSQL_DML($vSql);
            return ["success" => true, "message" => "Etiqueta creada correctamente"];
        } catch (Exception $e) {
            return ["success" => false, "message" => $e->getMessage()];
        }
    }

    public function delete($id)
    {
        try {
            $vSql = "DELETE FROM Etiqueta WHERE id = $id";
            $this->enlace->ExecuteSQL_DML($vSql);
            return ["success" => true, "message" => "Etiqueta eliminada correctamente"];
        } catch (Exception $e) {
            return ["success" => false, "message" => $e->getMessage()];
        }
    }
}
