import api from '@/api/axios';

export const likeService = {
  // ✅ Toggle like - Utilise la réponse du backend
  toggle: async (articleId: number) => {
    const response = await api.post(`/articles/${articleId}/like`);
    // ✅ Le backend retourne directement { is_liked, likes_count }
    return response.data;
  },

  // ✅ Vérifier le statut
  checkStatus: async (articleId: number) => {
    const response = await api.get(`/articles/${articleId}/like-status`);
    return response.data;
  },

  // ✅ Récupérer tous les likes d'un article
  getLikes: async (articleId: number) => {
    const response = await api.get(`/articles/${articleId}/likes`);
    return response.data;
  },

  // ✅ Récupérer mes articles likés
  getMyLikes: async () => {
    const response = await api.get('/my-likes');
    return response.data;
  },
};