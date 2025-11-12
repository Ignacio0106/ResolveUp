<?php
class rol {
    // GET listar todos los roles
    public function index() {
        try {
            $response = new Response();
            $rolModel = new RolModel();
            $roles = $rolModel->all();
            $response->toJSON($roles);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GET rol por ID
    public function get($id) {
        try {
            $response = new Response();
            $rolModel = new RolModel();
            $rol = $rolModel->get($id);
            $response->toJSON($rol);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

