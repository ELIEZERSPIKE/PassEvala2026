// src/services/flashInfoService.ts
import api from './api';

interface FlashInfoData {
  title: string;
  link?: string | null;
}

const flashInfoService = {
  getAll: async () => {
    const response = await api.get('/flash-infos');
    return response.data;
  },
  getById: async (id: number | string) => {
    const response = await api.get(`/flash-infos/${id}`);
    return response.data;
  },
  create: async (data: FlashInfoData) => {
    const response = await api.post('/flash-infos', data);
    return response.data;
  },
  update: async (id: number | string, data: Partial<FlashInfoData>) => {
    const response = await api.put(`/flash-infos/${id}`, data);
    return response.data;
  },
  delete: async (id: number | string) => {
    const response = await api.delete(`/flash-infos/${id}`);
    return response.data;
  }
};

export default flashInfoService;