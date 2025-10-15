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
}
