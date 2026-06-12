import api from '@/api/axios';

export interface BonPlan {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  image_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface BonPlanPayload {
  title: string;
  description?: string | null;
  category?: string | null;
  image_path?: string | null;
}

export const bonPlanService = {
  // Récupère tous les bons plans (orderBy created_at desc)
  getAll: async () => {
    const response = await api.get('/bon-plans');
    return response.data.data;
  },

  // Récupère un bon plan par ID
  getOne: async (id: number) => {
    const response = await api.get(`/bon-plans/${id}`);
    return response.data.data;
  },

  // Crée un bon plan (route protégée - canPublish)
  create: async (payload: BonPlanPayload) => {
    const response = await api.post('/bon-plans', payload);
    return response.data;
  },

  // Met à jour un bon plan (route protégée - canPublish)
  update: async (id: number, payload: Partial<BonPlanPayload>) => {
    const response = await api.put(`/bon-plans/${id}`, payload);
    return response.data;
  },

  // Supprime un bon plan (route protégée - canPublish)
  delete: async (id: number) => {
    const response = await api.delete(`/bon-plans/${id}`);
    return response.data;
  },
};