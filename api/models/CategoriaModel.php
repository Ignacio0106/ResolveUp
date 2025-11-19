<?php
class CategoriaModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {

        $vSQL = "SELECT t.id, t.nombre,
        CONCAT('http://localhost:81/Proyecto/api/categoria/get/', t.id) AS enlaceAlDetalle
        FROM categoria t
        ORDER BY t.id DESC;";
        

        $vResultado = $this->enlace->ExecuteSQL($vSQL);


        return $vResultado;
    }

    public function DetalleCategorias()
    {
        try {
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

			$vResultado = $this->enlace->ExecuteSQL ( $vSql);

			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
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


        $vSqlEsp = "SELECT 
            e.id AS idEspecialidad,
            e.nombre AS nombre
        FROM CategoriaEspecialidad ce
        JOIN Especialidad e ON ce.idEspecialidad = e.id
        WHERE ce.idCategoria = $id;";
        $categoria->especialidades = $this->enlace->ExecuteSQL($vSqlEsp);


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

   public function create($objeto)
{
    try {



        $sqlCategoria = "INSERT INTO Categoria (nombre, idSLA)
                         VALUES ('$objeto->nombre', $objeto->idSLA)";
        $idCategoria = $this->enlace->executeSQL_DML_last($sqlCategoria);


        foreach ($objeto->etiquetas as $idEtiqueta) {
            $sql = "INSERT INTO CategoriaEtiqueta (idCategoria, idEtiqueta)
                    VALUES ($idCategoria, $idEtiqueta)";
            $this->enlace->executeSQL_DML($sql);
        }


        foreach ($objeto->especialidades as $idEsp) {
            $sql = "INSERT INTO CategoriaEspecialidad (idCategoria, idEspecialidad)
                    VALUES ($idCategoria, $idEsp)";
            $this->enlace->executeSQL_DML($sql);
        }


        return $this->get($idCategoria);

    } catch (Exception $e) {
        handleException($e);
    }
}

public function update($objeto)
{

    $sql = "UPDATE Categoria SET nombre='$objeto->nombre', idSLA=$objeto->idSLA WHERE id=$objeto->id";
    $cResults = $this->enlace->executeSQL_DML($sql);


    $sql = "DELETE FROM CategoriaEtiqueta WHERE idCategoria=$objeto->id";
    $vResultadoD = $this->enlace->executeSQL_DML($sql);

    foreach ($objeto->etiquetas as $idEtiqueta) {
        $sql = "INSERT INTO CategoriaEtiqueta(idCategoria, idEtiqueta) VALUES($objeto->id, $idEtiqueta)";
        $vResultadoE = $this->enlace->executeSQL_DML($sql);
    }


    $sql = "DELETE FROM CategoriaEspecialidad WHERE idCategoria=$objeto->id";
    $vResultadoD = $this->enlace->executeSQL_DML($sql);


    foreach ($objeto->especialidades as $idEsp) {
        $sql = "INSERT INTO CategoriaEspecialidad(idCategoria, idEspecialidad) VALUES($objeto->id, $idEsp)";
        $vResultadoS = $this->enlace->executeSQL_DML($sql);
    }

    return $this->get($objeto->id);
}


}
