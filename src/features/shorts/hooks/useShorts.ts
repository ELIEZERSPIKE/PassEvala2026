import { useState, useEffect, useCallback } from 'react';
import shortService from '../services/shortService';
import { Short, ShortPayload, ShortUpdatePayload } from '../types/short';

export const useShorts = () => {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await shortService.getAll();
      setShorts(res.data);
    } catch {
      setError('Erreur lors du chargement des shorts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const createShort = async (data: ShortPayload) => {
    const res = await shortService.create(data);
    setShorts(prev => [res.data, ...prev]);
    return res;
  };

  const updateShort = async (id: number, data: ShortUpdatePayload) => {
    const res = await shortService.update(id, data);
    setShorts(prev => prev.map(s => s.id === id ? res.data : s));
    return res;
  };

  const deleteShort = async (id: number) => {
    await shortService.delete(id);
    setShorts(prev => prev.filter(s => s.id !== id));
  };

  return { shorts, loading, error, fetchAll, createShort, updateShort, deleteShort };
};