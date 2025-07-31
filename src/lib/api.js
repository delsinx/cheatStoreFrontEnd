import axios from 'axios';

// Configurar URL base do backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      console.error('Authentication error:', error.response.data);
    } else if (error.response?.status === 403) {
      // Sem permissão
      console.error('Permission denied:', error.response.data);
    } else {
      console.error('API error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

