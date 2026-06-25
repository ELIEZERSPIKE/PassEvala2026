// features/admin/pages/ManageStaff.tsx
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
  Loader,
  Key,
  Eye,
  Edit2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StaffUser {
  id: number;
  name: string | null;
  username: string;
  phone: string | null;
  role: string;
  avatar_url?: string | null;
  permissions?: string[]; // Ajout des permissions
}

export const ManageStaff: React.FC = () => {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [filterRole, setFilterRole] = useState<string>('all');
  const { user: currentUser } = useAuth();

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
      // Assurez-vous que les permissions sont incluses
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

  const handleViewPermissions = async (user: StaffUser) => {
    try {
      const response = await api.get(`/users/${user.id}/permissions`);
      setSelectedUser({ ...user, permissions: response.data.permissions });
      setShowPermissionsModal(true);
    } catch (err) {
      console.error("Error fetching permissions:", err);
    }
  };

  const handleUpdateRole = async (userId: number, newRole: string) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      await loadUsers();
      setShowRoleModal(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de la mise à jour du rôle.");
    }
  };

  const filteredUsers = filterRole === 'all' 
    ? users 
    : users.filter(u => u.role === filterRole);

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
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-xl">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            Gestion des Utilisateurs & Rôles
          </h1>
          <div className="flex items-center gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            >
              <option value="all">Tous les rôles</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin Standard</option>
              <option value="user">Utilisateur</option>
            </select>
          </div>
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Utilisateur</th>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Rôle</th>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Permissions</th>
                  <th className="px-6 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((staff) => (
                  <motion.tr 
                    key={staff.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                          {staff.avatar_url ? (
                            <img src={getImageUrl(staff.avatar_url)} alt={staff.username} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{staff.username}</div>
                          <div className="text-sm text-gray-500">{staff.name || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        staff.role === 'superadmin' 
                          ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                          : staff.role === 'admin'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {staff.role === 'superadmin' ? 'Super Admin' : 
                         staff.role === 'admin' ? 'Admin Standard' : 
                         staff.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewPermissions(staff)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>Voir les permissions</span>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Bouton pour changer le rôle (uniquement pour superadmin) */}
                        {currentUser?.role === 'superadmin' && staff.role !== 'superadmin' && (
                          <button 
                            onClick={() => {
                              setSelectedUser(staff);
                              setShowRoleModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Changer le rôle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        
                        {/* Bouton de suppression */}
                        {currentUser?.role === 'superadmin' && staff.role !== 'superadmin' && (
                          <button 
                            onClick={() => handleDelete(staff)} 
                            disabled={deletingId === staff.id}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        
                        {staff.role === 'superadmin' && (
                          <span className="text-xs text-purple-400 font-medium px-2 py-1 bg-purple-50 rounded-full">
                            ⚡ Intouchable
                          </span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Permissions */}
      <AnimatePresence>
        {showPermissionsModal && selectedUser && (
          <PermissionsModal
            user={selectedUser}
            onClose={() => {
              setShowPermissionsModal(false);
              setSelectedUser(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Modal Role */}
      <AnimatePresence>
        {showRoleModal && selectedUser && (
          <RoleModal
            user={selectedUser}
            onClose={() => {
              setShowRoleModal(false);
              setSelectedUser(null);
            }}
            onUpdate={handleUpdateRole}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Composant Modal Permissions
const PermissionsModal: React.FC<{
  user: StaffUser;
  onClose: () => void;
}> = ({ user, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [allPermissions, setAllPermissions] = useState<{name: string, display: string}[]>([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await api.get(`/users/${user.id}/permissions`);
        setPermissions(response.data.permissions || []);
        
        // Récupérer toutes les permissions disponibles
        const allResponse = await api.get('/permissions');
        setAllPermissions(allResponse.data);
      } catch (err) {
        console.error("Error fetching permissions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, [user.id]);

  const getPermissionDisplay = (perm: string) => {
    const map: Record<string, string> = {
      'manage articles': '📝 Gérer les articles',
      'manage flash-infos': '⚡ Gérer les flash infos',
      'manage shorts': '🎬 Gérer les shorts',
      'manage sponsors': '💰 Gérer les sponsors',
      'manage bons-plans': '🏠 Gérer les bons plans',
      'manage numeros-utiles': '📞 Gérer les numéros utiles',
      'manage staff': '👥 Gérer le staff',
    };
    return map[perm] || perm;
  };

  const getCategory = (perm: string) => {
    const map: Record<string, string> = {
      'manage articles': 'Contenu',
      'manage flash-infos': 'Contenu',
      'manage shorts': 'Contenu',
      'manage sponsors': 'Publicité',
      'manage bons-plans': 'Services',
      'manage numeros-utiles': 'Services',
      'manage staff': 'Administration',
    };
    return map[perm] || 'Autre';
  };

  // Grouper les permissions par catégorie
  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    const category = getCategory(perm.name);
    if (!acc[category]) acc[category] = [];
    acc[category].push(perm);
    return acc;
  }, {} as Record<string, typeof allPermissions>);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Permissions de {user.username}</h3>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                user.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {user.role === 'superadmin' ? 'Super Admin' : 'Admin Standard'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([category, perms]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {category}
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {perms.map((perm) => {
                    const hasPermission = permissions.includes(perm.name);
                    return (
                      <div 
                        key={perm.name}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          hasPermission 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200 opacity-60'
                        }`}
                      >
                        {hasPermission ? (
                          <span className="text-green-500">✅</span>
                        ) : (
                          <span className="text-gray-400">❌</span>
                        )}
                        <span className={`text-sm font-medium ${
                          hasPermission ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {getPermissionDisplay(perm.name)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-semibold"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Composant Modal Role
const RoleModal: React.FC<{
  user: StaffUser;
  onClose: () => void;
  onUpdate: (userId: number, role: string) => void;
}> = ({ user, onClose, onUpdate }) => {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: 'admin', label: 'Admin Standard' },
    { value: 'user', label: 'Utilisateur' },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    await onUpdate(user.id, selectedRole);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Changer le rôle de {user.username}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-3">
          {roles.map((role) => (
            <label 
              key={role.value}
              className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition ${
                selectedRole === role.value 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                value={role.value}
                checked={selectedRole === role.value}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="font-medium text-gray-900">{role.label}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || selectedRole === user.role}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Chargement...' : 'Confirmer'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};