import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Personnel APIs
export const personnelAPI = {
  getAll: () => apiClient.get('/personnel'),
  getById: (id) => apiClient.get(`/personnel/${id}`),
  create: (data) => apiClient.post('/personnel', data),
  update: (id, data) => apiClient.put(`/personnel/${id}`, data),
  delete: (id) => apiClient.delete(`/personnel/${id}`),
  search: (params) => apiClient.get('/personnel/search', { params }),
  addSkill: (id, skillData) => apiClient.post(`/personnel/${id}/skills`, skillData)
};

// Skills APIs
export const skillsAPI = {
  getAll: () => apiClient.get('/skills'),
  getById: (id) => apiClient.get(`/skills/${id}`),
  create: (data) => apiClient.post('/skills', data),
  update: (id, data) => apiClient.put(`/skills/${id}`, data),
  delete: (id) => apiClient.delete(`/skills/${id}`),
  getByCategory: (category) => apiClient.get(`/skills/category/${category}`)
};

// Projects APIs
export const projectsAPI = {
  getAll: () => apiClient.get('/projects'),
  getById: (id) => apiClient.get(`/projects/${id}`),
  create: (data) => apiClient.post('/projects', data),
  update: (id, data) => apiClient.put(`/projects/${id}`, data),
  delete: (id) => apiClient.delete(`/projects/${id}`),
  addRequiredSkill: (id, skillData) => apiClient.post(`/projects/${id}/skills`, skillData)
};

// Allocations APIs
export const allocationsAPI = {
  getAll: () => apiClient.get('/allocations'),
  create: (data) => apiClient.post('/allocations', data),
  update: (id, data) => apiClient.put(`/allocations/${id}`, data),
  delete: (id) => apiClient.delete(`/allocations/${id}`),
  getByPersonnel: (personnelId) => apiClient.get(`/allocations/personnel/${personnelId}`),
  getByProject: (projectId) => apiClient.get(`/allocations/project/${projectId}`)
};

// Analytics APIs
export const analyticsAPI = {
  getPersonnelGrowth: (params) => apiClient.get('/analytics/personnel-growth', { params }),
  getUtilization: () => apiClient.get('/analytics/utilization')
};

// Matching API
export const matchingAPI = {
  findMatches: (projectId, sortBy = 'bestFit') => 
    apiClient.get(`/match/project/${projectId}`, { params: { sortBy } })
};

export default apiClient;