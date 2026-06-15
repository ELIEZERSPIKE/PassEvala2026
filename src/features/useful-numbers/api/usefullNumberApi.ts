import api from '../../../api/axios';
import { BonPlan } from '../components/UsefulNumberForm'; 

// Interface générique pour la pagination de Laravel
export interface PaginatedResponse<T> {
  data: {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{ url: string | null; label: string; active: boolean }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

// Paramètres de filtres adaptés aux Bons Plans
export interface BonPlanFiltersParams {
  search?: string;
  category?: string;
  page?: number;
  per_page?: number;
}

export const bonPlanApi = {
  // Liste paginée (ou brute selon la configuration de votre index)
  getAll: async (params?: BonPlanFiltersParams) => {
    // Si votre index retourne une pagination standard ou une simple liste
    const response = await api.get<PaginatedResponse<BonPlan>>('/bon-plans', { params });
    return response.data;
  },

  // Détail d'un bon plan (Méthode show)
  getById: async (id: number) => {
    const response = await api.get<{ data: BonPlan }>(`/bon-plans/${id}`);
    return response.data;
  },

  // Création (Méthode store - Multipart avec FormData)
  create: async (formData: FormData) => {
    const response = await api.post<{ message: string; data: BonPlan }>('/bon-plans', formData);
    return response.data;
  },

  // Mise à jour (Méthode update - Multipart simulé en PUT via _method inclus dans le FormData)
  update: async (id: number, formData: FormData) => {
    const response = await api.post<{ message: string; data: BonPlan }>(`/bon-plans/${id}`, formData);
    return response.data;
  },

  // Suppression (Méthode destroy)
  delete: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/bon-plans/${id}`);
    return response.data;
  },
};