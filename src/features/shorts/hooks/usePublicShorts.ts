// features/shorts/hooks/usePublicShorts.ts
import { useState, useEffect, useCallback } from 'react';
import shortService from '../services/shortService';
import { Short } from '../types/short';

export const usePublicShorts = () => {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadShorts = useCallback(async () => {
    try {
      setError(null);
      const response = await shortService.getPublicShorts();
      const published = response.data.filter(s => s.status === 'published');
      setShorts(published);
      console.log(`📊 ${published.length} shorts publiés chargés`);
    } catch (err: any) {
      setError('Impossible de charger les shorts');
      console.error('❌ usePublicShorts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    loadShorts();
  }, [loadShorts]);

  // Rafraîchissement automatique — 1 minute (max recommandé : 3 min pour les vidéos)
  const REFRESH_INTERVAL = 60_000;
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Rafraîchissement automatique...');
      loadShorts();
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadShorts]);

  // Rafraîchissement quand la page redevient visible
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden) {
        console.log('👁️ Page visible, rafraîchissement...');
        loadShorts();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [loadShorts]);

  return { shorts, loading, error, reload: loadShorts };
};