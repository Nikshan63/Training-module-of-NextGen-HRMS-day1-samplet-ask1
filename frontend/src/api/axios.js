import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 — redirect to login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  login:    data => api.post('/auth/login', data),
  register: data => api.post('/auth/register', data),
}

// ── Projects ──────────────────────────────────────────────────
export const projectsAPI = {
  getAll:    ()         => api.get('/projects'),
  getById:   id         => api.get(`/projects/${id}`),
  create:    data       => api.post('/projects', data),
  update:    (id, data) => api.put(`/projects/${id}`, data),
  delete:    id         => api.delete(`/projects/${id}`),
}

// ── Tasks ─────────────────────────────────────────────────────
export const tasksAPI = {
  getByProject: projectId       => api.get(`/projects/${projectId}/tasks`),
  create:       (projectId, d)  => api.post(`/projects/${projectId}/tasks`, d),
  update:       (projectId, id, d) => api.put(`/projects/${projectId}/tasks/${id}`, d),
  delete:       (projectId, id) => api.delete(`/projects/${projectId}/tasks/${id}`),
  updateStatus: (projectId, id, status) =>
    api.patch(`/projects/${projectId}/tasks/${id}/status`, { status }),
}

// ── Members ───────────────────────────────────────────────────
export const membersAPI = {
  getByProject: projectId       => api.get(`/projects/${projectId}/members`),
  add:          (projectId, d)  => api.post(`/projects/${projectId}/members`, d),
  updateRole:   (projectId, userId, role) =>
    api.patch(`/projects/${projectId}/members/${userId}`, { role }),
  remove:       (projectId, userId) =>
    api.delete(`/projects/${projectId}/members/${userId}`),
}

// ── Config ────────────────────────────────────────────────────
export const configAPI = {
  get:    projectId       => api.get(`/projects/${projectId}/config`),
  update: (projectId, d)  => api.put(`/projects/${projectId}/config`, d),
}

export default api
