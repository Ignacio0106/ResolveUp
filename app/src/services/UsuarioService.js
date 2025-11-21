import axios from 'axios';

// URL base del API de usuarios
const BASE_URL = import.meta.env.VITE_BASE_URL + 'usuario';

class UsuarioService {
  // Listar todos los usuarios
  getUsers() {
    return axios.get(BASE_URL);
  }

  // Obtener usuario por ID
  getUserById(userId) {
    return axios.get(BASE_URL + '/' + userId);
  }

  getByTicket(ticketId) {
    return axios.get(BASE_URL + '/getByTicket/' + ticketId);
  }

  // Crear usuario
  createUser(userData) {
    return axios.post(BASE_URL, JSON.stringify(userData));
  }

  // Actualizar usuario
  updateUser(userData) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(userData)
    });
  }
}

export default new UsuarioService();
