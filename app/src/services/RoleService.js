import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "rol";

class RoleService {
  getRoles() {
    return axios.get(BASE_URL);
  }
}

export default new RoleService();
