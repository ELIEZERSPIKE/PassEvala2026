import { useState, useEffect } from 'react';
import { Menu, X, Eye, Sun, Cloud, Calendar as CalendarIcon, Phone, FileText, Sparkles, Map } from 'lucide-react';

interface HeaderProps {
  onNavClick: (section: string) => void;
  activeSection: string;
}

export default function Header({ onNavClick, activeSection }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visitors, setVisitors] = useState(2458);
  const [weatherTemp, setWeatherTemp] = useState(31);
  const [weatherCondition, setWeatherCondition] = useState<'sunny' | 'cloudy'>('sunny');

  // Realistic visitor count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitors((prev) => {
        const change = Math.floor(Math.random() * 9) - 4; // -4 to +4
        return Math.max(2200, prev + change);
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Soft weather temperature update simulator
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hour = now.getUTCHours();
      // Simulating temperature variations between 28 and 34 in Kara Togo
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
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E5E5] bg-white px-4 md:px-8 h-[90px] flex items-center justify-between shadow-sm">
      {/* Brand Logo */}
      <button 
        onClick={() => onNavClick('all')} 
        className="flex items-center gap-2 group transition-all text-left"
        id="btn-logo-brand"
      >
        <div className="h-10 w-10 bg-[#222222] text-white flex items-center justify-center font-display font-extrabold text-lg rounded-sm tracking-tighter shadow-md group-hover:bg-blue-600 duration-300">
          PE
        </div>
        <div>
          <span className="block font-display font-black text-xl tracking-tight text-[#222222] uppercase">
            PASS <span className="text-blue-600 font-extrabold">EVALA</span> 2026
          </span>
          <span className="block text-[10px] text-gray-500 font-sans uppercase tracking-[0.2em] -mt-1 font-semibold">
            Portail Officiel • Kara
          </span>
        </div>
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.val;
          return (
            <button
              key={item.val}
              onClick={() => onNavClick(item.val)}
              className={`flex items-center gap-2 py-2 px-3 font-display font-bold text-sm uppercase tracking-wide transition-all rounded-md duration-200 ${
                isActive
                  ? 'text-[#222222] bg-[#F5F5F5] border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
              id={`nav-${item.val}`}
            >
              <Icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Widgets & Mobile Trigger */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Visitors Widget */}
        <div 
          className="flex items-center gap-2 bg-[#F5F5F5] px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:border-gray-300 transition-colors"
          title="Visiteurs en direct sur la plateforme"
          id="widget-visitors"
        >
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <Eye className="w-4 h-4 text-gray-400" />
          <span className="font-mono text-xs font-bold text-gray-800">
            {visitors.toLocaleString()} <span className="text-[10px] text-gray-500 font-semibold uppercase">live</span>
          </span>
        </div>

        {/* Weather Widget */}
        <div 
          className="hidden sm:flex items-center gap-2 bg-[#F5F5F5] px-3 py-1.5 rounded-full border border-gray-200 text-gray-700"
          title="Météo actuelle à Kara"
          id="widget-weather"
        >
          {weatherCondition === 'sunny' ? (
            <Sun className="w-4 h-4 text-amber-500 animate-[spin_12s_linear_infinite]" />
          ) : (
            <Cloud className="w-4 h-4 text-sky-400" />
          )}
          <div className="text-right">
            <span className="block font-sans text-[10px] font-bold text-gray-500 leading-none">KARA</span>
            <span className="block font-mono text-xs font-bold leading-tight">{weatherTemp}°C</span>
          </div>
        </div>

        {/* Mobile Hamburger Burger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-md hover:bg-[#F5F5F5] border border-gray-200 transition-colors"
          aria-label="Toggle menu"
          id="btn-mobile-menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-[#222222]" /> : <Menu className="w-6 h-6 text-[#222222]" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div 
          className="absolute top-[90px] left-0 w-full bg-white border-b border-[#E5E5E5] py-4 px-6 shadow-xl lg:hidden flex flex-col gap-3 z-50 animate-[fadeIn_0.2s_ease-out]"
          id="mobile-navigation-panel"
        >
          {/* Weather Widget for mobile row */}
          <div className="sm:hidden flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-100">
            <span className="font-display font-bold text-xs text-gray-600">Ville: Kara, TG</span>
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="font-mono text-xs font-bold">{weatherTemp}°C ensoleillé</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.val;
              return (
                <button
                  key={item.val}
                  onClick={() => {
                    onNavClick(item.val);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full py-3 px-4 font-display font-bold text-sm uppercase tracking-wide rounded-md text-left transition-colors ${
                    isActive
                      ? 'text-[#222222] bg-gray-100 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  id={`mobile-nav-${item.val}`}
                >
                  <Icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
