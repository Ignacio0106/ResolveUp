import { useContext } from "react";
import { NotificacionContext } from "../context/NotificacionContext";
import NotificacionService from "../services/NotificacionService";

export const useNotificaciones = () => {
    const context = useContext(NotificacionContext);
    if (!context) {
        throw new Error("useNotificaciones debe usarse en un NotificacionProvider");
    }

    const { notificaciones, dispatch, cantidadNoLeidas } = context;


const marcarLeida = (id, usuarioId) => {
  // Actualizamos el estado local inmediatamente
  dispatch({
    type: "SET_NOTIFICACIONES",
    payload: notificaciones.map((n) =>
      n.id === id ? { ...n, leida: 1 } : n
    ),
  });

  // Backend
  NotificacionService.marcarLeida(id, usuarioId).catch((err) => {
    console.error("Error al marcar notificación como leída:", err);
    recargarNotificaciones(usuarioId)
  });
};






    const eliminarNotificacion = (id) => {
        NotificacionService.delete(id);

        dispatch({
            type: "ELIMINAR_NOTIFICACION",
            payload: id
        });
    };

    const recargarNotificaciones = async (idUsuario) => {
       
        const res = await NotificacionService.getByUsuario(idUsuario);
        dispatch({
            type: "SET_NOTIFICACIONES",
            payload: res.data.data
            
            
        });
        
    };
    

   


    return {
        notificaciones,
        cantidadNoLeidas,
        marcarLeida,
        eliminarNotificacion,
        recargarNotificaciones,
    };
};
