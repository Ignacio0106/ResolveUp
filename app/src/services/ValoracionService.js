import axios from 'axios';

// URL base del API de usuarios
const BASE_URL = import.meta.env.VITE_BASE_URL + 'valoracion';

class ValoracionService {

  getValoracionById(valoracionId) {
    return axios.get(BASE_URL + '/' + valoracionId);
  }

  getPuntajes() {
    return axios.get(BASE_URL + '/getPuntajes');
  }
  // Crear usuario
  createValoracion(valoracionData) {
    return axios.post(BASE_URL, JSON.stringify(valoracionData));
  }
}

export default new ValoracionService();
