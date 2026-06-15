import { useState } from "react";

interface BonPlanFiltersProps {
  onFilterChange: (filters: { search: string; category: string }) => void;
  categories?: string[]; // Optionnel : pour remplir le select si vous avez une liste de catégories
}

export default function BonPlanFilters({ onFilterChange, categories = [] }: BonPlanFiltersProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const handleChange = (newSearch: string, newCategory: string) => {
    onFilterChange({ search: newSearch, category: newCategory });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4 bg-white p-4 rounded-lg border border-gray-100">
      {/* Recherche par Titre */}
      <input
        type="text"
        placeholder="Rechercher un bon plan..."
        value={search}
        onChange={(e) => { 
          setSearch(e.target.value); 
          handleChange(e.target.value, category); 
        }}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-400 w-64"
      />

      {/* Filtre par Catégorie (si vous avez un set de catégories) */}
      {categories.length > 0 && (
        <select
          value={category}
          onChange={(e) => { 
            setCategory(e.target.value); 
            handleChange(search, e.target.value); 
          }}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none bg-white focus:border-teal-400"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}