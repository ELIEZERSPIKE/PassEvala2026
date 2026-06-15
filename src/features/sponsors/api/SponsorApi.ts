import api from '../../../api/axios';
import { Sponsor } from '../components/SponsorForm'; // On va exporter le type proprement

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

export interface SponsorFiltersParams {
  search?: string;
  is_active?: boolean | string;
  page?: number;
  per_page?: number;
}

export const sponsorApi = {
  // Liste paginée pour l'admin
  getAll: async (params?: SponsorFiltersParams) => {
    const response = await api.get<PaginatedResponse<Sponsor>>('/sponsors', { params });
    return response.data;
  },

  // Liste simplifiée pour la sidebar publique
  getSidebar: async () => {
    const response = await api.get<{ data: Sponsor[] }>('/sponsors/sidebar');
    return response.data;
  },

  // Détail d'un sponsor
  getById: async (id: number) => {
    const response = await api.get<{ data: Sponsor }>(`/sponsors/${id}`);
    return response.data;
  },

  // Création (Multipart avec FormData)
  create: async (formData: FormData) => {
    const response = await api.post<{ message: string; data: Sponsor }>('/sponsors', formData);
    return response.data;
  },

  // Mise à jour (Multipart simulé en PUT via _method)
  // update: async (id: number, formData: FormData) => {
  //   const response = await api.post<{ message: string; data: Sponsor }>(`/sponsors/${id}`, formData);
  //   return response.data;
  // },

  update: async (id: number, formData: FormData) => {
  formData.append('_method', 'PUT');

  const response = await api.post(
    `/sponsors/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
},
  // Suppression
  delete: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/sponsors/${id}`);
    return response.data;
  },

  // Switch de statut actif/inactif
  toggleActive: async (id: number) => {
    const response = await api.patch<{ message: string; is_active: boolean }>(`/sponsors/${id}/toggle`);
    return response.data;
  },
};