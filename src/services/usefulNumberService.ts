// src/services/usefulNumberService.ts
import api from './api';

interface UsefulNumber {
  id: number;
  name: string;
  phone_number: string;
  color_tag?: string | null;
  created_at: string;
  updated_at: string;
}

interface UsefulNumberPayload {
  name: string;
  phone_number: string;
  color_tag?: string | null;
}

const usefulNumberService = {
  getAll: async () => {
    const response = await api.get('/useful-numbers');
    return response.data; // { data: UsefulNumber[] }
  },

  getById: async (id: number | string) => {
    const response = await api.get(`/useful-numbers/${id}`);
    return response.data; // { data: UsefulNumber }
  },

  create: async (data: UsefulNumberPayload) => {
    const response = await api.post('/useful-numbers', data);
    return response.data; // { message: string, data: UsefulNumber }
  },

  update: async (id: number | string, data: Partial<UsefulNumberPayload>) => {
    const response = await api.post(`/useful-numbers/${id}`, data); // POST, pas PUT
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(`/useful-numbers/${id}`);
    return response.data; // { message: string }
  },
};

export default usefulNumberService;