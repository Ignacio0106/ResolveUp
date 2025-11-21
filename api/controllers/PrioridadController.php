<?php
class prioridadTicket {
    // GET listar todos los roles
    public function index() {
        try {
            $response = new Response();
            $prioridadModel = new PrioridadModel();
            $prioridades = $prioridadModel->all();
            $response->toJSON($prioridades);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GET rol por ID
    public function get($id) {
        try {
            $response = new Response();
            $prioridadModel = new PrioridadModel();
            $prioridad = $prioridadModel->get($id);
            $response->toJSON($prioridad);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

