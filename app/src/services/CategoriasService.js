// src/services/CategoriaService.js
import axios from 'axios';

// URL base del API
const BASE_URL = import.meta.env.VITE_BASE_URL + 'categoria';

class CategoriaService {
  // Listar todas las categorías
  // GET: /categoria/DetalleCategorias
  getCategorias() {
    return axios.get(BASE_URL);
  }

  // Obtener detalle de una categoría por ID
  // GET: /categoria/{id}
  getDetalleCategoria(categoriaId) {
    return axios.get(`${BASE_URL}/${categoriaId}`);
  }

  // Si más adelante quieres crear, actualizar o eliminar, puedes descomentar y usar:
  
  // Crear categoría
  // createCategoria(categoria) {
  //   return axios.post(BASE_URL, JSON.stringify(categoria));
  // }

  // Actualizar categoría
  // updateCategoria(categoria) {
  //   return axios.put(BASE_URL, JSON.stringify(categoria));
  // }

  // Eliminar categoría
  // deleteCategoria(categoriaId) {
  //   return axios.delete(`${BASE_URL}/${categoriaId}`);
  // }
}

export default new CategoriaService();
