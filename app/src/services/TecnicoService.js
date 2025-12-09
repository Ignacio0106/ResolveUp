import axios from 'axios';
//http://localhost:81/appmovie/api/movie/
const BASE_URL = import.meta.env.VITE_BASE_URL + 'tecnico';
class MovieService {
  //Definición para Llamar al API y obtener el listado de películas

  //Listas peliculas
  //http://localhost:81/appmovie/api/movie
  getTecnicos() {
    return axios.get(BASE_URL + '/listadoDeTecnicos');
  }

    getListado() {
    return axios.get(BASE_URL);
  }
  //Obtener pelicula
  //http://localhost:81/Proyecto/api/tecnico/getTecnicoDetalle/2
  getDetalleTecnico(TecnicoId){
    return axios.get(BASE_URL+'/getTecnicoDetalle/'+ TecnicoId);
  }

  getByCategoria(categoriaId) {
    return axios.get(`${BASE_URL}/getByCategoria/${categoriaId}`);
  }

    createTecncio(userData) {
    return axios.post(BASE_URL, JSON.stringify(userData));
  }

  update(tecnico) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(tecnico)

    })
  }

}
export default new MovieService();
