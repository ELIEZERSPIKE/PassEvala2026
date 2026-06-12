import api from '@/api/axios';

export const sponsorService = {
  // 1. AJOUT : Récupère TOUS les sponsors (Route Admin - gérée par index())
  // Permet de voir les actifs, les masqués, et gère la recherche/pagination
  getAllSponsors: async (params?: { search?: string; is_active?: boolean; per_page?: number }) => {
    const response = await api.get('/sponsors', { params });
    // Vu que ton contrôleur utilise SponsorResource, les données sont dans response.data.data
    return response.data; 
  },

  // Récupère uniquement les sponsors actifs (Route publique pour la sidebar)
  getPublicSponsors: async () => {
    const response = await api.get('/public/sponsors');
    return response.data.data;
  },

  // Créer un sponsor (Route protégée admin)
  create: async (formData: FormData) => {
    const response = await api.post('/sponsors', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Mettre à jour un sponsor (Route protégée admin)
  update: async (id: number, formData: FormData) => {
    // Astuce cruciale pour Laravel + Upload de fichier en modification
    formData.append('_method', 'PUT');
    const response = await api.post(`/sponsors/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Supprimer un sponsor
  delete: async (id: number) => {
    const response = await api.delete(`/sponsors/${id}`);
    return response.data;
  },

  // BONUS : Aligné avec ta méthode toggleActive de ton contrôleur Laravel
  toggleActive: async (id: number) => {
    const response = await api.patch(`/sponsors/${id}/toggle-active`);
    return response.data;
  }
};