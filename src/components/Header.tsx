import { useState, useEffect } from 'react';
import { Menu, X, Eye, Sun, Cloud, Calendar as CalendarIcon, Phone, FileText, Sparkles, Map, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';

interface HeaderProps {
  onNavClick: (section: string) => void;
  activeSection: string;
}

export default function Header({ onNavClick, activeSection }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visitors, setVisitors] = useState(2458);
  const [weatherTemp, setWeatherTemp] = useState(31);
  const [weatherCondition, setWeatherCondition] = useState<'sunny' | 'cloudy'>('sunny');
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isStaff = user && ['superadmin', 'admin'].includes(user.role);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitors((prev) => {
        const change = Math.floor(Math.random() * 9) - 4;
        return Math.max(2200, prev + change);
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hour = now.getUTCHours();
      if (hour >= 11 && hour <= 15) {
        setWeatherTemp(33);
        setWeatherCondition('sunny');
      } else {
        setWeatherTemp(30);
        setWeatherCondition('cloudy');
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'News', val: 'news', icon: FileText },
    { label: 'Calendar', val: 'calendar', icon: CalendarIcon },
    { label: 'Evala Feed', val: 'evala-feed', icon: Sparkles },
    { label: 'Kara Tips', val: 'kara-tips', icon: Map },
    { label: 'Useful Numbers', val: 'numbers', icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-[72px] flex items-center justify-between px-4 md:px-8"
      style={{ background: '#1A0A00', borderBottom: '2px solid #8B2500' }}>

      {/* Brand */}
      <button onClick={() => onNavClick('all')} className="flex items-center gap-3 group">
        <div className="w-10 h-10 flex items-center justify-center font-black text-sm rounded-md tracking-tight"
          style={{ background: '#8B2500', color: '#FDF0EB' }}>PE</div>
        <div>
          <span className="block font-black text-lg tracking-wide uppercase" style={{ color: '#FDFAF7' }}>
            PASS <span style={{ color: '#D4822A' }}>EVALA</span> 2026
          </span>
          <span className="block text-[10px] uppercase tracking-[0.18em]" style={{ color: '#8C6A52' }}>
            Portail Officiel · Kara
          </span>
        </div>
      </button>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.val;
          return (
            <button key={item.val} onClick={() => onNavClick(item.val)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-md transition-all"
              style={{
                color: isActive ? '#D4822A' : '#8C6A52',
                background: isActive ? 'rgba(212,130,42,0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(212,130,42,0.3)' : '1px solid transparent',
              }}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Widgets + Auth */}
      <div className="flex items-center gap-3">

        {/* Visiteurs */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,37,0,0.35)', color: '#8C6A52' }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <Eye className="w-3.5 h-3.5" />
          {visitors.toLocaleString()} <span className="text-[9px] uppercase tracking-wider ml-0.5">live</span>
        </div>

        {/* Météo */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,37,0,0.35)', color: '#8C6A52' }}>
          {weatherCondition === 'sunny'
            ? <Sun className="w-3.5 h-3.5 animate-[spin_12s_linear_infinite]" style={{ color: '#D4822A' }} />
            : <Cloud className="w-3.5 h-3.5" style={{ color: '#8C6A52' }} />}
          <span className="text-[9px] uppercase tracking-wider">KARA</span>
          <span style={{ color: '#D4822A', fontWeight: 800 }}>{weatherTemp}°C</span>
        </div>

        {/* Auth */}
        {isAuthenticated && user ? (
          <div className="hidden lg:flex items-center gap-2">
            {/* Avatar + username */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,130,42,0.25)', color: '#FDF0EB' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                style={{ background: '#8B2500', color: '#FDF0EB' }}>
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              {user.username}
            </div>
            {/* Lien admin si staff */}
            {isStaff && (
              <Link to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md"
                style={{ color: '#D4822A', background: 'rgba(212,130,42,0.1)', border: '1px solid rgba(212,130,42,0.3)' }}>
                <LayoutDashboard className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
            {/* Déconnexion */}
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all"
              style={{ background: 'rgba(139,37,0,0.2)', border: '1px solid rgba(139,37,0,0.5)', color: '#F0997B' }}>
              <LogOut className="w-3.5 h-3.5" />
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2">
            <Link to="/login"
              className="px-3 py-1.5 text-xs font-bold rounded-md transition-all"
              style={{ border: '1px solid rgba(212,130,42,0.4)', color: '#D4822A' }}>
              Connexion
            </Link>
            <Link to="/signup"
              className="px-3 py-1.5 text-xs font-bold rounded-md"
              style={{ background: '#8B2500', color: '#FDF0EB' }}>
              S'inscrire
            </Link>
          </div>
        )}

        {/* Burger mobile */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-md transition-colors"
          style={{ border: '1px solid rgba(139,37,0,0.4)', background: 'rgba(139,37,0,0.1)' }}>
          {mobileMenuOpen
            ? <X className="w-5 h-5" style={{ color: '#D4822A' }} />
            : <Menu className="w-5 h-5" style={{ color: '#D4822A' }} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-[72px] left-0 w-full py-4 px-6 flex flex-col gap-2 z-50 lg:hidden"
          style={{ background: '#1A0A00', borderBottom: '2px solid #8B2500' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.val;
            return (
              <button key={item.val} onClick={() => { onNavClick(item.val); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 w-full py-3 px-4 text-sm font-bold uppercase tracking-wide rounded-md text-left transition-colors"
                style={{
                  color: isActive ? '#D4822A' : '#8C6A52',
                  background: isActive ? 'rgba(212,130,42,0.1)' : 'transparent',
                  borderLeft: isActive ? '3px solid #8B2500' : '3px solid transparent',
                }}>
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#D4822A' }} />
                {item.label}
              </button>
            );
          })}

          {/* Auth mobile */}
          <div className="mt-2 pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(139,37,0,0.3)' }}>
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold"
                  style={{ color: '#FDF0EB' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                    style={{ background: '#8B2500', color: '#FDF0EB' }}>
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                  {user.username}
                </div>
                {isStaff && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 w-full py-3 px-4 text-sm font-bold rounded-md"
                    style={{ color: '#D4822A', background: 'rgba(212,130,42,0.1)', borderLeft: '3px solid #D4822A' }}>
                    <LayoutDashboard className="w-4 h-4" />
                    Administration
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full py-3 px-4 text-sm font-bold rounded-md text-left"
                  style={{ color: '#F0997B', background: 'rgba(139,37,0,0.15)', borderLeft: '3px solid #8B2500' }}>
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-3 px-4 text-sm font-bold rounded-md"
                  style={{ border: '1px solid rgba(212,130,42,0.4)', color: '#D4822A' }}>
                  Connexion
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-3 px-4 text-sm font-bold rounded-md"
                  style={{ background: '#8B2500', color: '#FDF0EB' }}>
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}