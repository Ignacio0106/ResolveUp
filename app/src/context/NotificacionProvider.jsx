import { useReducer, useEffect, useState } from "react";
import { NotificacionContext } from "./NotificacionContext";
import NotificacionService from "../services/NotificacionService";

const initialState = [];

function notificacionReducer(state, action) {
    switch (action.type) {

        case "SET_NOTIFICACIONES": {
            return action.payload;
        }

        case "MARCAR_LEIDA": {
            return state.map(notif =>
                notif.id === action.payload
                    ? { ...notif, leida: 1 }
                    : notif
            );
        }

        case "ELIMINAR_NOTIFICACION": {
            return state.filter(notif => notif.id !== action.payload);
        }

        default:
            return state;
    }
}

export function NotificacionProvider({ children }) {
    const [notificaciones, dispatch] = useReducer(notificacionReducer, initialState);
    const [user] = useState(JSON.parse(localStorage.getItem("user")));

    useEffect(() => {
        if (!user) return;
        NotificacionService.getByUsuario(user.idUsuario).then(res => {
            dispatch({
                type: "SET_NOTIFICACIONES",
                payload: res.data.data
            });
        });
    }, [user]);

    // OPCIONAL — refrescar cada 20s
    useEffect(() => {
        if (!user) return;
        const interval = setInterval(() => {
            NotificacionService.getByUsuario(user.idUsuario).then(res => {
                dispatch({
                    type: "SET_NOTIFICACIONES",
                    payload: res.data.data
                });
            });
        }, 20000);

        return () => clearInterval(interval);
    }, [user]);

    const cantidadNoLeidas = notificaciones.filter(n => n.leida == 0).length;

    return (
        <NotificacionContext.Provider value={{ 
            notificaciones, 
            dispatch,
            cantidadNoLeidas
        }}>
            {children}
        </NotificacionContext.Provider>
    );
}