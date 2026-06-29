// features/auth/services/authService.ts
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

  getCurrentUser: async (): Promise<{ data: User }> => {
    const response = await api.get('/me');
    return response.data;
  },

  // ✅ Upload avatar
  updateAvatar: async (file: File): Promise<{ message: string; avatar_url: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};