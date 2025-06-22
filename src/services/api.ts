import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.Authorization;
    localStorage.removeItem('token');
  }
};

// 初始化時設置 Token
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

export default api;