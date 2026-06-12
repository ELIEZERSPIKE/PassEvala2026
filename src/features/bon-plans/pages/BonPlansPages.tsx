import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Tag } from "lucide-react";
import BonPlanTable from "../components/BonPlanTable";
import BonPlanForm, { BonPlan } from "../components/BonPlanForm";
import BonPlanFilters from "../components/BonPlanFilters";
import { useBonPlans } from "../hooks/useBonPlan";
import { bonPlanApi } from "../api/bonPlanApi";

export default function BonPlansPage() {
  const { data, loading, error, refresh } = useBonPlans({ per_page: 100 });
  const [searchFilters, setSearchFilters] = useState({ search: "", category: "" });

  // --- États pour la gestion du formulaire (Affichage direct) ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBonPlan, setSelectedBonPlan] = useState<BonPlan | undefined>(undefined);

  const bonPlans = data?.data || [];

  const categories = useMemo(() => 
    Array.from(new Set(bonPlans.map((bp) => bp.category).filter(Boolean))) as string[]
  , [bonPlans]);

  // --- 3. Gestion des filtres locaux ---
  const filteredBonPlans = useMemo(() => {
    return bonPlans.filter(bp => {
      const matchSearch = bp.title.toLowerCase().includes(searchFilters.search.toLowerCase());
      const matchCat = !searchFilters.category || bp.category === searchFilters.category;
      return matchSearch && matchCat;
    });
  }, [bonPlans, searchFilters]);

  // --- 4. Gestion des actions du tableau ---
  const handleEditClick = (bonPlan: BonPlan) => {
    setSelectedBonPlan(bonPlan); // Données injectées -> Mode édition
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce bon plan ?")) {
      try {
        await bonPlanApi.delete(id);
        refresh();
      } catch (err) {
        alert("Une erreur est survenue lors de la suppression.");
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    refresh();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Entête de navigation */}
      <div className="mb-8">
        <Link to="/admin" className="text-teal-600 hover:text-teal-700 flex items-center gap-1 mb-4 text-sm font-bold uppercase tracking-wider transition-transform hover:-translate-x-1">
          <ArrowLeft className="w-4 h-4" /> Retour au tableau de bord
        </Link>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="bg-teal-100 p-2 rounded-xl">
              <Tag className="w-8 h-8 text-teal-600" />
            </div>
            {isFormOpen ? (selectedBonPlan ? "Modifier le Bon Plan" : "Nouveau Bon Plan") : "Gestion des Bons Plans"}
          </h1>

          {!isFormOpen && (
            <button
              onClick={() => { setSelectedBonPlan(undefined); setIsFormOpen(true); }}
              className="bg-teal-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-teal-200 hover:bg-teal-700 hover:shadow-xl transition-all flex items-center gap-2 active:scale-95"
            >
              Ajouter un bon plan
            </button>
          )}
        </div>
      </div>

      {isFormOpen ? (
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-8 max-w-2xl animate-in fade-in duration-300">
          <BonPlanForm
            bonPlan={selectedBonPlan}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      ) : (
        <>
          <BonPlanFilters 
            onFilterChange={(f) => setSearchFilters(f)} 
            categories={categories} 
          />

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-sm text-gray-500">Chargement des éléments...</div>
          ) : (
            <BonPlanTable
              bonPlans={filteredBonPlans}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </>
      )}
    </div>
  );
}