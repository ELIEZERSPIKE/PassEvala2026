import { useState } from "react";
import api from "../../../api/axios";

export function useBonPlanMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleAxiosError = (err: any) => {
    if (err.response) {
      if (err.response.status === 422) {
        // Transforme l'objet d'erreurs Laravel ['field': ['error msg']] en ['field': 'error msg']
        const formattedErrors: Record<string, string> = {};
        for (const key in err.response.data.errors) {
          formattedErrors[key] = err.response.data.errors[key][0];
        }
        setValidationErrors(formattedErrors);
      } else if (err.response.status === 403) {
        setError(err.response.data.message || "Action non autorisée.");
      } else {
        setError("Une erreur est survenue sur le serveur.");
      }
    } else {
      setError("Impossible de contacter le serveur.");
    }
  };

  async function createBonPlan(formData: FormData): Promise<boolean> {
    setLoading(true);
    setError(null);
    setValidationErrors({});
    try {
      await api.post("/bon-plans", formData);
      return true;
    } catch (err) {
      handleAxiosError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function updateBonPlan(id: number, formData: FormData): Promise<boolean> {
    setLoading(true);
    setError(null);
    setValidationErrors({});
    try {
      // Note : On passe par un .post() avec _method=PUT car l'upload de fichiers via FormData ne passe parfois pas en PUT natif sur PHP/Laravel
      await api.post(`/bon-plans/${id}`, formData);
      return true;
    } catch (err) {
      handleAxiosError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { createBonPlan, updateBonPlan, loading, error, validationErrors };
}