import api from '../../../api/axios';
import { Short, ShortPayload, ShortUpdatePayload } from '../types/short';

const shortService = {
  getAll: async (): Promise<{ data: Short[] }> => {
    const response = await api.get('/shorts');
    return response.data;
  },

  getById: async (id: number | string): Promise<{ data: Short }> => {
    const response = await api.get(`/shorts/${id}`);
    return response.data;
  },

  // FormData obligatoire car upload vidéo
  create: async (data: ShortPayload): Promise<{ status: string; message: string; data: Short }> => {
    const formData = new FormData();
    if (data.text) formData.append('text', data.text);
    formData.append('video', data.video);

    const response = await api.post('/shorts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

 update: async (id: number | string, data: ShortUpdatePayload): Promise<{ status: string; message: string; data: Short }> => {
  const formData = new FormData();
  formData.append('_method', 'PUT'); // Laravel method spoofing

  if (data.text !== undefined) formData.append('text', data.text ?? '');
  if (data.status) formData.append('status', data.status);
  if (data.video) formData.append('video', data.video);

  const response = await api.post(`/shorts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
},
  delete: async (id: number | string): Promise<{ status: string; message: string }> => {
    const response = await api.delete(`/shorts/${id}`);
    return response.data;
  },
};

export default shortService; 