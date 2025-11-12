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
        // Consulta principal de la categoría
        $vSqlCategoria = "SELECT 
            c.id AS idCategoria,
            c.nombre AS nombreCategoria,
            s.tiempoRespuesta AS tiempoMaxRespuesta,
            s.tiempoResolucion AS tiempoMaxResolucion
        FROM Categoria c
        LEFT JOIN SLA s ON c.idSLA = s.id
        WHERE c.id = $id;";
        $vResultadoCategoria = $this->enlace->ExecuteSQL($vSqlCategoria);
        $categoria = $vResultadoCategoria[0];

        // Obtener especialidades
        $vSqlEsp = "SELECT 
            e.id AS idEspecialidad,
            e.nombre AS nombre
        FROM CategoriaEspecialidad ce
        JOIN Especialidad e ON ce.idEspecialidad = e.id
        WHERE ce.idCategoria = $id;";
        $categoria->especialidades = $this->enlace->ExecuteSQL($vSqlEsp);

        // Obtener etiquetas
        $vSqlEtiq = "SELECT 
            et.id AS idEtiqueta,
            et.nombre AS nombre
        FROM CategoriaEtiqueta cet
        JOIN Etiqueta et ON cet.idEtiqueta = et.id
        WHERE cet.idCategoria = $id;";
        $categoria->etiquetas = $this->enlace->ExecuteSQL($vSqlEtiq);

        return $categoria;
    } catch (Exception $e) {
        handleException($e);
    }
    }
    /*Peliculas de un actor*/
   public function create($objeto)
{
    try {


        // 2️⃣ Insertar la categoría con el id del SLA recién creado
        $sqlCategoria = "INSERT INTO Categoria (nombre, idSLA)
                         VALUES ('$objeto->nombre', $objeto->idSLA)";
        $idCategoria = $this->enlace->executeSQL_DML_last($sqlCategoria);

        // 3️⃣ Insertar las etiquetas relacionadas
        foreach ($objeto->etiquetas as $idEtiqueta) {
            $sql = "INSERT INTO CategoriaEtiqueta (idCategoria, idEtiqueta)
                    VALUES ($idCategoria, $idEtiqueta)";
            $this->enlace->executeSQL_DML($sql);
        }

        // 4️⃣ Insertar las especialidades relacionadas
        foreach ($objeto->especialidades as $idEsp) {
            $sql = "INSERT INTO CategoriaEspecialidad (idCategoria, idEspecialidad)
                    VALUES ($idCategoria, $idEsp)";
            $this->enlace->executeSQL_DML($sql);
        }

        // 5️⃣ Retornar la categoría completa con su SLA
        return $this->get($idCategoria);

    } catch (Exception $e) {
        handleException($e);
    }
}

}
