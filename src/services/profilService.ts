
// services/profilService.ts
import api from './api';

// ========== TYPES ==========
export interface UserProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  avatar_url?: string;
  created_at: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}

export interface Short {
  id: number;
  user_id: number;
  text: string | null;
  status: 'draft' | 'published' | 'archived';
  raw_path: string | null;
  processed_path: string | null;
  thumbnail_path: string | null;
  duration: number | null;
  likes_count: number;
  comments_count: number;
  views_count?: number;
  reactions: Record<string, number> | null;
  is_liked?: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    username: string;
  };
}

export interface ShortLike {
  id: number;
  short_id: number;
  user_id: number;
  short?: Short;
  user?: UserProfile;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  count?: number;
  message?: string;
  success?: boolean;
}

// Pour renvoyer les articles likes
export interface LikedArticle {
  id: number;
  title: string;
  slug: string;
  image?: string;           // image_path depuis Laravel
  summary?: string;         
  created_at: string;
  likes_count: number;
  comments_count: number;
}

// ==================== RESPONSES ====================
export interface ApiResponse<T> {
  data: T;
  count?: number;
  message?: string;
  success?: boolean;
}

// ========== SERVICE ==========
export const profileService = {
  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  
  getMe: async (): Promise<UserProfile> => {
  const res = await api.get('/me');
  return res.data.data; // Assurez-vous que la réponse de l'API est bien dans le format attendu { data: {...} }
},

  /**
   * Mettre à jour le profil de l'utilisateur
   */
  updateProfile: async (payload: UpdateProfilePayload): Promise<UserProfile> => {
    const res = await api.put('/me', payload);
    return res.data.data;
  },

  /**
   * Uploader un avatar
   */
  uploadAvatar: async (file: File): Promise<{ avatar_url: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await api.post('/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  /**
   * Récupérer les shorts de l'utilisateur connecté
   */
  getMyShorts: async (): Promise<Short[]> => {
    try {
      const response = await api.get('/my-shorts');
      
   

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      if (response.data && response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
        return response.data.data.data;
      }

      console.warn('Format de réponse inattendu pour /my-shorts:', response.data);
      return [];
      
    } catch (error) {
      console.error('❌ Erreur getMyShorts:', error);
      throw error;
    }
  },

  /**
   * Récupérer les shorts likés par l'utilisateur
   */
  getMyLikedShorts: async (): Promise<Short[]> => {
    try {
      const response = await api.get('/my-liked-shorts');
      

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      if (response.data && response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
        return response.data.data.data;
      }

      console.warn('Format de réponse inattendu pour /my-liked-shorts:', response.data);
      return [];
      
    } catch (error) {
      console.error('❌ Erreur getMyLikedShorts:', error);
      throw error;
    }
  },

  /**
   * Récupérer les likes de l'utilisateur (format brut)
   * @deprecated Utiliser getMyLikedShorts() à la place
   */
  getMyLikes: async (): Promise<ShortLike[]> => {
    try {
      const response = await api.get('/my-liked-shorts');
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      return [];
      
    } catch (error) {
      console.error('❌ Erreur getMyLikes:', error);
      throw error;
    }
  },

  /**
   * Récupérer le nombre total de shorts de l'utilisateur
   */
  getMyShortsCount: async (): Promise<number> => {
    try {
      const shorts = await profileService.getMyShorts();
      return shorts.length;
    } catch (error) {
      console.error('❌ Erreur getMyShortsCount:', error);
      return 0;
    }
  },

  /**
   * Vérifier si l'utilisateur a des shorts
   */
  hasShorts: async (): Promise<boolean> => {
    try {
      const count = await profileService.getMyShortsCount();
      return count > 0;
    } catch (error) {
      console.error('❌ Erreur hasShorts:', error);
      return false;
    }
  },

  /**
   * Supprimer un short
   */
  deleteShort: async (shortId: number): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await api.delete(`/shorts/${shortId}`);
      return { success: true, message: response.data?.message };
    } catch (error: any) {
      console.error(`❌ Erreur deleteShort ${shortId}:`, error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur lors de la suppression' 
      };
    }
  },

  /**
   * Mettre à jour un short
   */
  updateShort: async (shortId: number, data: Partial<Short>): Promise<Short> => {
    const response = await api.put(`/shorts/${shortId}`, data);
    return response.data;
  },

  // ====================== NOUVELLE MÉTHODE ======================
  /**
   * Récupérer les articles likés par l'utilisateur
   */
  getMyLikedArticles: async (): Promise<LikedArticle[]> => {
    try {
      const response = await api.get('/my-likes');
      
      console.log('📦 Réponse API /my-likes:', response);

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      if (response.data && response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
        return response.data.data.data;
      }

      console.warn('Format de réponse inattendu pour /my-likes:', response.data);
      return [];
      
    } catch (error: any) {
      console.error('❌ Erreur getMyLikedArticles:', error);
      throw error;
    }
  },

    /**
   * Retirer un like d'un article
   */
  unlikeArticle: async (articleId: number): Promise<void> => {
    try {
      await api.post(`/articles/${articleId}/like`); // On utilise le toggle
    } catch (error: any) {
      console.error('Erreur unlikeArticle:', error);
      throw error;
    }
  },
  
};









