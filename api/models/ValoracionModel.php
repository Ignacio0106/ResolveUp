<?php
class ValoracionModel
{

    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    
    public function crearValoracion($object)
    {
        try {
            $sql = "INSERT INTO Valoracion (idUsuario, idTicket, idPuntaje, comentario, fechaCreacion)
                    VALUES (' $object->idUsuario',' $object->idTicket',' $object->puntuacion',' $object->comentario')";

            $this->enlace->ExecuteSQL($sql);

            return true;
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    //Obtener una imagen de una pelicula
    public function get($id)
    {
        $vSql = "SELECT *
        FROM Valoracion v
        WHERE v.idMovie = $id;";
        $vResultado = $this->enlace->executeSQL($vSql);
        if (!empty($vResultado)) {
            $vResultado = $vResultado[0];
        }

        //Retornar la respuesta
        return $vResultado;
    }
}
