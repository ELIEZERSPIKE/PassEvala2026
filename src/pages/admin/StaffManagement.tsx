// features/admin/pages/StaffManagement.tsx
import { useState, useEffect } from 'react';
import { Search, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import api from '@/api/axios';
import { User } from '@/types';

type FilterType = 'tous' | 'reporter' | 'user' | 'actif' | 'inactif';

const StaffManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('tous');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', username: '', phone: '', password: '', password_confirmation: '' });
  const [submitting, setSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users);
    } catch {
      showError('Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: number, role: 'user' | 'reporter') => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
      showSuccess(role === 'reporter' ? 'Promu reporter.' : 'Rétrogradé en user.');
    } catch {
      showError('Action impossible.');
    }
  };

  const toggleStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle-status`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u));
      showSuccess(currentStatus ? 'Compte désactivé.' : 'Compte activé.');
    } catch {
      showError('Action impossible.');
    }
  };

  const createReporter = async () => {
    if (!form.name || !form.username || !form.password) return;
    setSubmitting(true);
    try {
      const res = await api.post('/admin/users/reporter', {
        ...form,
        password_confirmation: form.password,
      });
      setUsers(prev => [res.data.user, ...prev]);
      setShowModal(false);
      setForm({ name: '', username: '', phone: '', password: '', password_confirmation: '' });
      showSuccess('Reporter créé.');
    } catch (err: any) {
      showError(err.response?.data?.message || 'Erreur lors de la création.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'reporter') return u.role === 'reporter';
    if (filter === 'user') return u.role === 'user';
    if (filter === 'actif') return u.is_active;
    if (filter === 'inactif') return !u.is_active;
    return true;
  });

  const initials = (name: string | null, username: string) =>
    (name || username).slice(0, 2).toUpperCase();

  const FILTERS: { label: string; value: FilterType }[] = [
    { label: 'Tous', value: 'tous' },
    { label: 'Reporters', value: 'reporter' },
    { label: 'Users', value: 'user' },
    { label: 'Actifs', value: 'actif' },
    { label: 'Inactifs', value: 'inactif' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs et rôles</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les reporters et les accès à l'application.</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
          <Plus className="w-4 h-4" /> Nouveau reporter
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou username..."
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              filter === f.value
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-sm text-gray-400">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400">Aucun utilisateur trouvé.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Utilisateur</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Rôle</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Membre depuis</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        u.role === 'reporter' ? 'bg-green-100 text-green-700' :
                        u.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {initials(u.name, u.username)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{u.name || u.username}</p>
                        <p className="text-xs text-gray-400">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                      u.role === 'reporter' ? 'bg-green-100 text-green-700' :
                      u.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-green-500' : 'bg-red-400'}`} />
                      <span className="text-xs text-gray-500">{u.is_active ? 'Actif' : 'Inactif'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(u.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {u.role === 'user' && (
                        <button onClick={() => assignRole(u.id, 'reporter')}
                          className="flex items-center gap-1 px-2 py-1 text-xs border border-green-200 text-green-700 rounded hover:bg-green-50 transition">
                          <ArrowUp className="w-3 h-3" /> Reporter
                        </button>
                      )}
                      {u.role === 'reporter' && (
                        <button onClick={() => assignRole(u.id, 'user')}
                          className="flex items-center gap-1 px-2 py-1 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50 transition">
                          <ArrowDown className="w-3 h-3" /> User
                        </button>
                      )}
                      <button onClick={() => toggleStatus(u.id, u.is_active)}
                        className="px-2 py-1 text-xs border border-amber-200 text-amber-700 rounded hover:bg-amber-50 transition">
                        {u.is_active ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal créer reporter */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Créer un reporter</h2>
            <p className="text-sm text-gray-500 mb-5">Le compte sera directement créé avec le rôle reporter.</p>
            {(['name', 'username', 'phone', 'password'] as const).map(field => (
              <div key={field} className="mb-3">
                <label className="block text-xs text-gray-500 mb-1 capitalize">{field === 'password' ? 'Mot de passe' : field === 'name' ? 'Nom complet' : field === 'phone' ? 'Téléphone' : "Nom d'utilisateur"}</label>
                <input type={field === 'password' ? 'password' : 'text'}
                  value={form[field]}
                  onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition">
                Annuler
              </button>
              <button onClick={createReporter} disabled={submitting}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
                {submitting ? 'Création...' : 'Créer le reporter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;