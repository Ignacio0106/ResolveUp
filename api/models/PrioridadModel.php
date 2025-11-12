<?php
class PrioridadModel
{

    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    //Obtener una imagen de una pelicula
    public function getPrioridad($idPrioridad)
    {
        //Consulta sql
        $vSql = "SELECT * FROM PrioridadTicket where id=$idPrioridad";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        if (!empty($vResultado)) {
            // Retornar el objeto
            return $vResultado[0];
        }
        return $vResultado;
    }
}
