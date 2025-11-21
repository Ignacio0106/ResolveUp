import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "estadoTicket/";

class EstadoService {
  getAll() {
    return axios.get(BASE_URL);
  }

  getById(id) {
    return axios.get(`${BASE_URL}get/${id}`);
  }
}

export default new EstadoService();
