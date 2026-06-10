import React, { useEffect, useState } from 'react';
import { useAuth } from '@/store';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { getImageUrl } from '@/utils/imageUtils';
import { 
  ArrowLeft, 
  Trash2, 
  ShieldCheck, 
  User as UserIcon,
  Loader
} from 'lucide-react';

interface StaffUser {
  id: number;
  name: string | null;
  username: string;
  phone: string | null;
  role: string;
  avatar_url?: string | null;
}

export const ManageStaff: React.FC = () => {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  // Security: only admin (superadmin) and admin_standard (admin) can access
  const hasAccess = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';

  useEffect(() => {
    if (hasAccess) {
      loadUsers();
    }
  }, [hasAccess]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users');
      setUsers(response.data.data);
    } catch (err: any) {
      console.error("Error fetching staff users:", err);
      setError("Impossible de charger la liste du staff.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user: StaffUser) => {
    if (window.confirm(`Voulez-vous vraiment supprimer l'administrateur ${user.username} ?`)) {
      try {
        setDeletingId(user.id);
        await api.delete(`/users/${user.id}`);
        setUsers(users.filter(u => u.id !== user.id));
      } catch (err: any) {
        console.error("Error deleting user:", err);
        alert(err.response?.data?.message || "Erreur lors de la suppression de l'utilisateur.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (!hasAccess) {
    return (
      <div className="p-8 text-center text-red-600 font-bold bg-red-50 rounded-xl m-6 border border-red-100">
        Accès refusé. Réservé aux administrateurs.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Navigation and Title */}
      <div className="mb-8">
        <Link to="/admin" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-4 text-sm font-bold uppercase tracking-wider transition-transform hover:-translate-x-1">
          <ArrowLeft className="w-4 h-4" /> Retour au tableau de bord
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-xl">
              <ShieldCheck className="w-8 h-8 text-red-600" />
            </div>
            Gestion des Utilisateurs & Rôles
          </h1>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 text-red-700 bg-red-50 border border-red-100 rounded-2xl font-medium">
          {error}
        </div>
      )}

      {/* Staff Table */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-[2rem] overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="text-sm font-medium text-gray-500">Chargement des membres du staff...</span>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Avatar</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Nom d'utilisateur</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Nom complet</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Téléphone</th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Rôle</th>
                <th className="px-6 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((staff) => (
                <tr key={staff.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                      {staff.avatar_url ? (
                        <img src={getImageUrl(staff.avatar_url)} alt={staff.username} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{staff.username}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {staff.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {staff.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      staff.role === 'superadmin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {staff.role === 'superadmin' ? 'Admin (Alpha)' : 'Admin Standard'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    {/* Le bouton de suppression d'un admin_standard (donc de rôle "admin" dans la DB) */}
                    {/* est visible uniquement si l'utilisateur connecté est admin (donc de rôle "superadmin" dans la DB) */}
                    {currentUser?.role === 'superadmin' && staff.role !== 'superadmin' ? (
                      <button 
                        onClick={() => handleDelete(staff)} 
                        disabled={deletingId === staff.id}
                        className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors shadow-sm bg-white border border-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic font-medium">-</span>
                    )}
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
