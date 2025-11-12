<?php
class etiquetas
{
    public function index()
    {
        try {
            $model = new EtiquetasModel();
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
            $model = new EtiquetasModel();
            $result = $model->get($id);
            $response = new Response();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        try {
            $data = json_decode(file_get_contents("php://input"));
            $model = new EtiquetasModel();
            $result = $model->create($data);
            $response = new Response();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $model = new EtiquetasModel();
            $result = $model->delete($id);
            $response = new Response();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
