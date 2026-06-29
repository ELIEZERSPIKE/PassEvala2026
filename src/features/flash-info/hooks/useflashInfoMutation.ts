// features/flash-info/hooks/useFlashMutation.ts
import { useState } from 'react';
import { flashInfoApi, FlashInfo } from '../api/flashApi';

type MutationAction =
  | { action: 'create'; payload: { title: string; link?: string | null } }
  | { action: 'update'; payload: { id: number; title?: string; link?: string | null } }
  | { action: 'delete'; payload: { id: number } };

interface MutationResult {
  success: boolean;
  data?: FlashInfo;
  message?: string;
}

interface UseFlashMutationReturn {
  mutate: (action: MutationAction['action'], payload: any) => Promise<MutationResult>;
  loading: boolean;
  error: string | null;
  validationErrors: Record<string, string[]>;
}

export const useFlashMutation = (): UseFlashMutationReturn => {
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const [validationErrors, setValidation]   = useState<Record<string, string[]>>({});

  const mutate = async (action: MutationAction['action'], payload: any): Promise<MutationResult> => {
    setLoading(true);
    setError(null);
    setValidation({});

    try {
      let res;
      if (action === 'create') {
        res = await flashInfoApi.create(payload);
      } else if (action === 'update') {
        const { id, ...data } = payload;
        res = await flashInfoApi.update(id, data);
      } else {
        res = await flashInfoApi.delete(payload.id);
      }
      return { success: true, data: (res as any).data, message: res.message };
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Une erreur est survenue.';
      const errors = err?.response?.data?.errors || {};
      setError(msg);
      setValidation(errors);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error, validationErrors };
};