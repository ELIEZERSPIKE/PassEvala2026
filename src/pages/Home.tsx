import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SponsorBanner from '../components/SponsorBanner';
import FlashInfoFeed from '../components/FlashInfoFeed';
import NewsSection from '../components/NewsSection';
import FilEvalaShorts from '../components/FilEvalaShorts';
import BonsPlansKara from '../components/BonsPlansKara';
import UsefulNumbersStack from '../components/UsefulNumbersStack';
import Footer from '../components/Footer';
import { Article } from '../types';
import { Calendar, MapPin, Clock, X, Filter } from 'lucide-react';
import { CALENDAR_EVENTS } from '../data'; // We keep calendar data for now as it doesn't have an API yet
import { getImageUrl } from '../utils/imageUtils'; // Import de la fonction utilitaire

export default function HomePage() {
  const [activeNavSection, setActiveNavSection] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarFilter, setCalendarFilter] = useState<'All' | 'Wrestling' | 'Culture'>('All');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => {
        setHighlightedId(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  const handleNavigation = (section: string) => {
    setActiveNavSection(section);

    if (section === 'calendar') {
      setIsCalendarOpen(true);
      return;
    }

    let elementId = '';
    switch (section) {
      case 'news': elementId = 'component-news-section'; break;
      case 'evala-feed': elementId = 'component-fil-evala'; break;
      case 'kara-tips': elementId = 'component-bons-plans'; break;
      case 'numbers': elementId = 'component-useful-numbers'; break;
      default:
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedId(elementId);
      }
    }
  };

  const filteredCalendarEvents = calendarFilter === 'All'
    ? CALENDAR_EVENTS
    : CALENDAR_EVENTS.filter(evt => evt.type === calendarFilter);

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-gray-900 flex flex-col relative" id="pass-evala-root">
      <Header onNavClick={handleNavigation} activeSection={activeNavSection} />

      <main className="flex-grow max-w-[1440px] mx-auto w-full px-4 md:px-8 py-6 md:py-10">
        <div className="mb-6 bg-white border-l-4 border-blue-600 border-y border-r border-gray-200 p-4 rounded-r-md text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-display font-black text-blue-600 tracking-wider block">Information officielle PASS AFRICA</span>
            <p className="font-display font-extrabold text-sm text-[#222222]">
              Bienvenue sur PASS EVALA 2026. Suivez en direct l'actualité des luttes traditionnelles de la Kara.
            </p>
          </div>
          <button onClick={() => handleNavigation('calendar')} className="flex items-center gap-1.5 flex-shrink-0 bg-[#222222] hover:bg-blue-600 text-white font-display font-extrabold text-[11px] uppercase py-2 px-3.5 rounded-sm tracking-wider transition-colors shadow-xs">
            <Calendar className="w-3.5 h-3.5" /> Programme complet
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 relative">
          
          {/* Main News Section */}
          <div className={`order-1 lg:order-none lg:col-span-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 transition-all duration-500 rounded-sm ${highlightedId === 'component-news-section' ? 'ring-4 ring-blue-600 ring-offset-2 z-10 scale-[1.01] shadow-lg' : ''}`} id="component-news-section">
            <NewsSection onArticleClick={setSelectedArticle} />
          </div>

          {/* Fil Evala Shorts */}
          <div className={`order-2 lg:order-none lg:col-span-1 lg:col-start-4 lg:row-start-1 lg:row-span-1 transition-all duration-500 rounded-sm ${highlightedId === 'component-fil-evala' ? 'ring-4 ring-blue-600 ring-offset-2 z-10 scale-[1.01] shadow-lg' : ''}`} id="component-fil-evala">
            <FilEvalaShorts />
          </div>

          {/* Flash Info */}
          <div className={`order-3 lg:order-none lg:col-span-1 lg:col-start-1 lg:row-start-2 lg:row-span-1 transition-all duration-500 rounded-sm ${highlightedId === 'component-flash-info' ? 'ring-4 ring-blue-600 ring-offset-2 z-10 scale-[1.01] shadow-lg' : ''}`} id="component-flash-info">
            <FlashInfoFeed onArticleClick={setSelectedArticle} />
          </div>

          {/* Bons Plans */}
          <div className={`order-5 lg:order-none lg:col-span-1 lg:col-start-5 lg:row-start-1 lg:row-span-2 transition-all duration-500 rounded-sm ${highlightedId === 'component-bons-plans' ? 'ring-4 ring-blue-600 ring-offset-2 z-10 scale-[1.01] shadow-lg' : ''}`} id="component-bons-plans">
            <BonsPlansKara />
          </div>

          {/* Useful Numbers */}
          <div className={`order-4 lg:order-none lg:col-span-1 lg:col-start-2 lg:row-start-2 lg:row-span-1 transition-all duration-500 rounded-sm ${highlightedId === 'component-useful-numbers' ? 'ring-4 ring-blue-600 ring-offset-2 z-10 scale-[1.01] shadow-lg' : ''}`} id="component-useful-numbers">
            <UsefulNumbersStack />
          </div>

          {/* Sponsor Banner - only on larger screens, appearing right side */}
          <div className="hidden lg:block lg:col-span-1 lg:col-start-5 lg:row-start-3">
            <SponsorBanner />
          </div>
        </div>

        {/* Mobile Sponsor Banner */}
        <div className="block lg:hidden mt-8">
          <SponsorBanner />
        </div>

        {/* Article Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedArticle.title}</h2>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <img
                  src={getImageUrl(selectedArticle.image_path)}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                  {selectedArticle.content || selectedArticle.summary}
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Publié le {new Date(selectedArticle.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Modal */}
        {isCalendarOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Calendrier EVALA 2026</h2>
                <button
                  onClick={() => setIsCalendarOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Filter Buttons */}
                <div className="flex gap-2 mb-6">
                  {(['All', 'Wrestling', 'Culture'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setCalendarFilter(type)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        calendarFilter === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <Filter className="w-4 h-4 inline mr-2" />
                      {type}
                    </button>
                  ))}
                </div>

                {/* Calendar Events */}
                <div className="space-y-3">
                  {filteredCalendarEvents.map(evt => (
                    <div key={evt.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <h3 className="font-semibold text-gray-900">{evt.title}</h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {evt.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {evt.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {evt.location}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          evt.type === 'Wrestling' ? 'bg-red-100 text-red-700' :
                          evt.type === 'Culture' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {evt.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
