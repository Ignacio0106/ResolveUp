<?php
class asignacion
{
    // GET listar
    // localhost:81/appejemplo/api/movie
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $asignacionM = new AsignacionModel();
            //Método del modelo
            $result = $asignacionM->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    //GET Obtener 
    // localhost:81/appejemplo/api/movie/1
    public function get($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $asignacionM = new AsignacionModel();
            //Acción del modelo a ejecutar
            $result = $asignacionM->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    //GET Obtener
        public function asignacionByTecnico($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $asignacionM = new AsignacionModel();
            //Acción del modelo a ejecutar
            $result = $asignacionM->getByTecnico($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    // public function create(){
    //     try {
    //          $response = new Response();
    //          $request= new Request();
    //          //Obtener JSON  de la solicitud
    //          $inputJSON=$request->getJSON();
    //          //Instancua de modelo
    //          $movie = new CategoriaModel();
    //          //Metodo del modelo
    //          $result =$movie->create($inputJSON);
    //          //Dar respuesta
    //          $response->toJSON($result);
    //     } catch (Exception $e) {
    //         $response->toJSON($result);
    //         handleException($e);
    //     }
    // }
    
}
