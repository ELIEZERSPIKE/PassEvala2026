import { useAuth } from '../store/authContext';
import { LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserDropdown from './Userdropdown';

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const isStaff = user && ['superadmin', 'admin'].includes(user.role);

  return (
    <nav
      className="w-full h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50"
      style={{
        background: 'linear-gradient(160deg, #0A1628 0%, #1A2A4A 100%)',
        borderBottom: '1px solid rgba(59,130,246,0.2)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div
          className="w-9 h-9 flex items-center justify-center font-black text-sm rounded-md"
          style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)' }}
        >
          <span style={{ color: '#60A5FA' }}>PE</span>
        </div>
        <span className="font-black text-base tracking-wide uppercase" style={{ color: '#F0F7FF' }}>
          PASS <span style={{ color: '#60A5FA' }}>EVALA</span> 2026
        </span>
      </Link>

      {/* Liens publics */}
      <div className="hidden md:flex items-center gap-1">
        {[
          { to: '/',  label: 'Accueil' },
          { to: '#',  label: 'Actualités' },
          { to: '#',  label: 'Calendrier' },
          { to: '#',  label: 'À Propos' },
        ].map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-md transition-all"
            style={{ color: '#93A8C9' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#F0F7FF';
              (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.08)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = '#93A8C9';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            {link.label}
          </Link>
        ))}

        {isStaff && (
          <Link
            to="/admin"
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-md transition-all"
            style={{
              color: '#60A5FA',
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.3)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.2)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.1)';
            }}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Administration
          </Link>
        )}
      </div>

      {/* User */}
      {isAuthenticated && user ? (
        <UserDropdown />
      ) : (
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="px-3 py-2 text-xs font-bold rounded-md transition-all"
            style={{
              border: '1px solid rgba(59,130,246,0.4)',
              color: '#60A5FA',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.1)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            Connexion
          </Link>
          <Link
            to="/signup"
            className="px-3 py-2 text-xs font-bold rounded-md transition-all"
            style={{
              background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
              color: '#fff',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.opacity = '0.9';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.opacity = '1';
            }}
          >
            S'inscrire
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;