// src/services/AsignacionService.js
import axios from "axios";


// URL base del API
const BASE_URL = import.meta.env.VITE_BASE_URL + 'asignacion';

class AsignacionService {
  // Listar todas las asignaciones
  // GET: /asignacion/DetalleAsignaciones
  getAsignaciones() {
    return axios.get(BASE_URL);
  }

  // Obtener detalle de una asignación por ID
  // GET: /asignacion/{id}
  getDetalleAsignacion(IdAsignacion) {
    return axios.get(`${BASE_URL}/${IdAsignacion}`);
  }

  // Listar todas las asignaciones
  // GET: /asignacion/DetalleAsignaciones
  getAsignacionesByUsuario(IdUsuario) {
    return axios.get(`${BASE_URL}/asignacionByUsuario/${IdUsuario}`) || [];
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

export default new AsignacionService();
