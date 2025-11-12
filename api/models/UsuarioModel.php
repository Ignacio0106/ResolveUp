<?php

class UsuarioModel
{
    public $enlace;

    public function __construct()
    {
        // Conexión a la base de datos
        $this->enlace = new MySqlConnect();
    }

    // Obtener todos los usuarios
    public function all()
    {
        $sql = "SELECT * FROM Usuario";
        $resultado = $this->enlace->ExecuteSQL($sql);
        return $resultado;
    }

    // Obtener un usuario por id
    public function get($id)
    {
        $sql = "SELECT * FROM Usuario WHERE id = $id";
        $resultado = $this->enlace->ExecuteSQL($sql);
        return $resultado[0] ?? null;
    }

    // Crear un usuario
public function createUsuario($objeto)
{
    try {
        // Para este ejemplo, asumimos que el usuario logueado es admin
        $usuarioLogueado = 1;

        // Verificar rol del usuario logueado
        $sqlRol = "SELECT idRol FROM Usuario WHERE id = $usuarioLogueado";
        $resultRol = $this->enlace->ExecuteSQL($sqlRol);

        if (!$resultRol) {
            throw new Exception("Usuario logueado no existe");
        }

        $sql = "INSERT INTO Usuario (nombre, correo, contraseña, idRol)
                VALUES ('$objeto->nombre', '$objeto->correo', '$objeto->password', $objeto->idRol)";

        $idUsuario = $this->enlace->executeSQL_DML_last($sql);

        // Acceso como objeto
        $rolLogueado = $resultRol[0]->idRol;

        if ($rolLogueado != 1) {
            return [
                "success" => false,
                "status" => 403,
                "message" => "Solo un administrador puede crear usuarios o técnicos"
            ];
        }

        // Insertar usuario
        $idRol = (int)$objeto->idRol;
        
        

        // Si es técnico (rol id 2)
        if ($idRol === 2) {
            $sqlTec = "INSERT INTO Tecnicos (idUsuario, disponibilidad, cargaTrabajo)
                       VALUES ($idUsuario, 1, 0)";
            $idTecnico = $this->enlace->executeSQL_DML_last($sqlTec);

            foreach ($objeto->especialidades as $value) {
                $idEsp = (int)$value;
                $sqlEsp = "INSERT INTO TecnicoEspecialidad (idTecnico, idEspecialidad)
                           VALUES ($idTecnico, $idEsp)";
                $this->enlace->executeSQL_DML($sqlEsp);
            }
        }

        return $this->get($idUsuario);

    } catch (Exception $e) {
        // Manejo de correo duplicado
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




}
