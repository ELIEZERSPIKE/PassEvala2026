// shortService.ts
import api from '../../../api/axios';
import { Short, ShortComment, ShortPayload, ShortUpdatePayload } from '../types/short';

const shortService = {

  getPublicShorts: async (): Promise<{ data: Short[] }> => {
    try {
      const response = await api.get('/public/shorts');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur API getPublicShorts:', error);
      throw error;
    }
  },

  getPublicShort: async (id: number | string): Promise<{ data: Short }> => {
    const response = await api.get(`/public/shorts/${id}`);
    return response.data;
  },

  create: async (data: ShortPayload): Promise<{ status: string; message: string; data: Short }> => {
    const formData = new FormData();
    if (data.text) formData.append('text', data.text);
    if (data.video instanceof File) formData.append('video', data.video, data.video.name);
    const response = await api.post('/shorts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getMyShorts: async (): Promise<{ data: Short[] }> => {
    const response = await api.get('/my-shorts');
    return response.data;
  },

  updateUserShort: async (id: number | string, data: ShortUpdatePayload): Promise<{ status: string; message: string; data: Short }> => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    if (data.text !== undefined) formData.append('text', data.text || '');
    if (data.video instanceof File) formData.append('video', data.video, data.video.name);
    const response = await api.post(`/shorts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteUserShort: async (id: number | string): Promise<{ status: string; message: string }> => {
    const response = await api.delete(`/shorts/${id}`);
    return response.data;
  },

  getAll: async (): Promise<{ data: Short[] }> => {
    const response = await api.get('/admin/shorts');
    return response.data;
  },

  update: async (id: number | string, data: ShortUpdatePayload): Promise<{ status: string; message: string; data: Short }> => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    if (data.text !== undefined) formData.append('text', data.text || '');
    if (data.status) formData.append('status', data.status);
    if (data.video instanceof File) formData.append('video', data.video, data.video.name);
    const response = await api.post(`/admin/shorts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number | string): Promise<{ status: string; message: string }> => {
    const response = await api.delete(`/admin/shorts/${id}`);
    return response.data;
  },

  // ✅ Toggle like (1 par personne, auth requise)
  like: async (id: number | string): Promise<{ status: string; liked: boolean; likes_count: number }> => {
    const response = await api.post(`/shorts/${id}/like`);
    return response.data;
  },

  // ✅ Savoir si l'user a déjà liké ce short
  likeStatus: async (id: number | string): Promise<{ liked: boolean; likes_count: number }> => {
    const response = await api.get(`/shorts/${id}/like-status`);
    return response.data;
  },

  // ✅ Réactions emoji
  react: async (id: number | string, emoji: string): Promise<{ status: string; reactions: Record<string, number> }> => {
    const response = await api.post(`/shorts/${id}/react`, { emoji });
    return response.data;
  },

  // ✅ Commentaires
  getComments: async (id: number | string): Promise<{ data: ShortComment[] }> => {
    const response = await api.get(`/shorts/${id}/comments`);
    return response.data;
  },

  addComment: async (id: number | string, body: string): Promise<{ status: string; message: string; data: ShortComment }> => {
    const response = await api.post(`/shorts/${id}/comments`, { body });
    return response.data;
  },

deleteComment: async (commentId: number | string) => {
  const response = await api.delete(`/shorts/comments/${commentId}`);
  return response.data;
},
};

export default shortService;