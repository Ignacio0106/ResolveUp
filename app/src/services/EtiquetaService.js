import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "etiquetas/";

class EtiquetasService {
  getAll() {
    return axios.get(BASE_URL);
  }

  getById(id) {
    return axios.get(`${BASE_URL}get/${id}`);
  }

create(data) {
  return axios.post(`${BASE_URL}create`, data);
}


  delete(id) {
    return axios.delete(`${BASE_URL}delete/${id}`);
  }
}

export default new EtiquetasService();
