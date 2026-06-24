// shortService.ts
import api from '../../../api/axios';
import { Short, ShortPayload, ShortUpdatePayload } from '../types/short';

const shortService = {
  // ✅ Public - Voir tous les shorts publiés (style TikTok)
  getPublicShorts: async (): Promise<{ data: Short[] }> => {
    const response = await api.get('/public/shorts');
    return response.data;
  },

  getPublicShort: async (id: number | string): Promise<{ data: Short }> => {
    const response = await api.get(`/public/shorts/${id}`);
    return response.data;
  },

  // ✅ Utilisateur connecté - Publier un short
  create: async (data: ShortPayload): Promise<{ status: string; message: string; data: Short }> => {
    const formData = new FormData();
    if (data.text) formData.append('text', data.text);
    if (data.video instanceof File) {
      formData.append('video', data.video, data.video.name);
    }

    const response = await api.post('/shorts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ✅ Utilisateur connecté - Voir ses propres shorts
  getMyShorts: async (): Promise<{ data: Short[] }> => {
    const response = await api.get('/my-shorts');
    return response.data;
  },

  // ✅ Utilisateur connecté - Modifier son short
  updateUserShort: async (id: number | string, data: ShortUpdatePayload): Promise<{ status: string; message: string; data: Short }> => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    
    if (data.text !== undefined) {
      formData.append('text', data.text || '');
    }
    
    if (data.video instanceof File) {
      formData.append('video', data.video, data.video.name);
    }

    const response = await api.post(`/shorts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ✅ Utilisateur connecté - Supprimer son short
  deleteUserShort: async (id: number | string): Promise<{ status: string; message: string }> => {
    const response = await api.delete(`/shorts/${id}`);
    return response.data;
  },

  // ✅ Admin - Voir tous les shorts
  getAll: async (): Promise<{ data: Short[] }> => {
    const response = await api.get('/admin/shorts');
    return response.data;
  },

  // ✅ Admin - Modifier n'importe quel short
  update: async (id: number | string, data: ShortUpdatePayload): Promise<{ status: string; message: string; data: Short }> => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    
    if (data.text !== undefined) {
      formData.append('text', data.text || '');
    }
    
    if (data.status) {
      formData.append('status', data.status);
    }
    
    if (data.video instanceof File) {
      formData.append('video', data.video, data.video.name);
    }

    const response = await api.post(`/admin/shorts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ✅ Admin - Supprimer n'importe quel short
  delete: async (id: number | string): Promise<{ status: string; message: string }> => {
    const response = await api.delete(`/admin/shorts/${id}`);
    return response.data;
  },
};

export default shortService;














// import api from '../../../api/axios';
// import { Short, ShortPayload, ShortUpdatePayload } from '../types/short';

// interface AxiosError {
//   response?: {
//     data?: {
//       errors?: Record<string, string>;
//       message?: string;
//     };
//     status?: number;
//   };
//   message?: string;
// }

// const shortService = {
//   getAll: async (): Promise<{ data: Short[] }> => {
//     try {
//       const response = await api.get('/shorts');
//       return response.data;
//     } catch (error) {
//       const err = error as AxiosError;
//       console.error('❌ Erreur récupération shorts:', err.message);
//       throw error;
//     }
//   },

//   getById: async (id: number | string): Promise<{ data: Short }> => {
//     try {
//       const response = await api.get(`/shorts/${id}`);
//       return response.data;
//     } catch (error) {
//       const err = error as AxiosError;
//       console.error(`❌ Erreur récupération short ${id}:`, err.message);
//       throw error;
//     }
//   },

//   create: async (data: ShortPayload): Promise<{ status: string; message: string; data: Short }> => {
//     try {
//       const formData = new FormData();
      
//       if (data.text) {
//         formData.append('text', data.text);
//       }
      
//       if (!data.video) {
//         throw new Error('Aucune vidéo sélectionnée');
//       }
      
//       if (!(data.video instanceof File)) {
//         throw new Error('Le fichier vidéo est invalide');
//       }

//       // ✅ Ajouter des logs pour voir le type MIME exact
//       console.log('📹 Détails du fichier:', {
//         name: data.video.name,
//         size: `${(data.video.size / (1024 * 1024)).toFixed(2)} Mo`,
//         type: data.video.type || 'non défini',
//         extension: data.video.name.split('.').pop()?.toLowerCase(),
//       });

//       // ✅ Ajouter la vidéo avec son nom
//       formData.append('video', data.video, data.video.name);

//       console.log('📤 Envoi du formulaire...');

//       const response = await api.post('/shorts', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       console.log('✅ Réponse du serveur:', response.data);
//       return response.data;
      
//     } catch (error) {
//       const err = error as AxiosError;
      
//       console.error('❌ Erreur lors de la création du short:');
      
//       if (err.response) {
//         console.error('📡 Statut:', err.response.status);
//         console.error('📄 Données:', err.response.data);
        
//         if (err.response.status === 422 && err.response.data?.errors) {
//           console.error('🔍 Erreurs de validation:', err.response.data.errors);
//           // Afficher la première erreur de validation
//           const firstError = Object.values(err.response.data.errors)[0];
//           if (Array.isArray(firstError) && firstError.length > 0) {
//             console.error('💡 Message:', firstError[0]);
//           }
//         }
//       } else if (err.message) {
//         console.error('💥 Erreur:', err.message);
//       }
      
//       throw error;
//     }
//   },

//   update: async (id: number | string, data: ShortUpdatePayload): Promise<{ status: string; message: string; data: Short }> => {
//     try {
//       const formData = new FormData();
//       formData.append('_method', 'PUT');

//       if (data.text !== undefined) {
//         formData.append('text', data.text || '');
//       }
      
//       if (data.status) {
//         formData.append('status', data.status);
//       }

//       if (data.video instanceof File) {
//         formData.append('video', data.video, data.video.name);
//         console.log('🔄 Nouvelle vidéo ajoutée:', data.video.name);
//       }

//       console.log('📝 Mise à jour du short:', {
//         id,
//         text: data.text,
//         status: data.status,
//         hasVideo: !!data.video
//       });

//       const response = await api.post(`/shorts/${id}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       console.log('✅ Réponse de mise à jour:', response.data);
//       return response.data;
      
//     } catch (error) {
//       const err = error as AxiosError;
      
//       console.error(`❌ Erreur mise à jour short ${id}:`);
      
//       if (err.response) {
//         console.error('📡 Statut:', err.response.status);
//         console.error('📄 Données:', err.response.data);
        
//         if (err.response.status === 422 && err.response.data?.errors) {
//           console.error('🔍 Erreurs de validation:', err.response.data.errors);
//         }
//       } else if (err.message) {
//         console.error('💥 Erreur:', err.message);
//       }
      
//       throw error;
//     }
//   },

//   delete: async (id: number | string): Promise<{ status: string; message: string }> => {
//     try {
//       console.log(`🗑️ Suppression du short ${id}`);
//       const response = await api.delete(`/shorts/${id}`);
//       console.log('✅ Suppression réussie');
//       return response.data;
//     } catch (error) {
//       const err = error as AxiosError;
//       console.error(`❌ Erreur suppression short ${id}:`, err.message);
      
//       if (err.response) {
//         console.error('📡 Statut:', err.response.status);
//         console.error('📄 Données:', err.response.data);
//       }
      
//       throw error;
//     }
//   },
// };

// export default shortService;


