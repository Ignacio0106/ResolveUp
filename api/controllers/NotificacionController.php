<?php
class notificacion
{

    public function allByUser($idUsuario)
    {
        try {
            $response = new Response();
            $model = new NotificacionModel();
            $result = $model->allByUser($idUsuario);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // ====================================================
    // Obtener contador de notificaciones NO leídas
    // ====================================================
    public function unreadCount($idUsuario)
    {
        try {
            $response = new Response();
            $model = new NotificacionModel();
            $result = $model->unreadCount($idUsuario);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // ====================================================
    // Obtener una notificación
    // ====================================================
    public function get($id)
    {
        try {
            $response = new Response();
            $model = new NotificacionModel();
            $result = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // ====================================================
    // Crear una nueva notificación
    // ====================================================


    // ====================================================
    // Marcar UNA notificación como leída
    // ====================================================
    public function marcarLeida($idNotificacion, $idUsuario)
    {
        try {
            $response = new Response();
            $model = new NotificacionModel();
            $result = $model->marcarLeida($idNotificacion, $idUsuario);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // ====================================================
    // Marcar TODAS como leídas
    // ====================================================
    public function marcarTodas($idUsuario)
    {
        try {
            $response = new Response();
            $model = new NotificacionModel();
            $result = $model->marcarTodas($idUsuario);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
