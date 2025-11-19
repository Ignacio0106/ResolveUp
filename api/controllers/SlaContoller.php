<?php
class sla
{
    public function index()
    {
        try {
            $response = new Response();
            $slaM = new SlaModel();
            $result = $slaM->all();
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
             $movie = new SlaModel();
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
