import { useState, useEffect, useCallback } from "react";
import { sponsorApi, SponsorFiltersParams, PaginatedResponse } from "../api/SponsorApi";
import { Sponsor } from "../components/SponsorForm";

export function useSponsors(initialParams: SponsorFiltersParams = { page: 1, per_page: 15 }) {
  const [data, setData] = useState<PaginatedResponse<Sponsor>['data'] | null>(null);
  const [filters, setFilters] = useState<SponsorFiltersParams>(initialParams);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSponsors = useCallback(async (currentFilters: SponsorFiltersParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await sponsorApi.getAll(currentFilters);
      setData(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des sponsors.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSponsors(filters);
  }, [filters, fetchSponsors]);

  const changePage = (page: number) => setFilters((prev) => ({ ...prev, page }));
  const applyFilters = (newFilters: Omit<SponsorFiltersParams, 'page'>) => 
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));

  return { data, loading, error, filters, changePage, applyFilters, refresh: () => fetchSponsors(filters) };
}