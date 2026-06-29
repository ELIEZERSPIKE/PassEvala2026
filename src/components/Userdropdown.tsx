// components/UserDropdown.tsx
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  LayoutDashboard,
  User,
  Heart,
  Video,
  ChevronDown,
  Settings,
  Upload,
} from 'lucide-react';
import { useAuth } from '../store/authContext';
import getImageUrl from '../utils/imageUtils';   // ← Import ajouté

export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isStaff = user && ['superadmin', 'admin'].includes(user.role);

  // ✅ Avatar avec getImageUrl
  const avatarUrl = user?.avatar_url ? getImageUrl(user.avatar_url) : null;

  // Ferme le dropdown si on clique en dehors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  const menuItems = [
    {
      label: 'Mon profil',
      icon: User,
      to: '/profile/me',
      description: 'Modifier mes infos',
    },
    {
      label: 'Mes likes',
      icon: Heart,
      to: '/profile/likes',
      description: 'Articles que j\'ai aimés',
    },
    {
      label: 'Mes shorts',
      icon: Video,
      to: '/profile/shorts',
      description: 'Mes vidéos publiées',
    },
    {
      label: 'Avatar',
      icon: Upload,
      to: '/profile/avatar',
      description: 'Changer ma photo',
    },
  ];

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all"
        style={{
          background: open ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.05)',
          border: open
            ? '1px solid rgba(59, 130, 246, 0.4)'
            : '1px solid rgba(59, 130, 246, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Avatar avec getImageUrl */}
        <div className="w-7 h-7 rounded-full overflow-hidden border border-blue-500/30 flex-shrink-0">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={user.username}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/200x200?text=Avatar';
              }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-[10px] font-black"
              style={{
                background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                color: '#FFFFFF',
              }}
            >
              {user.username.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <span className="text-xs font-semibold hidden sm:block" style={{ color: '#F0F7FF' }}>
          {user.username}
        </span>

        {isStaff && (
          <span
            className="text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider hidden sm:block"
            style={{
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#60A5FA',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            {user.role}
          </span>
        )}

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5" style={{ color: '#60A5FA' }} />
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-64 rounded-2xl overflow-hidden z-50"
            style={{
              background: 'linear-gradient(160deg, #0D1E3A 0%, #1A2A4A 100%)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              boxShadow: '0 20px 60px rgba(0, 10, 30, 0.7), 0 0 0 1px rgba(59,130,246,0.1)',
            }}
          >
            {/* Header utilisateur */}
            <div
              className="px-4 py-4 flex items-center gap-3"
              style={{ borderBottom: '1px solid rgba(59, 130, 246, 0.15)' }}
            >
              <div className="w-11 h-11 rounded-2xl overflow-hidden border border-blue-500/30 flex-shrink-0">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={user.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/200x200?text=Avatar';
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-xl font-black"
                    style={{
                      background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                      color: '#FFFFFF',
                    }}
                  >
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: '#F0F7FF' }}>
                  {user.name || user.username}
                </p>
                <p className="text-xs truncate" style={{ color: '#60A5FA' }}>
                  @{user.username}
                </p>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-2 px-2">
              {menuItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
                      style={{ color: '#93A8C9' }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(59, 130, 246, 0.1)';
                        (e.currentTarget as HTMLElement).style.color = '#F0F7FF';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = '#93A8C9';
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(59, 130, 246, 0.1)' }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: '#60A5FA' }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold">{item.label}</p>
                        <p className="text-[10px] opacity-60">{item.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Admin link */}
              {isStaff && (
                <>
                  <div className="my-2 mx-1" style={{ borderTop: '1px solid rgba(59, 130, 246, 0.15)' }} />
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: menuItems.length * 0.04 }}
                  >
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                      style={{ color: '#60A5FA' }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(59, 130, 246, 0.12)'}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
                        <LayoutDashboard className="w-3.5 h-3.5" style={{ color: '#60A5FA' }} />
                      </div>
                      <div>
                        <p className="text-xs font-bold">Administration</p>
                        <p className="text-[10px] opacity-60">Dashboard & gestion</p>
                      </div>
                    </Link>
                  </motion.div>
                </>
              )}

              {/* Déconnexion */}
              <div className="mt-2 mx-1" style={{ borderTop: '1px solid rgba(239, 68, 68, 0.15)' }} />
              <motion.button
                onClick={handleLogout}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (menuItems.length + 1) * 0.04 }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl mt-1 transition-all text-left"
                style={{ color: '#F87171' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                  <LogOut className="w-3.5 h-3.5" style={{ color: '#F87171' }} />
                </div>
                <div>
                  <p className="text-xs font-bold">Déconnexion</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}