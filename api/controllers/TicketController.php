<?php
class ticket
{
    // GET listar
    // localhost:81/appejemplo/api/movie
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $movieM = new TicketModel;
            //Método del modelo
            $result = $movieM->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    public function DetalleTicket()
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $movie = new TicketModel();
            //Acción del modelo a ejecutar
            $result = $movie->getTicketDetalle();
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
            $movie = new TicketModel();
            //Acción del modelo a ejecutar
            $result = $movie->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    public function listadoDetalle()
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $movie = new TicketModel();
            //Acción del modelo a ejecutar
            $result = $movie->listadoDetalle();
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
            $ticket = new TicketModel();
            //Metodo del modelo
            $result =$ticket->create($inputJSON);
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
            $ticket = new TicketModel();
            //Metodo del modelo
            $result =$ticket->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
}
