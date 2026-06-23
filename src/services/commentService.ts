// services/commentService.ts
import api from '@/api/axios';

export const commentService = {
  getComments: async (articleId: number) => {
    try {
      const response = await api.get(`/articles/${articleId}/comments`);
      console.log('📡 commentService.getComments - Réponse brute:', response);
      
      // ✅ Gère les deux formats possibles
      if (response.data && response.data.data) {
        // Format: { data: [...] }
        console.log('✅ Format avec data.data:', response.data.data);
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        // Format: directement un tableau
        console.log('✅ Format tableau direct:', response.data);
        return response.data;
      } else {
        console.warn('⚠️ Format de réponse inattendu:', response.data);
        return [];
      }
    } catch (error) {
      console.error('❌ Erreur getComments:', error);
      throw error;
    }
  },

  create: async (articleId: number, content: string, parentId?: number) => {
    try {
      const response = await api.post(`/articles/${articleId}/comments`, {
        content,
        parent_id: parentId || null,
      });
      console.log('📡 commentService.create - Réponse:', response.data);
      
      // ✅ Gère les deux formats de retour
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('❌ Erreur create comment:', error);
      throw error;
    }
  },

  update: async (commentId: number, content: string) => {
    try {
      const response = await api.put(`/comments/${commentId}`, { content });
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('❌ Erreur update comment:', error);
      throw error;
    }
  },

  delete: async (commentId: number) => {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur delete comment:', error);
      throw error;
    }
  },

  report: async (commentId: number) => {
    try {
      const response = await api.post(`/comments/${commentId}/report`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur report comment:', error);
      throw error;
    }
  },
};






// // services/commentService.ts
// import api from '@/api/axios';

// export const commentService = {
//   getComments: async (articleId: number) => {
//     const response = await api.get(`/articles/${articleId}/comments`);
//     return response.data.data || [];
//   },

//   create: async (articleId: number, content: string, parentId?: number) => {
//     const response = await api.post(`/articles/${articleId}/comments`, {
//       content,
//       parent_id: parentId || null,
//     });
//     return response.data;
//   },

//   update: async (commentId: number, content: string) => {
//     const response = await api.put(`/comments/${commentId}`, { content });
//     return response.data;
//   },

//   delete: async (commentId: number) => {
//     const response = await api.delete(`/comments/${commentId}`);
//     return response.data;
//   },

//   report: async (commentId: number) => {
//     const response = await api.post(`/comments/${commentId}/report`);
//     return response.data;
//   },
// };