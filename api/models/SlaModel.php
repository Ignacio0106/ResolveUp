<?php
class SlaModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        $sql = "SELECT * FROM SLA";
        return $this->enlace->executeSQL($sql);
    }

    public function get($id)
    {
        $sql = "SELECT * FROM SLA WHERE idSLA = $id";
        return $this->enlace->executeSQL($sql, true);
    }

    public function create($obj)
    {
        $sql = "INSERT INTO SLA (tiempoRespuesta, tiempoResolucion)
                VALUES ($obj->tiempoRespuesta, $obj->tiempoResolucion)";
        return $this->enlace->executeSQL_DML_last($sql);
    }

    public function update($obj)
    {
        $sql = "UPDATE SLA
                SET tiempoRespuesta = $obj->tiempoRespuesta,
                    tiempoResolucion = $obj->tiempoResolucion
                WHERE idSLA = $obj->idSLA";
        return $this->enlace->executeSQL_DML($sql);
    }

    public function delete($id)
    {
        $sql = "DELETE FROM SLA WHERE idSLA = $id";
        return $this->enlace->executeSQL_DML($sql);
    }
}
