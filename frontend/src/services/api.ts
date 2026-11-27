import axios from 'axios'

// Fail-closed in production builds: mock mode is active by default ONLY in Vite dev unless explicitly opted in
export const USE_MOCK = import.meta.env.DEV
  ? import.meta.env.VITE_USE_MOCK !== 'false'
  : import.meta.env.VITE_USE_MOCK === 'true'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 8000,
})

// Request Interceptor: Attach Sanctum Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('servio_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('servio_token')
      localStorage.removeItem('servio_user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
