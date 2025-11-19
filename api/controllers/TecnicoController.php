<?php
class tecnico
{
    // GET listar
    // localhost:81/appejemplo/api/actor
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $actorM = new TecnicoModel;
            //Método del modelo
            $result = $actorM->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    //GET Obtener 
    // localhost:81/appejemplo/api/actor/1
    public function listadoDeTecnicos()
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $actor = new TecnicoModel();
            //Acción del modelo a ejecutar
            $result = $actor->listadoDeTecnicos();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

     //GET Obtener 
    // localhost:81/appejemplo/api/actor/getActor/1
    public function getTecnicoDetalle($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $actor = new TecnicoModel();
            //Acción del modelo a ejecutar
            $result = $actor->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
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
             $movie = new TecnicoModel();
             //Metodo del modelo
             $result =$movie->createTecnico($inputJSON);
             //Dar respuesta
             $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    public function update(){
        try {
             $response = new Response();
             $request= new Request();
             //Obtener JSON  de la solicitud
             $inputJSON=$request->getJSON();
             //Instancua de modelo
             $movie = new TecnicoModel();
             //Metodo del modelo
             $result =$movie->updateTecnico($inputJSON);
             //Dar respuesta
             $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
}
