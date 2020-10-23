import ApiService from './api.service';

class AuthService {
  login(email, password) {
    return ApiService.post('api/auth/signin', { email, password }).then(
      (response) => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      }
    );
  }

  logout() {
    localStorage.removeItem('user');
  }
}

export default new AuthService();
