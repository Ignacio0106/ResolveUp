<?php
class AsignacionModel
{
    //Conectarse a la BD
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /**
     * Listar peliculas
     * @param 
     * @return $vResultado - Lista de objetos
     */
    public function all()
    {
        //Consulta SQL
        $vSQL = "SELECT a.*
        FROM asignacion a
        ORDER BY a.id DESC;";
        
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSQL);

        //Retornar la respuesta
        return $vResultado;
    }
    /**
     * Obtener una pelicula
     * @param $id de la pelicula
     * @return $vresultado - Objeto pelicula
     */
    //
    public function get($id)
    {
        try {
        // Consulta principal de la categoría
        $vSqlCategoria = "SELECT *
        FROM asignacion a
        WHERE a.id = $id;";
        $vResultadoCategoria = $this->enlace->ExecuteSQL($vSqlCategoria);
        $asignacion = $vResultadoCategoria[0];

        return $asignacion;
    } catch (Exception $e) {
        handleException($e);
    }
    }
    /*Asignaciones de un tecnico*/
    public function getByTecnico($id)
    {
        //Consulta SQL
        $vSQL = "SELECT a.id, a.fecha, ti.id AS idTicket, c.nombre AS categoria, et.nombre AS estado, tiempoRestanteResolucion FROM asignacion a
inner join tecnicos t ON t.id = a.idTecnico
inner join usuario u ON u.id = t.idUsuario
inner join tickets ti ON ti.id = a.idTicket
inner join estadoticket et ON et.id = ti.estadoId
inner join categoria c ON c.id = ti.idCategoria
where a.idTecnico=$id";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSQL);
        //Retornar resultado
        return $vResultado;
    }

    /*Crear pelicula*/
    public function create($objeto)
    {
        $sql = "INSERT into movie(title, year, time, lang, director_id)" .
            " VALUES ('$objeto->title', '$objeto->year', '$objeto->time', '$objeto->lang', $objeto->director_id)";

        $idMovie = $this->enlace->executeSQL_DML_last(($sql)); //Hagarrar el id del insert de la pelicula creada
        //---Generos---
        //Crear los generos para asociarlos a la pelicula
        foreach ($objeto->genres as $item) {
            $sql = "insert into movie_genre(movie_id, genre_id) values($idMovie, $item)";
            $vResultadoGenres = $this->enlace->executeSQL_DML($sql);
        }
        //---Actores---
        foreach ($objeto->actors as $item) {
            $sql = "insert into movie_cast(movie_id, actor_id, role) values($idMovie, $item->actor_id,'$item->role')";
            $vResultadoGenres = $this->enlace->executeSQL_DML($sql);
        }
        //---Retornar pelicula creada---
        return $this->get($idMovie);
    }
}
