import api from '../../../api/axios';
import { LoginRequest, SignupRequest, AuthResponse } from '../../../types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/logout');
  },

  getCurrentUser: async () => {
    const response = await api.get('/me');
    return response.data;
  },
};