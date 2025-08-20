import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Content-Type'] = 'application/json';
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  changePassword: (currentPassword, newPassword) => 
    api.post('/auth/change-password', { currentPassword, newPassword }),
}

export const usersAPI = {
  getAll: (filters = {}) => api.get('/users', { params: filters }),
  create: (userData) => api.post('/users', userData),
  getProfile: () => api.get('/users/profile'),
  getStats: () => api.get('/users/dashboard/stats'),
  update: (id, userData) => api.put(`/users/${id}`, userData), 
  delete: (id) => api.delete(`/users/${id}`), 
};

export const storesAPI = {
  getAll: (filters = {}) => api.get('/stores', { params: filters }),
  search: (query) => api.get('/stores/search', { params: { q: query } }),
  create: (storeData) => api.post('/stores', storeData),
  getById: (id) => api.get(`/stores/${id}`),
  getOwnerDashboard: () => api.get('/stores/owner/dashboard'),
  getStats: () => api.get('/stores/stats'), 
};

export const ratingsAPI = {
  submit: (ratingData) => api.post('/ratings', ratingData),
  getUserRating: (storeId) => api.get(`/ratings/user/${storeId}`),
  getStoreRatings: (storeId) => api.get(`/ratings/store/${storeId}`),
  getStats: () => api.get('/ratings/stats'), 
};

export default api