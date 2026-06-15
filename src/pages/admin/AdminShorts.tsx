import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Video } from 'lucide-react';
import { useAuth } from '@/store';
import ShortList from '../../features/shorts/pages/ShortList';

export const AdminShorts: React.FC = () => {
  const { user } = useAuth();

  // Sécurité : Vérification du rôle admin
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
            <Video className="w-8 h-8 text-indigo-600" />
            Gestion des Shorts
          </h1>
        </div>
      </div>

      {/* Contenu Flash Info (table, filtres, formulaire) */}
      <ShortList />
    </div>
  );
};

export default AdminShorts;