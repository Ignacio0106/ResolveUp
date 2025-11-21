<?php
class TecnicoModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    public function all(){
        try {
			$vSql = "SELECT t.id AS idTecnico, u.nombre AS nombreUsuario,
            u.correo AS correoUsuario, t.disponibilidad, t.cargaTrabajo,
            GROUP_CONCAT(e.nombre SEPARATOR ', ') AS especialidades
            FROM Tecnicos t
            JOIN Usuario u ON t.idUsuario = u.id
            LEFT JOIN TecnicoEspecialidad te ON t.id = te.idTecnico
            LEFT JOIN Especialidad e ON te.idEspecialidad = e.id
            GROUP BY t.id, u.nombre, u.correo, t.disponibilidad, t.cargaTrabajo;";

			$vResultado = $this->enlace->ExecuteSQL ($vSql);

			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }

    public function listadoDeTecnicos()
    {
        try {
			$vSql = "SELECT t.id, u.nombre AS nombre, u.correo AS correo,
            CONCAT('http://localhost:81/Proyecto/api/tecnico/getTecnicoDetalle/', t.id) AS enlaceAlDetalle
            FROM Tecnicos t
            JOIN Usuario u ON t.idUsuario = u.id;";

			$vResultado = $this->enlace->ExecuteSQL ( $vSql);

			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }
    
    public function get($id)
{
    try {
        $vSql = "SELECT 
            t.id AS idTecnico,
            u.nombre AS nombreUsuario,
            u.correo AS correoUsuario, u.contraseña,
            t.disponibilidad,
            t.cargaTrabajo
        FROM Tecnicos t
        JOIN Usuario u ON t.idUsuario = u.id
        WHERE t.id = $id;";

        $resultado = $this->enlace->ExecuteSQL($vSql);

        if (empty($resultado)) {
            return null;
        }

        $tecnico = $resultado[0];


        $vSqlEsp = "SELECT 
            e.id AS idEspecialidad,
            e.nombre AS nombre
        FROM TecnicoEspecialidad te
        JOIN Especialidad e ON te.idEspecialidad = e.id
        WHERE te.idTecnico = $id;";

        $especialidades = $this->enlace->ExecuteSQL($vSqlEsp) ?? [];

        $tecnico->especialidades = $especialidades;

        return $tecnico;

    } catch (Exception $e) {
        handleException($e);
    }
}

public function createTecnico($objeto)
{
    try {
        $usuarioLogueadoId = 1;

        $sqlRol = "SELECT idRol FROM Usuario WHERE id = $usuarioLogueadoId";
        $resRol = $this->enlace->ExecuteSQL($sqlRol);

        if (!is_array($resRol) || count($resRol) === 0) {
            return [
                "success" => false,
                "status" => 404,
                "message" => "El usuario configurado no existe"
            ];
        }

        $rolLogueado = (int)$resRol[0]->idRol;

        if ($rolLogueado !== 1) {
            return [
                "success" => false,
                "status" => 403,
                "message" => "Solo un administrador puede crear técnicos"
            ];
        }

        $nombre = $objeto->nombre;
        $correo = $objeto->correo;
        $password = $objeto->password;
        $disponibilidad = $objeto->disponibilidad;

        $sql = "INSERT INTO Usuario (nombre, correo, contraseña, idRol)
                VALUES ('$nombre', '$correo', '$password', 2)";
        $idUsuario = $this->enlace->executeSQL_DML_last($sql);

        
        $cargaTrabajo = isset($objeto->cargaTrabajo) ? (int)$objeto->cargaTrabajo : 0;

        $sqlTec = "INSERT INTO Tecnicos (idUsuario, disponibilidad, cargaTrabajo)
                   VALUES ($idUsuario, $disponibilidad, $cargaTrabajo)";
        $idTecnico = $this->enlace->executeSQL_DML_last($sqlTec);

        $especialidadesInvalidas = [];

        foreach ($objeto->especialidades as $esp) {

            if (is_numeric($esp)) {
                $idEsp = (int)$esp;
            } elseif (isset($esp->idEspecialidad)) {
                $idEsp = (int)$esp->idEspecialidad;
            } else {
                continue;
            }

            $sqlVal = "SELECT id FROM Especialidad WHERE id = $idEsp";
            $resVal = $this->enlace->ExecuteSQL($sqlVal);

            if (!is_array($resVal) || count($resVal) === 0) {
                $especialidadesInvalidas[] = $idEsp;
                continue;
            }

            $sqlEsp = "INSERT INTO TecnicoEspecialidad (idTecnico, idEspecialidad)
                       VALUES ($idTecnico, $idEsp)";
            $this->enlace->executeSQL_DML($sqlEsp);
        }

        $mensaje = "Técnico creado correctamente";
        if (!empty($especialidadesInvalidas)) {
            $mensaje .= ". Especialidades inválidas: " . implode(", ", $especialidadesInvalidas);
        }

        return [
            "success" => true,
            "status" => 201,
            "message" => $mensaje,
            "data" => $this->get($idUsuario)
        ];

    } catch (Exception $e) {

        if (str_contains($e->getMessage(), "Duplicate entry")) {
            return [
                "success" => false,
                "status" => 409,
                "message" => "Ese correo ya está registrado"
            ];
        }

        return [
            "success" => false,
            "status" => 500,
            "message" => $e->getMessage()
        ];
    }
}





public function updateTecnico($objeto) {
    try {
        
        $usuarioLogueadoId = 1; // Solo se usa para validar rol
        $sqlRol = "SELECT idRol FROM Usuario WHERE id = $usuarioLogueadoId";
        $resRol = $this->enlace->ExecuteSQL($sqlRol);
        if (!$resRol) {
            throw new Exception("Usuario logueado no existe");
        }
        $rolLogueado = (int)$resRol[0]->idRol;
        if ($rolLogueado !== 1) {
            return [
                "success" => false,
                "status" => 403,
                "message" => "Solo un administrador puede actualizar técnicos"
            ];
        }


        if (!isset($objeto->id)) {
            return [
                "success" => false,
                "status" => 400,
                "message" => "Se requiere el ID del técnico para actualizar"
            ];
        }
        $idTecnico = (int)$objeto->id;


        $camposUsuario = [];
        if (isset($objeto->nombre)) $camposUsuario[] = "nombre = '$objeto->nombre'";
        if (isset($objeto->correo)) $camposUsuario[] = "correo = '$objeto->correo'";
        if (isset($objeto->password)) $camposUsuario[] = "contraseña = '$objeto->password'";

        if (!empty($camposUsuario)) {
            $sqlUsuario = "UPDATE Usuario 
                           SET " . implode(", ", $camposUsuario) . " 
                           WHERE id = (SELECT idUsuario FROM Tecnicos WHERE id = $idTecnico)";
            $this->enlace->executeSQL_DML($sqlUsuario);
        }


        $camposTecnico = [];
        if (isset($objeto->disponibilidad)) $camposTecnico[] = "disponibilidad = " . (int)$objeto->disponibilidad;
        if (isset($objeto->cargaTrabajo)) $camposTecnico[] = "cargaTrabajo = " . (int)$objeto->cargaTrabajo;

        if (!empty($camposTecnico)) {
            $sqlTec = "UPDATE Tecnicos SET " . implode(", ", $camposTecnico) . " WHERE id = $idTecnico";
            $this->enlace->executeSQL_DML($sqlTec);
        }


        $mensajeExtras = "";
        if (isset($objeto->especialidades) && is_array($objeto->especialidades)) {
            $sqlDel = "DELETE FROM TecnicoEspecialidad WHERE idTecnico = $idTecnico";
            $this->enlace->executeSQL_DML($sqlDel);

            $especialidadesInvalidas = [];
            foreach ($objeto->especialidades as $esp) {
                $idEsp = isset($esp->idEspecialidad) ? (int)$esp->idEspecialidad : null;
                if (!$idEsp) continue;

                $sqlVal = "SELECT id FROM Especialidad WHERE id = $idEsp";
                $resVal = $this->enlace->ExecuteSQL($sqlVal);
                if (!$resVal) {
                    $especialidadesInvalidas[] = $idEsp;
                    continue;
                }

                $sqlEsp = "INSERT INTO TecnicoEspecialidad (idTecnico, idEspecialidad)
                           VALUES ($idTecnico, $idEsp)";
                $this->enlace->executeSQL_DML($sqlEsp);
            }

            if (!empty($especialidadesInvalidas)) {
                $mensajeExtras = ". Algunas especialidades no se pudieron asignar: " . implode(", ", $especialidadesInvalidas);
            }
        }

        $mensaje = "Técnico actualizado correctamente" . $mensajeExtras;

        return [
            "success" => true,
            "status" => 200,
            "message" => $mensaje,
            "data" => $this->get($idTecnico)
        ];

    } catch (Exception $e) {
        return [
            "success" => false,
            "status" => 500,
            "message" => $e->getMessage()
        ];
    }
}










}