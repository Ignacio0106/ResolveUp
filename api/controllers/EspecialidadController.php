<?php
class especialidades
{
    public function index()
    {
        try {
            $model = new EspecialidadesModel();
            $result = $model->all();
            $response = new Response();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $model = new EspecialidadesModel();
            $result = $model->get($id);
            $response = new Response();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getByCategoria($idCategoria)
    {
        try {
            $model = new EspecialidadesModel();
            $result = $model->getByCategoria($idCategoria);
            $response = new Response();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create(){
        try {
             $response = new Response();
             $request= new Request();
             //Obtener JSON  de la solicitud
             $inputJSON=$request->getJSON();
             //Instancua de modelo
             $movie = new EspecialidadesModel();
             //Metodo del modelo
             $result =$movie->create($inputJSON);
             //Dar respuesta
             $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    
}
