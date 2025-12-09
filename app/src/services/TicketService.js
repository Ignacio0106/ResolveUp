// src/services/TicketService.js
import axios from 'axios';

// URL base del API
const BASE_URL = import.meta.env.VITE_BASE_URL + 'ticket';

class TicketService {
  // Listado detallado de tickets
  // GET: /ticket/listadoDetalle
  getListadoDetalle() {
    return axios.get(`${BASE_URL}/listadoDetalle`);
  }

  // Obtener detalle de un ticket por ID
  // GET: /ticket/get/{id}
  getTicketById(ticketId) {
    return axios.get(`${BASE_URL}/get/${ticketId}`);
  }

  getTicketsByUsuario(idUsuario) {
    return axios.get(`${BASE_URL}/getTicketsByUsuario/${idUsuario}`);
  }
  
getTicketPendiente() {
    return axios.get(`${BASE_URL}/getTicketPendiente`);
  }
    getTicket(ticketId) {
    return axios.get(`${BASE_URL}/getById/${ticketId}`);
  }

  // Crear un nuevo ticket
  // POST: /ticket/create
  createTicket(ticketData) {
    return axios.post(BASE_URL, JSON.stringify(ticketData));
  }
  // Actualizar un ticket existente
  // PUT: /ticket/update/{id}
  updateTicket(ticketData) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(ticketData)
    });
  }

  asignarManual(data) {
    return axios.post(`${BASE_URL}/asignarManual`, JSON.stringify(data));
  }
}

export default new TicketService();
