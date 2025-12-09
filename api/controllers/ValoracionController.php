<?php
class valoracion
{
    // http://localhost:81/proyecto/api/usuario/1
    public function get($id)
    {
        try {
            $response = new Response();
            $valoracionM = new ValoracionModel();
            $result = $valoracionM->get($id);
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

            $valoracionM = new ValoracionModel();
            $result = $valoracionM->crearValoracion($inputJSON);

            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
}
