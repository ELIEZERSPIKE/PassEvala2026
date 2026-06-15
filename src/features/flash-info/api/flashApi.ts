import api from '../../../api/axios';
export interface FlashInfo {
  id: number;
  title: string;
  link?: string | null;
  created_at?: string;
  updated_at?: string;
}


// Interface pour la réponse classique sans pagination (comme actuellement dans ton index)
export interface SimpleResponse<T> {
  data: T[];
}

// Paramètres de filtres (Optionnel si tu décides d'ajouter de la pagination ou recherche plus tard)
export interface FlashInfoFiltersParams {
  search?: string;
  page?: number;
  per_page?: number;
}

export const flashInfoApi = {
  // Liste des flash infos (Actuellement non paginée dans ton contrôleur)
  getAll: async (params?: FlashInfoFiltersParams) => {
    // Si ton contrôleur passe à une pagination plus tard, remplace SimpleResponse par PaginatedResponse
    const response = await api.get<SimpleResponse<FlashInfo>>('/flash-infos', { params });
    return response.data;
  },

  // Détail d'un flash info (Méthode show)
  getById: async (id: number) => {
    const response = await api.get<{ data: FlashInfo }>(`/flash-infos/${id}`);
    return response.data;
  },

  // Création (Méthode store - JSON classique car pas de fichiers/images requis)
  create: async (data: { title: string; link?: string | null }) => {
    const response = await api.post<{ message: string; data: FlashInfo }>('/flash-infos', data);
    return response.data;
  },

  // Mise à jour (Méthode update - Un PUT classique fonctionne ici car il n'y a pas de FormData)
  update: async (id: number, data: { title?: string; link?: string | null }) => {
    const response = await api.put<{ message: string; data: FlashInfo }>(`/flash-infos/${id}`, data);
    return response.data;
  },

  // Suppression (Méthode destroy)
  delete: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/flash-infos/${id}`);
    return response.data;
  },
};