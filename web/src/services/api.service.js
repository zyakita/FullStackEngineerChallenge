import axios from 'axios';
import apiHeader from './api-header';

class ApiService {
  get(path) {
    return axios.get(process.env.REACT_APP_API_SERVER + path, {
      headers: apiHeader(),
    });
  }
  post(path, data) {
    return axios.post(process.env.REACT_APP_API_SERVER + path, data, {
      headers: apiHeader(),
    });
  }
  put(path, data) {
    return axios.put(process.env.REACT_APP_API_SERVER + path, data, {
      headers: apiHeader(),
    });
  }
  delete(path) {
    return axios.delete(process.env.REACT_APP_API_SERVER + path, {
      headers: apiHeader(),
    });
  }
}

export default new ApiService();
