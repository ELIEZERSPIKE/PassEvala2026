

import React, { useEffect, useState } from 'react';
import { sponsorService } from '@/services/sponsorService';
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

// Interface pour typer nos sponsors
interface Sponsor {
  id: number;
  name: string;
  company_location?: string;
  address?: string;
  email?: string;
  phone?: string;
  website_url?: string;
  is_active: boolean;
  banner_url?: string;
}

export const AdminSponsors: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const { user } = useAuth();

  // Sécurité : Vérification du rôle
  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return (
      <div className="p-8 text-center text-red-600 font-bold bg-red-50 rounded-xl m-6 border border-red-100">
        Accès refusé. Réservé aux administrateurs.
      </div>
    );
  }

  useEffect(() => {
    loadSponsors();
  }, []);

  const loadSponsors = async () => {
    try {
      const data = await sponsorService.getPublicSponsors();
      setSponsors(data);
    } catch (error) {
      console.error("Erreur chargement sponsors:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce sponsor ?')) {
      await sponsorService.delete(id);
      loadSponsors();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Entête de navigation */}
      <div className="mb-8">
        <Link to="/admin" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-4 text-sm font-bold uppercase tracking-wider transition-transform hover:-translate-x-1">
          <ArrowLeft className="w-4 h-4" /> Retour au tableau de bord
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-xl">
              <Award className="w-8 h-8 text-amber-600" />
            </div>
            Gestion des Sponsors
          </h1>
          <Link to="/admin/sponsors/new" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all flex items-center gap-2 active:scale-95">
            <Plus className="w-5 h-5" /> Nouveau Sponsor
          </Link>
        </div>
      </div>

      {/* Liste des sponsors */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-[2rem] overflow-hidden">
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
            {sponsors.map((sponsor) => (
              <tr key={sponsor.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-20 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-blue-100">
                    {sponsor.banner_url ? (
                      <img src={getImageUrl(sponsor.banner_url)} alt={sponsor.name} className="w-full h-full object-contain p-1" />
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
                  <div className="text-sm text-gray-600 font-medium">{sponsor.phone || sponsor.email || sponsor.company_location || '-'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className={`flex items-center gap-2 text-xs font-bold ${sponsor.is_active ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {sponsor.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    {sponsor.is_active ? 'Affiché' : 'Masqué'}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link to={`/admin/sponsors/edit/${sponsor.id}`} className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors shadow-sm bg-white border border-blue-50">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(sponsor.id)} className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors shadow-sm bg-white border border-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
