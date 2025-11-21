<?php
class RolModel {
    
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Obtener todos los roles
    public function all() {
        $sql = "SELECT id, nombre FROM Rol";
          $vResultado = $this->enlace->ExecuteSQL($sql);
           return $vResultado;
    }

    // Obtener un rol por id
    public function get($id) {
        $sql = "SELECT id, nombre FROM Rol WHERE id = $id";
         $vResultado = $this->enlace->ExecuteSQL($sql);
           return $vResultado[0] ?? null;
    }
}

