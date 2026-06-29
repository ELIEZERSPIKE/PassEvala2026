// src/components/AppNavbar.tsx
import { NavLink } from 'react-router-dom';
import { Globe, FileText, Zap, Video, LogOut, Shield, Gift, Phone, Star } from 'lucide-react';
import { useAuth } from '@/store/authContext';
import getImageUrl from '@/utils/imageUtils';

const LINKS_REPORTER = [
  { to: '/reporter/articles',   label: 'Articles',    icon: <FileText className="w-4 h-4" />, permission: null },
  { to: '/reporter/flash-info', label: 'Flash infos', icon: <Zap className="w-4 h-4" />,      permission: null },
  { to: '/reporter/shorts',     label: 'Shorts',      icon: <Video className="w-4 h-4" />,     permission: null },
];

// Tous les modules admin possibles — filtrés par permission ensuite
const LINKS_ADMIN_ALL = [
  { to: '/admin/articles',        label: 'Articles',         icon: <FileText className="w-4 h-4" />, permission: 'manage articles'       },
  { to: '/admin/flash-info',      label: 'Flash infos',      icon: <Zap className="w-4 h-4" />,      permission: 'manage flash-infos'    },
  { to: '/admin/shorts',          label: 'Shorts',           icon: <Video className="w-4 h-4" />,     permission: 'manage shorts'         },
  { to: '/admin/sponsors',        label: 'Sponsors',         icon: <Star className="w-4 h-4" />,      permission: 'manage sponsors'       },
  { to: '/admin/bons-plans',      label: 'Bons plans',       icon: <Gift className="w-4 h-4" />,      permission: 'manage bons-plans'     },
  { to: '/admin/useful-numbers',  label: 'Numéros utiles',   icon: <Phone className="w-4 h-4" />,     permission: 'manage numeros-utiles' },
  { to: '/admin/settings/roles',  label: 'Staff',            icon: <Shield className="w-4 h-4" />,    permission: 'manage staff'          },
];

const homeByRole: Record<string, string> = {
  reporter:   '/reporter',
  admin:      '/admin',
  superadmin: '/admin',
};

const colorByRole: Record<string, string> = {
  reporter:   'text-green-600',
  admin:      'text-blue-600',
  superadmin: 'text-purple-600',
};

const activeBgByRole: Record<string, string> = {
  reporter:   'bg-green-50 text-green-700',
  admin:      'bg-blue-50 text-blue-700',
  superadmin: 'bg-purple-50 text-purple-700',
};

export const AppNavbar = () => {
  const { user, logout, hasPermission } = useAuth();
  if (!user) return null;

  const role     = user.role ?? 'user';
  const homeLink = homeByRole[role]    ?? '/';
  const roleColor  = colorByRole[role]   ?? 'text-gray-600';
  const activeBg   = activeBgByRole[role] ?? 'bg-gray-100 text-gray-700';

  // ✅ Reporter → liens fixes, Admin/Superadmin → filtrés par permission
  const links =
    role === 'reporter' ? LINKS_REPORTER :
    (role === 'admin' || role === 'superadmin')
      ? LINKS_ADMIN_ALL.filter(l => l.permission === null || hasPermission(l.permission))
      : [];

  const avatarUrl = user.avatar_url ? getImageUrl(user.avatar_url) : null;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">

        {/* Logo */}
        <NavLink to={homeLink} className="flex items-center gap-2 font-black text-lg text-gray-900 shrink-0">
          <div className="bg-green-600 p-1.5 rounded-lg">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <span className="hidden sm:inline">Evala 2026</span>
        </NavLink>

        {/* Liens filtrés par permission */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                  isActive ? activeBg : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </div>

        {/* User + avatar + logout */}
        <div className="flex items-center gap-3 shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-600">
              {(user.name || user.username || '?').slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-800 leading-none">
              {user.name || user.username}
            </p>
            <p className={`text-xs font-medium capitalize ${roleColor}`}>{role}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>

      </div>
    </nav>
  );
};