
import { useState, useEffect, useCallback } from 'react';
import shortService from '../services/shortService';
import { Short, ShortPayload, ShortUpdatePayload } from '../types/short';

export const useShorts = () => {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadShorts = useCallback(async () => {
    try {
      setError(null);
      const response = await shortService.getAll();
      setShorts(response.data);
      
      console.log('📊 Shorts chargés:', response.data.length);
      const statusCount = response.data.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('  - Stats:', statusCount);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des shorts');
      console.error('❌ Erreur loadShorts:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadShorts();
  }, [loadShorts]);

  const refreshShorts = async () => {
    setIsRefreshing(true);
    await loadShorts();
  };

  const createShort = async (data: ShortPayload) => {
    try {
      const response = await shortService.create(data);
      console.log('✅ Short créé:', response.data.id);
      await loadShorts();
      return response;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
      throw err;
    }
  };

  const updateShort = async (id: number, data: ShortUpdatePayload) => {
    try {
      const response = await shortService.update(id, data);
      console.log('✅ Short mis à jour:', response.data.id);
      await loadShorts();
      return response;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  const deleteShort = async (id: number) => {
    try {
      await shortService.delete(id);
      console.log('🗑️ Short supprimé:', id);
      await loadShorts();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression');
      throw err;
    }
  };

  return {
    shorts,
    loading,
    error,
    isRefreshing,
    createShort,
    updateShort,
    deleteShort,
    loadShorts,
    refreshShorts,
  };
};









































// Code fonctionnel
//  import { useState, useEffect, useCallback } from 'react';
// import shortService from '../services/shortService';
// import { Short, ShortPayload, ShortUpdatePayload } from '../types/short';

// export const useShorts = () => {
//   const [shorts, setShorts] = useState<Short[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const loadShorts = useCallback(async () => {
//     try {
//       setError(null);
//       const response = await shortService.getAll();
//       setShorts(response.data);
      
//       console.log('📊 Shorts chargés:', response.data.length);
//       console.log('  - Publiés:', response.data.filter(s => s.status === 'published').length);
//       console.log('  - En traitement:', response.data.filter(s => s.status === 'draft').length);
//       console.log('  - Archivés:', response.data.filter(s => s.status === 'archived').length);
//     } catch (err: any) {
//       setError(err.message || 'Erreur lors du chargement des shorts');
//       console.error('Erreur loadShorts:', err);
//     } finally {
//       setLoading(false);
//       setIsRefreshing(false);
//     }
//   }, []);

//   // Chargement initial
//   useEffect(() => {
//     loadShorts();
//   }, [loadShorts]);

//   const refreshShorts = async () => {
//     setIsRefreshing(true);
//     await loadShorts();
//   };

//   const createShort = async (data: ShortPayload) => {
//     try {
//       const response = await shortService.create(data);
//       console.log('✅ Short créé:', response);
//       await loadShorts();
//       return response;
//     } catch (err: any) {
//       setError(err.message || 'Erreur lors de la création');
//       throw err;
//     }
//   };

//   const updateShort = async (id: number, data: ShortUpdatePayload) => {
//     try {
//       const response = await shortService.update(id, data);
//       console.log('✅ Short mis à jour:', response);
//       await loadShorts();
//       return response;
//     } catch (err: any) {
//       setError(err.message || 'Erreur lors de la mise à jour');
//       throw err;
//     }
//   };

//   const deleteShort = async (id: number) => {
//     try {
//       await shortService.delete(id);
//       console.log('🗑️ Short supprimé:', id);
//       await loadShorts();
//     } catch (err: any) {
//       setError(err.message || 'Erreur lors de la suppression');
//       throw err;
//     }
//   };

//   return {
//     shorts,
//     loading,
//     error,
//     isRefreshing,
//     createShort,
//     updateShort,
//     deleteShort,
//     loadShorts,
//     refreshShorts,
//   };
// };











// hooks/useShorts.ts
// import { useState, useEffect, useCallback } from 'react';
// import shortService from '../services/shortService';
// import { Short, ShortPayload, ShortUpdatePayload } from '../types/short';

// export const useShorts = () => {
//   const [shorts, setShorts] = useState<Short[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const loadShorts = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await shortService.getAll();
//       setShorts(response.data);
//     } catch (err: any) {
//       setError(err.message || 'Erreur lors du chargement des shorts');
//       console.error('Erreur loadShorts:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadShorts();
//   }, [loadShorts]);

//   const createShort = async (data: ShortPayload) => {
//     try {
//       const response = await shortService.create(data);
//       console.log('Short créé:', response);
//       await loadShorts();
//       return response;
//     } catch (err: any) {
//       setError(err.message || 'Erreur lors de la création');
//       throw err;
//     }
//   };

//   const updateShort = async (id: number, data: ShortUpdatePayload) => {
//     try {
//       const response = await shortService.update(id, data);
//       console.log('Short mis à jour:', response);
//       await loadShorts();
//       return response;
//     } catch (err: any) {
//       setError(err.message || 'Erreur lors de la mise à jour');
//       throw err;
//     }
//   };

//   const deleteShort = async (id: number) => {
//     try {
//       await shortService.delete(id);
//       console.log('Short supprimé:', id);
//       await loadShorts();
//     } catch (err: any) {
//       setError(err.message || 'Erreur lors de la suppression');
//       throw err;
//     }
//   };

//   return {
//     shorts,
//     loading,
//     error,
//     createShort,
//     updateShort,
//     deleteShort,
//     loadShorts,
//   };
// };