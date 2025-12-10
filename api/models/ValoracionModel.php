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
        $sql = "INSERT INTO Valoracion (idUsuario, idTicket, idPuntaje, comentario, fecha)
                VALUES ('$object->idUsuario', '$object->idTicket', '$object->idPuntaje', '$object->comentario', NOW())";
        return $this->enlace->executeSQL_DML_last($sql);
    }




public function getPuntajes()
    {
        try {
            $sql = "SELECT id, descripcion FROM PuntajeValoracion ORDER BY id ASC";
            $resultado = $this->enlace->ExecuteSQL($sql);
            return $resultado;
        } catch (Exception $e) {
            handleException($e);
            return [];
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
