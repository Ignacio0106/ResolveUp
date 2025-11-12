// src/services/CategoriaService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'categoria';

class CategoriaService {

  getCategorias() {
    return axios.get(BASE_URL);
  }

  getDetalleCategoria(categoriaId) {
    return axios.get(`${BASE_URL}/${categoriaId}`);
  }

  create(payload) {
    return axios.post(BASE_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export default new CategoriaService();
