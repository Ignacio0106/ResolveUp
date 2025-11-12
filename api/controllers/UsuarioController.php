<?php
class Usuario
{
    // GET listar todos los usuarios
    public function index()
    {
        try {
            $response = new Response();
            $usuarioM = new UsuarioModel();
            $result = $usuarioM->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    // GET obtener 1 usuario por id
    public function get($id)
    {
        try {
            $response = new Response();
            $usuarioM = new UsuarioModel();
            $result = $usuarioM->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    // POST crear usuario
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();

            $usuarioM = new UsuarioModel();
            $result = $usuarioM->createUsuario($inputJSON);

            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    // PUT actualizar usuario
    
}
