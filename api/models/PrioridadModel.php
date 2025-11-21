<?php
class PrioridadModel {
    
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Obtener todos los roles
    public function all() {
        $sql = "SELECT * FROM prioridadticket";
          $vResultado = $this->enlace->ExecuteSQL($sql);
           return $vResultado;
    }

    // Obtener un rol por id
    public function get($id) {
        $sql = "SELECT * FROM prioridadticket WHERE id = $id";
         $vResultado = $this->enlace->ExecuteSQL($sql);
           return $vResultado;
    }
}

