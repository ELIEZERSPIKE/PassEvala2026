import { useState, useEffect, useCallback } from 'react';
import { flashInfoApi, FlashInfo, FlashInfoFiltersParams } from '../api/flashApi';

// Hook de lecture
export const useFlashInfo = (initialFilters: FlashInfoFiltersParams = { page: 1, per_page: 10 }) => {
  const [flashInfos, setFlashInfos] = useState<FlashInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FlashInfoFiltersParams>(initialFilters);

  const fetchFlashInfos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await flashInfoApi.getAll(filters);
      setFlashInfos(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la récupération des flashs infos.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchFlashInfos();
  }, [fetchFlashInfos]);

  return { flashInfos, loading, error, filters, setFilters, refresh: fetchFlashInfos };
};

// Hook d'écriture (FlashMutation)
export const useFlashMutation = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const mutate = async (
    action: 'create' | 'update' | 'delete',
    payload: { id?: number; title?: string; link?: string | null }
  ) => {
    setLoading(true);
    setError(null);
    setValidationErrors({});
    try {
      let response;
      if (action === 'create') {
        response = await flashInfoApi.create({ title: payload.title!, link: payload.link });
      } else if (action === 'update' && payload.id) {
        response = await flashInfoApi.update(payload.id, { title: payload.title, link: payload.link });
      } else if (action === 'delete' && payload.id) {
        response = await flashInfoApi.delete(payload.id);
      }
      return { success: true, data: response };
    } catch (err: any) {
      if (err.response?.status === 422) {
        setValidationErrors(err.response.data.errors || {});
      } else {
        setError(err.response?.data?.message || "Une erreur est survenue lors de l'opération.");
      }
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error, validationErrors };
};