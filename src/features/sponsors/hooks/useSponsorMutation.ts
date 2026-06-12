import { useState } from "react";
import axios from "axios";
import { sponsorApi } from "../api/SponsorApi";

export function useSponsorMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const resetErrors = () => {
    setError(null);
    setValidationErrors({});
  };

  const handleAxiosError = (err: unknown) => {
    if (axios.isAxiosError(err) && err.response) {
      const { status, data } = err.response;
      if (status === 422 && data.errors) {
        const laravelErrors: Record<string, string> = {};
        Object.keys(data.errors).forEach((key) => {
          laravelErrors[key] = data.errors[key][0];
        });
        setValidationErrors(laravelErrors);
      } else {
        setError(data.message ?? "Une erreur est survenue.");
      }
    } else {
      setError("Impossible de contacter le serveur.");
    }
  };

  const createSponsor = async (formData: FormData) => {
    setLoading(true);
    resetErrors();
    try {
      const res = await sponsorApi.create(formData);
      return res.data;
    } catch (err) {
      handleAxiosError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSponsor = async (id: number, formData: FormData) => {
    setLoading(true);
    resetErrors();
    try {
      const res = await sponsorApi.update(id, formData);
      return res.data;
    } catch (err) {
      handleAxiosError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSponsor = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await sponsorApi.delete(id);
      return true;
    } catch (err) {
      setError("Impossible de supprimer le sponsor.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      const res = await sponsorApi.toggleActive(id);
      return res.is_active;
    } catch (err) {
      setError("Impossible de changer le statut.");
      return null;
    }
  };

  return { createSponsor, updateSponsor, deleteSponsor, toggleStatus, loading, error, validationErrors };
}