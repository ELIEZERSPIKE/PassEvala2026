import React, { useState } from 'react';
import { FlashInfoFiltersParams } from '../api/flashApi';

interface FlashInfoFiltersProps {
  onFilterChange: (filters: FlashInfoFiltersParams) => void;
}

export const FlashInfoFilters: React.FC<FlashInfoFiltersProps> = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: search.trim() === '' ? undefined : search, page: 1 });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Rechercher un flash info..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '8px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Filtrer
      </button>
    </form>
  );
};