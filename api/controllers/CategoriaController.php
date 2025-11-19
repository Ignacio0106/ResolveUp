<?php
class categoria
{
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $movieM = new CategoriaModel;
            //Método del modelo
            $result = $movieM->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    public function DetalleCategorias()
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $movie = new CategoriaModel();
            //Acción del modelo a ejecutar
            $result = $movie->DetalleCategorias();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $movie = new CategoriaModel();
            //Acción del modelo a ejecutar
            $result = $movie->get($id);
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
             $movie = new CategoriaModel();
             //Metodo del modelo
             $result =$movie->create($inputJSON);
             //Dar respuesta
             $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
    
public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $movie = new CategoriaModel();
            //Acción del modelo a ejecutar
            $result = $movie->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }


    
}
