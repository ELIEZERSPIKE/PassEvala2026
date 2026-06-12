import { useState, useEffect, useCallback } from "react";
import { bonPlanApi, BonPlanFiltersParams, PaginatedResponse } from "../api/bonPlanApi";
import { BonPlan } from "../components/BonPlanForm";

export function useBonPlans(initialParams: BonPlanFiltersParams = { page: 1, per_page: 15 }) {
  const [data, setData] = useState<PaginatedResponse<BonPlan>['data'] | null>(null);
  const [filters, setFilters] = useState<BonPlanFiltersParams>(initialParams);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBonPlans = useCallback(async (currentFilters: BonPlanFiltersParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await bonPlanApi.getAll(currentFilters);
      setData(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des bons plans.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBonPlans(filters);
  }, [filters, fetchBonPlans]);

  const changePage = (page: number) => setFilters((prev) => ({ ...prev, page }));
  const applyFilters = (newFilters: Omit<BonPlanFiltersParams, 'page'>) => 
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));

  return { data, loading, error, filters, changePage, applyFilters, refresh: () => fetchBonPlans(filters) };
}