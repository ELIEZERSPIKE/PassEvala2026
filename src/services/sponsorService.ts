import api from '@/api/axios';

export const sponsorService = {
  // Récupère les sponsors actifs (Route publique)
  getPublicSponsors: async () => {
    const response = await api.get('/public/sponsors');
    return response.data.data;
  },

  // Créer un sponsor (Route protégée admin)
  // On utilise FormData pour gérer l'upload de l'image 'banner'
  create: async (formData: FormData) => {
    const response = await api.post('/sponsors', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Note: Ton contrôleur actuel n'a pas encore update/delete
  // Voici comment ils devront être structurés
  update: async (id: number, formData: FormData) => {
    // Laravel nécessite souvent _method=PUT dans un POST pour l'upload de fichiers
    formData.append('_method', 'PUT');
    const response = await api.post(`/sponsors/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/sponsors/${id}`);
    return response.data;
  }
};