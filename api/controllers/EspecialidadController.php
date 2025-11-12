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

    
}
