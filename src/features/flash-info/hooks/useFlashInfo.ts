// features/flash-info/hooks/useFlashInfo.ts
import { useState, useEffect, useCallback } from 'react';
import { flashInfoApi, FlashInfo, FlashInfoFiltersParams } from '../api/flashApi';

interface UseFlashInfoReturn {
  flashInfos: FlashInfo[];
  loading: boolean;
  error: string | null;
  setFilters: React.Dispatch<React.SetStateAction<FlashInfoFiltersParams>>;
  refresh: () => void;
}

export const useFlashInfo = (initialParams?: FlashInfoFiltersParams): UseFlashInfoReturn => {
  const [flashInfos, setFlashInfos] = useState<FlashInfo[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [filters, setFilters]       = useState<FlashInfoFiltersParams>(initialParams || {});

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    flashInfoApi.getAll(filters)
      .then(res => setFlashInfos(res.data))
      .catch(() => setError('Impossible de charger les flash infos.'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { fetch(); }, [fetch]);

  return { flashInfos, loading, error, setFilters, refresh: fetch };
};

// Re-export useFlashMutation pour que la page puisse tout importer depuis un seul endroit
