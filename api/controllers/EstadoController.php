<?php
class estadoTicket {
    // GET listar todos los roles
    public function index() {
        try {
            $response = new Response();
            $estadoModel = new EstadoModel();
            $estados = $estadoModel->all();
            $response->toJSON($estados);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GET rol por ID
    public function get($id) {
        try {
            $response = new Response();
            $estadoModel = new EstadoModel();
            $estado = $estadoModel->get($id);
            $response->toJSON($estado);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

