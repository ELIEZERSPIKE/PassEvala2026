import React, { useState } from 'react';
import { useAuth } from '@/store';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/utils/imageUtils';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit, 
  Award, 
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';

// Imports de ta nouvelle architecture Feature
import { useSponsors } from '../hooks/useSponsor';
import { useSponsorMutation } from '../hooks/useSponsorMutation';
import SponsorForm, { Sponsor } from '../components/SponsorForm';
import SponsorStatusBadge from '../components/SponsorStatusBadge';

export const SponsorsPage: React.FC = () => {
  const { user } = useAuth();
  
  // Utilisation de tes nouveaux hooks isolés
  const { data, loading, refresh, changePage } = useSponsors();
  const { deleteSponsor, toggleStatus } = useSponsorMutation();

  // États pour gérer l'affichage du formulaire à la place du tableau
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | undefined>(undefined);

  // Sécurité Rôle Admin
  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return (
      <div className="p-8 text-center text-red-600 font-bold bg-red-50 rounded-xl m-6 border border-red-100">
        Accès refusé. Réservé aux administrateurs.
      </div>
    );
  }

  const handleEditClick = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingSponsor(undefined);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingSponsor(undefined);
    refresh(); 
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce sponsor ?')) {
      const success = await deleteSponsor(id);
      if (success) refresh();
    }
  };

  const handleToggleStatus = async (id: number) => {
    await toggleStatus(id);
    refresh();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Entête de navigation commune */}
      <div className="mb-8">
        <Link to="/admin" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-4 text-sm font-bold uppercase tracking-wider transition-transform hover:-translate-x-1">
          <ArrowLeft className="w-4 h-4" /> Retour au tableau de bord
        </Link>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-xl">
              <Award className="w-8 h-8 text-amber-600" />
            </div>
            {isFormOpen ? (editingSponsor ? "Modifier le Sponsor" : "Nouveau Sponsor") : "Gestion des Sponsors"}
          </h1>

          {/* On affiche le bouton d'action uniquement si le formulaire est fermé */}
          {!isFormOpen && (
            <button 
              onClick={handleCreateClick}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-5 h-5" /> Nouveau Sponsor
            </button>
          )}
        </div>
      </div>

      {/* RENDER CONDITIONNEL : Formulaire vs Tableau */}
      {isFormOpen ? (
        <div className="bg-white shadow-sm border border-gray-100 rounded-[2rem] p-8 max-w-2xl transition-all animate-fadeIn">
          <SponsorForm 
            sponsor={editingSponsor} 
            onSuccess={handleFormSuccess} 
            onCancel={() => setIsFormOpen(false)} 
          />
        </div>
      ) : (
        /* Liste des sponsors (Ton design d'origine préservé) */
        <div className="bg-white shadow-sm border border-gray-100 rounded-[2rem] overflow-hidden">
          {loading && !data ? (
            <div className="py-12 text-center text-gray-500 font-medium">Chargement des sponsors...</div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Visuel</th>
                    <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Sponsor & Lien</th>
                    <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Contact</th>
                    <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Statut</th>
                    <th className="px-6 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.data.map((sponsor) => (
                    <tr key={sponsor.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-20 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-blue-100">
                          {sponsor.banner_url ? (
                            <img 
                              src={getImageUrl(sponsor.banner_url)} 
                              alt={sponsor.name} 
                              className="w-full h-full object-contain p-1"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+Indisponible';
                              }}
                            />
                          ) : (
                            <Award className="w-6 h-6 text-gray-200" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{sponsor.name}</div>
                        {sponsor.website_url && (
                          <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 flex items-center gap-1 hover:text-blue-700 mt-1 font-medium">
                            {new URL(sponsor.website_url).hostname} <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 font-medium">
                          {sponsor.phone || sponsor.email || sponsor.company_location || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {/* Utilisation de ton composant de statut avec ton design d'icône */}
                        <button 
                          onClick={() => handleToggleStatus(sponsor.id)}
                          className={`flex items-center gap-2 text-xs font-bold transition-all ${sponsor.is_active ? 'text-emerald-600' : 'text-gray-400'}`}
                        >
                          {sponsor.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          {sponsor.is_active ? 'Affiché' : 'Masqué'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => handleEditClick(sponsor)} 
                          className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors shadow-sm bg-white border border-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(sponsor.id)} 
                          className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors shadow-sm bg-white border border-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Barre de pagination Laravel */}
              {data && data.last_page > 1 && (
                <div className="flex justify-between items-center p-6 bg-gray-50/50 border-t border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">Page {data.current_page} sur {data.last_page}</span>
                  <div className="flex gap-2">
                    <button 
                      disabled={data.current_page === 1} 
                      onClick={() => changePage(data.current_page - 1)} 
                      className="px-4 py-2 text-sm font-bold border bg-white rounded-xl disabled:opacity-40 transition-all hover:bg-gray-50"
                    >
                      Précédent
                    </button>
                    <button 
                      disabled={data.current_page === data.last_page} 
                      onClick={() => changePage(data.current_page + 1)} 
                      className="px-4 py-2 text-sm font-bold border bg-white rounded-xl disabled:opacity-40 transition-all hover:bg-gray-50"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};