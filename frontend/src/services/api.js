import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' }
});

// Response interceptor for error handling
api.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.error || err.message || 'Request failed';
    return Promise.reject(new Error(msg));
  }
);

export const analyzeText = (text) =>
  api.post('/analyze/text', { text });

export const analyzeUrl = (url) =>
  api.post('/analyze/url', { url });

export const analyzePage = (data) =>
  api.post('/analyze/page', data);

export const analyzeScreenshot = (file) => {
  const formData = new FormData();
  formData.append('screenshot', file);
  return api.post('/analyze/screenshot', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const sendChat = (message, sessionId, analysisContext) =>
  api.post('/chat', { message, sessionId, analysisContext });

export const ragSearch = (categories, text) =>
  api.post('/rag/search', { categories, text });

export const getHistory = (params) =>
  api.get('/analysis/history', { params });

export const getAnalysis = (id) =>
  api.get(`/analysis/${id}`);

export const deleteAnalysis = (id) =>
  api.delete(`/analysis/${id}`);

export const getDashboardStats = () =>
  api.get('/dashboard/statistics');

export const getAdminStats = () =>
  api.get('/dashboard/admin');

export const healthCheck = () =>
  api.get('/health');
