<?php
class TecnicoModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /*Listar */
    public function all(){
        try {
            //Consulta sql
			$vSql = "SELECT t.id AS idTecnico, u.nombre AS nombreUsuario,
            u.correo AS correoUsuario, t.disponibilidad, t.cargaTrabajo,
            GROUP_CONCAT(e.nombre SEPARATOR ', ') AS especialidades
            FROM Tecnicos t
            JOIN Usuario u ON t.idUsuario = u.id
            LEFT JOIN TecnicoEspecialidad te ON t.id = te.idTecnico
            LEFT JOIN Especialidad e ON te.idEspecialidad = e.id
            GROUP BY t.id, u.nombre, u.correo, t.disponibilidad, t.cargaTrabajo;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ($vSql);
			// Retornar el objeto
			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }

    public function listadoDeTecnicos()
    {
        try {
            //Consulta sql
			$vSql = "SELECT t.id, u.nombre AS nombre, u.correo AS correo,
            CONCAT('http://localhost:81/Proyecto/api/tecnico/getTecnicoDetalle/', t.id) AS enlaceAlDetalle
            FROM Tecnicos t
            JOIN Usuario u ON t.idUsuario = u.id;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }
    



    /*Obtener */
    public function get($id)
    {
        try {
            //Consulta sql
			$vSql = "SELECT 
            t.id AS idTecnico,
            u.nombre AS nombreUsuario,
            u.correo AS correoUsuario,
            t.disponibilidad,
            t.cargaTrabajo,
            GROUP_CONCAT(e.nombre SEPARATOR ', ') AS especialidades
         FROM Tecnicos t
         JOIN Usuario u ON t.idUsuario = u.id
         LEFT JOIN TecnicoEspecialidad te ON t.id = te.idTecnico
         LEFT JOIN Especialidad e ON te.idEspecialidad = e.id
         WHERE t.id = $id
         GROUP BY 
            t.id, u.nombre, u.correo, t.disponibilidad, t.cargaTrabajo;";
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
			return $vResultado[0];
		} catch (Exception $e) {
            handleException($e);
        }
    }


    /*Obtener los actores de una pelicula */
    public function getActorMovie($idMovie)
    {
        try {
            //Consulta SQL
            $vSQL = "SELECT g.id, g.fname, g.lname, mg.role".
            " FROM actor g, movie_cast mg".
            " where g.id=mg.actor_id and mg.movie_id=$idMovie;";            
            //Ejecutar la consulta
            $vResultado = $this->enlace->executeSQL($vSQL);
            //Retornar el resultado
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    /*Obtener información de un actor específico, incluyendo las películas en las que participa y los roles */
    public function getActorMovies($id){
        $movieM= new MovieModel();
        //Consulta SQL
        $vSQL = "Select * From actor where id=$id";
        //Ejecutar la consulta
        $vResultado= $this->enlace->ExecuteSQL($vSQL);
        if(!empty($vResultado)){
            $vResultado = $vResultado[0];
            $vResultado->movies=$movieM->moviesByActor($id);
        }
        //Retornar resultado
        return $vResultado;
    }
    
}
