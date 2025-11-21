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

  getDetalleCategoriaa(id) {
    return axios.get(`${BASE_URL}/get/${id}`);
  }

    getCategoriaByEtiqueta(etiquetaId) {
    return axios.get(`${BASE_URL}/CategoriasByEtiqueta/${etiquetaId}`);
  }
  
  create(payload) {
    return axios.post(BASE_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

updateCategoria(Movie) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(Movie)

    })
  }
}

export default new CategoriaService();
