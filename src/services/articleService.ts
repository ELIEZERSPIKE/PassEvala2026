import api from '@/api/axios';

export const articleService = {
  getAll: async () => {
    const response = await api.get('/articles');
    return response.data.data;
  },
  getById: async (id: string | number) => {
    const response = await api.get(`/articles/${id}`);
    return response.data.data;
  },
  create: async (formData: FormData) => {
    const response = await api.post('/articles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  update: async (id: number | string, formData: FormData) => {
    // Laravel nécessite souvent _method: PUT pour le multipart/form-data en POST
    formData.append('_method', 'PUT');
    const response = await api.post(`/articles/${id}`, formData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  }
};