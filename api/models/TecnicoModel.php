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
        // 1️⃣ Datos básicos del técnico
        $vSql = "SELECT 
            t.id AS idTecnico,
            u.nombre AS nombreUsuario,
            u.correo AS correoUsuario,
            t.disponibilidad,
            t.cargaTrabajo
        FROM Tecnicos t
        JOIN Usuario u ON t.idUsuario = u.id
        WHERE t.id = $id;";

        $resultado = $this->enlace->ExecuteSQL($vSql);

        if (empty($resultado)) {
            return null;
        }

        $tecnico = $resultado[0]; // esto es un objeto stdClass

        // 2️⃣ Especialidades
        $vSqlEsp = "SELECT 
            e.id AS idEspecialidad,
            e.nombre AS nombre
        FROM TecnicoEspecialidad te
        JOIN Especialidad e ON te.idEspecialidad = e.id
        WHERE te.idTecnico = $id;";

        $especialidades = $this->enlace->ExecuteSQL($vSqlEsp) ?? [];

        // 3️⃣ Asignar como propiedad del objeto
        $tecnico->especialidades = $especialidades;

        return $tecnico;

    } catch (Exception $e) {
        handleException($e);
    }
}

public function create($objeto)
{
    $sql = "INSERT INTO Usuario (nombre, correo, contraseña, idRol) " .
           "VALUES ('$objeto->nombre', '$objeto->correo', '$objeto->password', 2)";

    // Obtener id del usuario recién insertado
    $idUsuario = $this->enlace->executeSQL_DML_last($sql);

    $sql = "INSERT INTO Tecnicos (idUsuario, disponibilidad, cargaTrabajo) " .
           "VALUES ($idUsuario, $objeto->estado, 0)";

    // Obtener id del técnico
    $idTecnico = $this->enlace->executeSQL_DML_last($sql);

    // ======================================
    // 3. Insertar ESPECIALIDADES (varias)
    // Igual a "genres" en tu ejemplo de movie
    // ======================================

    foreach ($objeto->especialidades as $idEsp) {
        $sql = "INSERT INTO TecnicoEspecialidad (idTecnico, idEspecialidad) " .
               "VALUES ($idTecnico, $idEsp)";
        $this->enlace->executeSQL_DML($sql);
    }

    // ======================================
    // RETORNAR el técnico recién creado
    // Idéntico a tu ejemplo de movie
    // ======================================
    return $this->get($idTecnico);
}

}