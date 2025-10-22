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
}

export default new TicketService();
