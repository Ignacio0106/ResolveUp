<?php
class CategoriaModel
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
        $vSQL = "SELECT t.id, t.nombre,
        CONCAT('http://localhost:81/Proyecto/api/categoria/get/', t.id) AS enlaceAlDetalle
        FROM categoria t
        ORDER BY t.id DESC;";
        
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
    public function DetalleCategorias()
    {
        try {
            //Consulta sql
			$vSql = "SELECT 
                    c.id AS idCategoria,
                    c.nombre AS nombreCategoria,
                    s.tiempoRespuesta AS tiempoMaxRespuesta,
                    s.tiempoResolucion AS tiempoMaxResolucion,
                    GROUP_CONCAT(DISTINCT e.nombre SEPARATOR ', ') AS especialidades,
                    GROUP_CONCAT(DISTINCT et.nombre SEPARATOR ', ') AS etiquetas
                 FROM Categoria c
                 LEFT JOIN SLA s ON c.idSLA = s.id
                 LEFT JOIN CategoriaEspecialidad ce ON c.id = ce.idCategoria
                 LEFT JOIN Especialidad e ON ce.idEspecialidad = e.id
                 LEFT JOIN CategoriaEtiqueta cet ON c.id = cet.idCategoria
                 LEFT JOIN Etiqueta et ON cet.idEtiqueta = et.id
                 GROUP BY c.id, c.nombre, s.tiempoRespuesta, s.tiempoResolucion;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            //Consulta sql
			$vSql = "SELECT 
                    c.id AS idCategoria,
                    c.nombre AS nombreCategoria,
                    s.tiempoRespuesta AS tiempoMaxRespuesta,
                    s.tiempoResolucion AS tiempoMaxResolucion,
                    GROUP_CONCAT(DISTINCT e.nombre SEPARATOR ', ') AS especialidades,
                    GROUP_CONCAT(DISTINCT et.nombre SEPARATOR ', ') AS etiquetas
                 FROM Categoria c
                 LEFT JOIN SLA s ON c.idSLA = s.id
                 LEFT JOIN CategoriaEspecialidad ce ON c.id = ce.idCategoria
                 LEFT JOIN Especialidad e ON ce.idEspecialidad = e.id
                 LEFT JOIN CategoriaEtiqueta cet ON c.id = cet.idCategoria
                 LEFT JOIN Etiqueta et ON cet.idEtiqueta = et.id
                 WHERE c.id = $id
                 GROUP BY c.id, c.nombre, s.tiempoRespuesta, s.tiempoResolucion;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
			return $vResultado[0];
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /*Peliculas de un actor*/
    public function moviesByActor($id)
    {
        //Consulta SQL
        $vSQL = "SELECT m.*, mc.role
                From movie m, movie_cast mc, actor a
                where a.id=mc.actor_id and m.id=mc.movie_id
                and mc.actor_id=$id";
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
