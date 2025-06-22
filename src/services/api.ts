import axios from 'axios';

// 定義 API 回應接口
interface AuthResponse {
  token: string;
  [key: string]: any; // 允許其他屬性
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  } as any,
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.Authorization = `Bearer ${token}`;
};

export const register = async (email: string, password: string, role: string, signupCode: string) => {
  const response = await api.post('/auth/register', { email, password, role, signupCode });
  return response.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    setAuthToken(response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  setAuthToken('');
};

export default api;