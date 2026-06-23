import { useAuth } from '../store/authContext';
import { LogOut, User, LayoutDashboard } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Liste des rôles ayant accès au back-office
  const isStaff = user && ['superadmin', 'admin'].includes(user.role);

  return (
  <nav className="w-full h-16 flex items-center justify-between px-4 md:px-8"
    style={{ background: '#1A0A00', borderBottom: '1px solid rgba(139,37,0,0.4)' }}>

    {/* Logo */}
    <Link to="/" className="flex items-center gap-3">
      <div className="w-9 h-9 flex items-center justify-center font-black text-sm rounded-md"
        style={{ background: '#8B2500', color: '#FDF0EB' }}>PE</div>
      <span className="font-black text-base tracking-wide uppercase" style={{ color: '#FDFAF7' }}>
        PASS <span style={{ color: '#D4822A' }}>EVALA</span> 2026
      </span>
    </Link>

    {/* Liens */}
    <div className="hidden md:flex items-center gap-1">
      {[
        { to: '/', label: 'Accueil' },
        { to: '#', label: 'Actualités' },
        { to: '#', label: 'Calendrier' },
        { to: '#', label: 'À Propos' },
      ].map((link) => (
        <Link key={link.label} to={link.to}
          className="px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-md transition-all"
          style={{ color: '#8C6A52' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#FDF0EB')}
          onMouseLeave={e => (e.currentTarget.style.color = '#8C6A52')}>
          {link.label}
        </Link>
      ))}
      {isStaff && (
        <Link to="/admin"
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-md"
          style={{ color: '#D4822A', background: 'rgba(212,130,42,0.1)', border: '1px solid rgba(212,130,42,0.3)' }}>
          <LayoutDashboard className="w-3.5 h-3.5" />
          Administration
        </Link>
      )}
    </div>

    {/* User */}
    {isAuthenticated && user ? (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,130,42,0.25)', color: '#FDF0EB' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
            style={{ background: '#8B2500', color: '#FDF0EB' }}>
            {user.username.slice(0, 2).toUpperCase()}
          </div>
          {user.username}
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-md transition-all"
          style={{ background: 'rgba(139,37,0,0.2)', border: '1px solid rgba(139,37,0,0.5)', color: '#F0997B' }}>
          <LogOut className="w-3.5 h-3.5" />
          Déconnexion
        </button>
      </div>
    ) : (
      <div className="flex items-center gap-2">
        <Link to="/login"
          className="px-3 py-2 text-xs font-bold rounded-md"
          style={{ border: '1px solid rgba(212,130,42,0.4)', color: '#D4822A' }}>
          Connexion
        </Link>
        <Link to="/signup"
          className="px-3 py-2 text-xs font-bold rounded-md"
          style={{ background: '#8B2500', color: '#FDF0EB' }}>
          S'inscrire
        </Link>
      </div>
    )}
  </nav>
);

  // return (
  //   <nav className="bg-white border-b border-gray-200 shadow-sm">
  //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  //       <div className="flex justify-between items-center h-16">
  //         {/* Logo */}
  //         <div className="flex items-center gap-2">
  //           <h1 className="text-2xl font-bold text-blue-600">EVALA</h1>
  //           <span className="text-xs text-gray-500">2026</span>
  //         </div>

  //         {/* Navigation Links */}
  //         <div className="hidden md:flex items-center gap-8">
  //           <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
  //             Accueil
  //           </Link>
  //           <a href="#" className="text-gray-700 hover:text-blue-600 transition">
  //             Actualités
  //           </a>
  //           <a href="#" className="text-gray-700 hover:text-blue-600 transition">
  //             Calendrier
  //           </a>
  //           <a href="#" className="text-gray-700 hover:text-blue-600 transition">
  //             À Propos
  //           </a>
  //           {isStaff && (
  //             <Link to="/admin" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition font-bold">
  //               <LayoutDashboard className="w-4 h-4" />
  //               Administration
  //             </Link>
  //           )}
  //         </div>

  //         {/* User Menu */}
  //         {isAuthenticated && user ? (
  //           <div className="flex items-center gap-4">
  //             <div className="flex items-center gap-2">
  //               <User className="w-5 h-5 text-gray-600" />
  //               <span className="text-sm font-medium text-gray-700">
  //                 {user.username}
  //               </span>
  //             </div>
  //             <button
  //               onClick={handleLogout}
  //               className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
  //             >
  //               <LogOut className="w-4 h-4" />
  //               Déconnexion
  //             </button>
  //           </div>
  //         ) : (
  //           <div className="flex items-center gap-3">
  //             <a
  //               href="/login"
  //               className="px-4 py-2 text-blue-600 hover:text-blue-700 transition font-medium"
  //             >
  //               Connexion
  //             </a>
  //             <a
  //               href="/signup"
  //               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
  //             >
  //               S'inscrire
  //             </a>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </nav>
  // );
};

export default Navbar;
