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
        $tecnicoM = new TecnicoModel();
        $metodoM = new MetodoModel();
        $reglaM = new ReglaModel();
        $ticketM = new TicketModel();

        $vSql = "SELECT *
        FROM asignacion a
        WHERE a.id = $id;";
        $vResultado = $this->enlace->executeSQL($vSql);
        if (!empty($vResultado)) {
            $vResultado = $vResultado[0];
            $vResultado->tecnico = $tecnicoM->get(($vResultado->idTecnico));

            $vResultado->metodo = $metodoM->get(($vResultado->idMetodo));

            //$vResultado->regla = $reglaM->get(($vResultado->idRegla));

            $vResultado->ticket = $ticketM->get(($vResultado->idTicket));
        }

        //Retornar la respuesta
        return $vResultado;
    }
    /*Asignaciones de un tecnico*/
    public function getByUsuario($id)
    {
        $usuario = new UsuarioModel();

        if($usuario->get($id)){
            if($usuario->get($id)->rol->id == 1){
            //Consulta SQL
            $vSQL = "SELECT a.id, a.fecha, ti.id AS idTicket, c.nombre AS categoria, et.nombre AS estado, tiempoRestanteResolucion, puntajePrioridad, pt.nombre AS prioridad FROM asignacion a
                inner join tecnicos t ON t.id = a.idTecnico
                inner join usuario u ON u.id = t.idUsuario
                inner join tickets ti ON ti.id = a.idTicket
                inner join estadoticket et ON et.id = ti.estadoId
                inner join categoria c ON c.id = ti.idCategoria
                inner join prioridadticket pt ON ti.prioridadId = pt.id";

            } else if($usuario->get($id)->idRol==2){
            //Consulta SQL
            $vSQL = "SELECT a.id, a.fecha, ti.id AS idTicket, c.nombre AS categoria, et.nombre AS estado, tiempoRestanteResolucion, puntajePrioridad, pt.nombre AS prioridad FROM asignacion a
                inner join tecnicos t ON t.id = a.idTecnico
                inner join usuario u ON u.id = t.idUsuario
                inner join tickets ti ON ti.id = a.idTicket
                inner join estadoticket et ON et.id = ti.estadoId
                inner join categoria c ON c.id = ti.idCategoria
                inner join prioridadticket pt ON ti.prioridadId = pt.id
                where u.id = $id";
            }
        }
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
