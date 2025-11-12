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

    public function create()
    {
        try {
            $data = json_decode(file_get_contents("php://input"));
            $slaM = new SlaModel();
            $id = $slaM->create($data);

            $response = new Response();
            $response->toJSON(["idSLA" => $id]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
