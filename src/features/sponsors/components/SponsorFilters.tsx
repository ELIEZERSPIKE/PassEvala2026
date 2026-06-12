import { useState, ChangeEvent } from "react";

interface SponsorFiltersProps {
  onFilterChange: (filters: { search: string; is_active: string }) => void;
}

export default function SponsorFilters({ onFilterChange }: SponsorFiltersProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const handleChange = (newSearch: string, newStatus: string) => {
    onFilterChange({ search: newSearch, is_active: newStatus });
  };

  return (
    <div className="flex gap-4 mb-4 bg-white p-4 rounded-lg border border-gray-100">
      <input
        type="text"
        placeholder="Rechercher un sponsor..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); handleChange(e.target.value, status); }}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-400 w-64"
      />
      <select
        value={status}
        onChange={(e) => { setStatus(e.target.value); handleChange(search, e.target.value); }}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none bg-white focus:border-teal-400"
      >
        <option value="">Tous les statuts</option>
        <option value="true">Actifs</option>
        <option value="false">Inactifs</option>
      </select>
    </div>
  );
}