import { useState, useEffect, useCallback } from 'react';
import { usefulNumberApi } from '../api/usefullNumberApi';
import { UsefulNumber, UsefulNumberPayload } from '../types/usefulNumber';

export const useNumbers = () => {
  const [numbers, setNumbers] = useState<UsefulNumber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await usefulNumberApi.getAll();
      setNumbers(res.data);
    } catch {
      setError('Erreur lors du chargement des numéros.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const createNumber = async (data: UsefulNumberPayload) => {
    const res = await usefulNumberApi.create(data);
    setNumbers(prev => [res.data, ...prev]);
    return res;
  };

  const updateNumber = async (id: number, data: Partial<UsefulNumberPayload>) => {
    const res = await usefulNumberApi.update(id, data);
    setNumbers(prev => prev.map(n => n.id === id ? res.data : n));
    return res;
  };

  const deleteNumber = async (id: number) => {
    await usefulNumberApi.delete(id);
    setNumbers(prev => prev.filter(n => n.id !== id));
  };

  return { numbers, loading, error, fetchAll, createNumber, updateNumber, deleteNumber };
};