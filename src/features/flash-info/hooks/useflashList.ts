import { useState, useEffect, useCallback } from 'react';
import { flashInfoApi, FlashInfo, FlashInfoFiltersParams } from '../api/flashApi';

interface UseFlashListReturn {
  data: FlashInfo[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const useFlashList = (params?: FlashInfoFiltersParams): UseFlashListReturn => {
  const [data, setData]       = useState<FlashInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    flashInfoApi.getAll(params)
      .then(res => setData(res.data))
      .catch(() => setError('Impossible de charger les flash infos.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refresh: fetch };
};