import React, { useState } from 'react';
import { FlashInfoFilters } from '../components/flashInfoFilters';
import { FlashInfoTable } from '../components/flashInfoTable';
import { FlashInfoForm } from '../components/flashInfoForm'; // Ton formulaire adapté
import { FlashInfo } from '../api/flashApi';
import { useFlashInfo } from '../hooks/useflashInfo';
import { useFlashMutation } from '../hooks/useflashInfoMutation'; // fichier séparé

export const FlashInfoPages: React.FC = () => {
  // Lecture
  const { flashInfos, loading, error, setFilters, refresh } = useFlashInfo();
  
  // Écriture (Mutation)
  const { mutate, loading: mutationLoading, error: mutationError } = useFlashMutation();

  // États pour la gestion du formulaire (Création / Édition)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentFlash, setCurrentFlash] = useState<FlashInfo | null>(null);

  const handleEditClick = (flash: FlashInfo) => {
    setCurrentFlash(flash);
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setCurrentFlash(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce flash info ?")) {
      const result = await mutate('delete', { id });
      if (result.success) {
        refresh(); // Recharge la liste après suppression
      } else {
        alert(mutationError || "Impossible de supprimer.");
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setCurrentFlash(null);
    refresh(); // Recharge la liste mise à jour ou fraîchement créée
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Gestion des Flashs Infos — Evala 2026</h1>
        <button 
          onClick={handleCreateClick}
          style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Nouveau Flash
        </button>
      </div>

      {/* Zone Formulaire rétractable ou Modal */}
      {isFormOpen && (
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #eee' }}>
          <FlashInfoForm 
            initialData={currentFlash}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      )}

      {/* Barre de Filtres */}
      <FlashInfoFilters onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} />

      {/* Messages d'erreur globales */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Affichage des données */}
      {loading ? (
        <p>Chargement des données en cours...</p>
      ) : (
        <FlashInfoTable 
          data={flashInfos} 
          onEdit={handleEditClick} 
          onDelete={handleDeleteClick}
          isMutating={mutationLoading}
        />
      )}
    </div>
  );
};

export default FlashInfoPages;