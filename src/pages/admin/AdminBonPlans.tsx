import React, { useEffect, useState } from 'react';
import { bonPlanService } from '@/services/bonPlanService';
import { useAuth } from '@/store';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/utils/imageUtils';
import { ArrowLeft, Plus, Trash2, Edit, FileText, Loader2 } from 'lucide-react';

export interface BonPlan {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  image_path: string | null;
  created_at: string;
  updated_at: string;
}

export const AdminBonPlans: React.FC = () => {
  const [bonPlans, setBonPlans] = useState<BonPlan[]>([]);
  const [loading, setLoading] = useState(true); //  état de chargement
  const { user, hasPermission } = useAuth();

  useEffect(() => {
    // 👇 Le check de rôle vient APRÈS les hooks
    if (user?.role !== 'admin' && user?.role !== 'superadmin') return;
    loadBonPlans();
  }, [user]);

  const loadBonPlans = async () => {
    try {
      setLoading(true);
      const data = await bonPlanService.getAll();
      setBonPlans(data);
    } catch (err) {
      console.error('Erreur chargement bon plan', err);
    } finally {
      setLoading(false); // 👈 toujours désactiver, même en cas d'erreur
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Supprimer ce bon plan ?')) {
      await bonPlanService.delete(id);
      loadBonPlans();
    }
  };

  // Check de rôle APRÈS les hooks
  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return <div className="p-8 text-red-500">Accès refusé. Réservé aux administrateurs.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link to="/admin" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-4 text-sm font-bold uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Retour au tableau de bord
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Gestion des Bon Plans
          </h1>
          {(user?.role === 'superadmin' || user?.role === 'admin' || hasPermission('manage bon plans')) && (
            <Link to="/admin/bonplans/new" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" /> Nouveau plan
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        {/* 👇 État de chargement */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Chargement des bons plans...
          </div>
        ) : bonPlans.length === 0 ? (
          // 👇 État vide
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FileText className="w-10 h-10 mb-3 opacity-30" />
            <p className="font-medium">Aucun bon plan pour l'instant</p>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Image</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Titre</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Description</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Categorie</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bonPlans.map((bonPlan) => (
                <tr key={bonPlan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {bonPlan.image_path && (
                      <img src={getImageUrl(bonPlan.image_path)} alt="" className="w-14 h-10 object-cover rounded-lg shadow-sm" />
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{bonPlan.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{bonPlan.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{bonPlan.category}</td>

                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      to={`/admin/bonplans/${bonPlan.id}/edit`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors font-bold text-sm"
                    >
                      <Edit className="w-4 h-4" /> Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(bonPlan.id)}
                      className="inline-flex items-center gap-1 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-bold text-sm"
                    >
                      <Trash2 className="w-4 h-4" /> Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};