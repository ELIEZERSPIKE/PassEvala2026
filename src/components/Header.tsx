// components/Header.tsx
import { useState, useEffect } from 'react';
import { Menu, X, Eye, Sun, Cloud, Calendar as CalendarIcon, Phone, FileText, Sparkles, Map, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const location = useLocation();

  const isStaff = user && ['superadmin', 'admin'].includes(user.role);
  const isAdminPage = location.pathname.startsWith('/admin');

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

  // Si on est sur la page admin, on ne montre pas le header normal
  if (isAdminPage) {
    return (
      <header 
        className="sticky top-0 z-40 w-full h-[72px] flex items-center justify-between px-4 md:px-8"
        style={{ 
          background: 'linear-gradient(135deg, #0A1628 0%, #1A2A4A 50%, #0A1628 100%)',
          borderBottom: '2px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 20, 60, 0.5)',
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 flex items-center justify-center font-black text-sm rounded-lg"
            style={{ 
              background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
              color: '#FFFFFF',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
            }}
          >
            PE
          </div>
          <div>
            <span className="block font-bold text-lg tracking-wide uppercase" style={{ color: '#F0F7FF' }}>
              PASS <span style={{ color: '#60A5FA' }}>EVALA</span> 2026
            </span>
            <span className="block text-[10px] uppercase tracking-[0.18em]" style={{ color: '#93A8C9' }}>
              Administration
            </span>
          </div>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 text-xs font-bold rounded-xl"
          style={{ 
            background: 'rgba(255,255,255,0.1)',
            color: '#F0F7FF',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          Retour à l'accueil
        </button>
      </header>
    );
  }

  // Animation variants
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, y: -20 },
    visible: { opacity: 1, height: 'auto', y: 0 },
    exit: { opacity: 0, height: 0, y: -20 },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="sticky top-0 z-40 w-full"
      style={{ 
        background: 'linear-gradient(135deg, #0A1628 0%, #1A2A4A 50%, #0A1628 100%)',
        borderBottom: '2px solid rgba(59, 130, 246, 0.2)',
        boxShadow: '0 4px 30px rgba(0, 20, 60, 0.5)',
      }}
    >
      <div className="w-full h-[72px] flex items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        {/* Brand */}
        <motion.button 
          onClick={() => onNavClick('all')} 
          className="flex items-center gap-3 group flex-shrink-0"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="w-10 h-10 flex items-center justify-center font-black text-sm rounded-lg relative"
            style={{ 
              background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
              color: '#FFFFFF',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
            }}
            whileHover={{ rotate: -10 }}
          >
            <span className="relative z-10">PE</span>
            <motion.div 
              className="absolute inset-0 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)', opacity: 0 }}
              whileHover={{ opacity: 0.3 }}
            />
          </motion.div>
          <div className="hidden sm:block">
            <motion.span 
              className="block font-bold text-lg tracking-wide uppercase"
              style={{ color: '#F0F7FF' }}
            >
              PASS <span style={{ color: '#60A5FA' }}>EVALA</span> 2026
            </motion.span>
            <motion.span 
              className="block text-[10px] uppercase tracking-[0.18em]"
              style={{ color: '#93A8C9' }}
            >
              Portail Officiel · Kara
            </motion.span>
          </div>
        </motion.button>

        {/* Desktop Nav + Username */}
        <div className="hidden lg:flex flex-col items-center flex-1">
          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.val;
              return (
                <motion.button 
                  key={item.val} 
                  onClick={() => onNavClick(item.val)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-xl transition-all relative"
                  style={{
                    color: isActive ? '#60A5FA' : '#93A8C9',
                    background: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                  }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ background: 'linear-gradient(90deg, #2563EB, #60A5FA)' }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Username + Admin sous la navigation */}
          {isAuthenticated && user && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mt-0.5"
            >
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
                  style={{ 
                    background: 'linear-gradient(135deg, #2563EB, #3B82F6)', 
                    color: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                  }}
                  whileHover={{ rotate: -10 }}
                >
                  {user.username.slice(0, 2).toUpperCase()}
                </motion.div>
                <span className="text-xs font-semibold" style={{ color: '#93A8C9' }}>
                  {user.username}
                </span>
              </div>

              {/* ✅ Lien Administration (pour staff uniquement) */}
              {isStaff && (
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full transition-all"
                    style={{ 
                      background: 'rgba(59, 130, 246, 0.15)',
                      color: '#60A5FA',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                    }}
                  >
                    <LayoutDashboard className="w-3 h-3" />
                    Admin
                  </Link>
                </motion.div>
              )}

              {/* Badge de rôle */}
              {isStaff && (
                <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{ 
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#60A5FA',
                  border: '1px solid rgba(59, 130, 246, 0.1)',
                }}>
                  {user.role}
                </span>
              )}
            </motion.div>
          )}
        </div>

        {/* Widgets + Auth */}
        <div className="flex items-center gap-3">

          {/* Visiteurs */}
          <motion.div 
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(59, 130, 246, 0.2)', 
              color: '#93A8C9',
              backdropFilter: 'blur(10px)',
            }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Eye className="w-3.5 h-3.5" />
            <motion.span 
              key={visitors}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {visitors.toLocaleString()}
            </motion.span>
            <span className="text-[9px] uppercase tracking-wider ml-0.5">live</span>
          </motion.div>

          {/* Météo */}
          <motion.div 
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(59, 130, 246, 0.2)', 
              color: '#93A8C9',
              backdropFilter: 'blur(10px)',
            }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: weatherCondition === 'sunny' ? 360 : 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              {weatherCondition === 'sunny'
                ? <Sun className="w-3.5 h-3.5" style={{ color: '#60A5FA' }} />
                : <Cloud className="w-3.5 h-3.5" style={{ color: '#93A8C9' }} />}
            </motion.div>
            <span className="text-[9px] uppercase tracking-wider">KARA</span>
            <motion.span 
              key={weatherTemp}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ color: '#60A5FA', fontWeight: 800 }}
            >
              {weatherTemp}°C
            </motion.span>
          </motion.div>

          {/* Auth - Desktop */}
          {isAuthenticated && user ? (
            <div className="hidden lg:flex items-center gap-2">
              <motion.button 
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all"
                style={{ 
                  background: 'rgba(239, 68, 68, 0.15)', 
                  border: '1px solid rgba(239, 68, 68, 0.3)', 
                  color: '#F87171',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <LogOut className="w-3.5 h-3.5" />
                Déconnexion
              </motion.button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login"
                  className="px-4 py-2 text-xs font-bold rounded-xl transition-all"
                  style={{ 
                    border: '1px solid rgba(59, 130, 246, 0.4)', 
                    color: '#60A5FA',
                    background: 'rgba(59, 130, 246, 0.05)',
                  }}
                >
                  Connexion
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signup"
                  className="px-4 py-2 text-xs font-bold rounded-xl"
                  style={{ 
                    background: 'linear-gradient(135deg, #2563EB, #3B82F6)', 
                    color: '#FFFFFF',
                    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
                  }}
                >
                  S'inscrire
                </Link>
              </motion.div>
            </div>
          )}

          {/* Burger mobile */}
          <motion.button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="lg:hidden p-2 rounded-xl transition-colors"
            style={{ 
              border: '1px solid rgba(59, 130, 246, 0.3)', 
              background: 'rgba(59, 130, 246, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {mobileMenuOpen
              ? <X className="w-5 h-5" style={{ color: '#60A5FA' }} />
              : <Menu className="w-5 h-5" style={{ color: '#60A5FA' }} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden overflow-hidden"
            style={{ 
              background: 'linear-gradient(180deg, #0A1628, #1A2A4A)',
              borderBottom: '2px solid rgba(59, 130, 246, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 20, 60, 0.8)',
            }}
          >
            <div className="py-4 px-6 flex flex-col gap-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeSection === item.val;
                return (
                  <motion.button 
                    key={item.val} 
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                    onClick={() => { onNavClick(item.val); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 w-full py-3 px-4 text-sm font-bold uppercase tracking-wide rounded-xl text-left transition-colors"
                    style={{
                      color: isActive ? '#60A5FA' : '#93A8C9',
                      background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      border: isActive ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent',
                    }}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#60A5FA' }} />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="active-mobile-nav"
                        className="ml-auto w-1 h-6 rounded-full"
                        style={{ background: 'linear-gradient(180deg, #2563EB, #60A5FA)' }}
                      />
                    )}
                  </motion.button>
                );
              })}

              {/* Auth mobile */}
              <motion.div 
                className="mt-2 pt-3 flex flex-col gap-2"
                style={{ borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}
              >
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold"
                      style={{ color: '#F0F7FF' }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                        style={{ 
                          background: 'linear-gradient(135deg, #2563EB, #3B82F6)', 
                          color: '#FFFFFF',
                          boxShadow: '0 2px 10px rgba(37, 99, 235, 0.3)',
                        }}
                      >
                        {user.username.slice(0, 2).toUpperCase()}
                      </div>
                      {user.username}
                      {isStaff && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1" style={{ 
                          background: 'rgba(59, 130, 246, 0.2)',
                          color: '#60A5FA',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                        }}>
                          Admin
                        </span>
                      )}
                    </div>
                    {isStaff && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 w-full py-3 px-4 text-sm font-bold rounded-xl"
                        style={{ 
                          color: '#60A5FA', 
                          background: 'rgba(59, 130, 246, 0.1)', 
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                        }}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Administration
                      </Link>
                    )}
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="flex items-center gap-3 w-full py-3 px-4 text-sm font-bold rounded-xl text-left"
                      style={{ 
                        color: '#F87171', 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center w-full py-3 px-4 text-sm font-bold rounded-xl"
                      style={{ 
                        border: '1px solid rgba(59, 130, 246, 0.4)', 
                        color: '#60A5FA',
                        background: 'rgba(59, 130, 246, 0.05)',
                      }}
                    >
                      Connexion
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center w-full py-3 px-4 text-sm font-bold rounded-xl"
                      style={{ 
                        background: 'linear-gradient(135deg, #2563EB, #3B82F6)', 
                        color: '#FFFFFF',
                        boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
                      }}
                    >
                      S'inscrire
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}