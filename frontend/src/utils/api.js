import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Auto attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle token expiry globally
API.interceptors.response.use(
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

// Auth
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const getMe = () => API.get('/auth/me')

// Quiz
export const getQuestions = (category) =>
  API.get(`/quiz/questions${category ? `?category=${category}` : ''}`)
export const submitScore = (data) => API.post('/quiz/submit', data)
export const getScores = () => API.get('/quiz/scores')
export const getStats = () => API.get('/quiz/stats')

// Notes
export const getNotes = () => API.get('/notes')
export const createNote = (data) => API.post('/notes', data)
export const updateNote = (id, data) => API.put(`/notes/${id}`, data)
export const deleteNote = (id) => API.delete(`/notes/${id}`)

export default API