import api from '../../../api/axios';
import { UsefulNumber, UsefulNumberPayload } from '../types/usefulNumber';

const usefulNumberService = {
  getAll: async (): Promise<{ data: UsefulNumber[] }> => {
    const response = await api.get('/useful-numbers');
    return response.data;
  },

  getById: async (id: number | string): Promise<{ data: UsefulNumber }> => {
    const response = await api.get(`/useful-numbers/${id}`);
    return response.data;
  },

  create: async (data: UsefulNumberPayload): Promise<{ message: string; data: UsefulNumber }> => {
    const response = await api.post('/useful-numbers', data);
    return response.data;
  },

  update: async (id: number | string, data: Partial<UsefulNumberPayload>): Promise<{ message: string; data: UsefulNumber }> => {
    const response = await api.post(`/useful-numbers/${id}`, data);
    return response.data;
  },

  delete: async (id: number | string): Promise<{ message: string }> => {
    const response = await api.delete(`/useful-numbers/${id}`);
    return response.data;
  },
};

export default usefulNumberService;