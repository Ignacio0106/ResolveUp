import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "notificacion/";

class NotificacionService {
  // Obtener notificaciones por usuario
  getByUsuario(idUsuario) {
    return axios.get(`${BASE_URL}allByUser/${idUsuario}`);
  }

  // Obtener contador de notificaciones NO leídas
  getNoLeidasByUsuario(idUsuario) {
    return axios.get(`${BASE_URL}unreadCount/${idUsuario}`);
  }

  // Marcar una notificación como leída
  marcarLeida(idNotificacion, idUsuario) {
    return axios.get(`${BASE_URL}marcarLeida/${idNotificacion}/${idUsuario}`);
  }

  // Marcar todas como leídas
  marcarTodasLeidas(idUsuario) {
    return axios.post(`${BASE_URL}marcarTodas/${idUsuario}`);
  }

  // Crear notificación
  create(data) {
    return axios.post(`${BASE_URL}create/`, data);
  }

  // Obtener una notificación por ID
  getById(id) {
    return axios.get(`${BASE_URL}get/${id}`);
  }
}

export default new NotificacionService();
