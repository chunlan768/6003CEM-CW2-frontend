import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // 確保與後端端口一致
  withCredentials: true,
});

export default api;