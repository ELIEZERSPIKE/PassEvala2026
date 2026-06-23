import api from '../../../api/axios';
import { UsefulNumber, UsefulNumberPayload } from '../types/usefulNumber';

export interface UsefulNumberFiltersParams {
  search?: string;
  page?: number;
  per_page?: number;
}

export const usefulNumberApi = {
  // Récupérer la liste des numéros utiles
  getAll: async (params?: UsefulNumberFiltersParams) => {
    const response = await api.get<{ data: UsefulNumber[] }>('/useful-numbers', { params });
    return response.data;
  },

  // Récupérer un numéro utile par son ID
  getById: async (id: number | string) => {
    const response = await api.get<{ data: UsefulNumber }>(`/useful-numbers/${id}`);
    return response.data;
  },

  // Créer un numéro utile
  create: async (data: UsefulNumberPayload) => {
    const response = await api.post<{ message: string; data: UsefulNumber }>('/useful-numbers', data);
    return response.data;
  },

  // Mettre à jour un numéro utile
  update: async (id: number | string, data: Partial<UsefulNumberPayload>) => {
    const response = await api.post<{ message: string; data: UsefulNumber }>(`/useful-numbers/${id}`, data);
    return response.data;
  },

  // Supprimer un numéro utile
  delete: async (id: number | string) => {
    const response = await api.delete<{ message: string }>(`/useful-numbers/${id}`);
    return response.data;
  },
};