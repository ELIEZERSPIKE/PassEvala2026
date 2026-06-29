// services/commentService.ts
import api from '@/api/axios';

export const commentService = {
  getComments: async (articleId: number) => {
    const response = await api.get(`/articles/${articleId}/comments`);
    if (response.data?.data) return response.data.data;
    if (Array.isArray(response.data)) return response.data;
    return [];
  },

  create: async (articleId: number, content: string, parentId?: number) => {
    const response = await api.post(`/articles/${articleId}/comments`, {
      content,
      parent_id: parentId || null,
    });
    return response.data?.data ?? response.data;
  },

  update: async (commentId: number, content: string) => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data?.data ?? response.data;
  },

  delete: async (commentId: number) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  report: async (commentId: number) => {
    const response = await api.post(`/comments/${commentId}/report`);
    return response.data;
  },
};