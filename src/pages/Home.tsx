// pages/HomePage.tsx
import React, { useState } from 'react';
import Header from '../components/Header';
import SponsorBanner from '../components/SponsorBanner';
import FlashInfoFeed from '../components/FlashInfoFeed';
import NewsSection from '../components/NewsSection';
import FilEvalaShorts from '../components/FilEvalaShorts';
import BonsPlansKara from '../components/BonsPlansKara';
// import UsefulNumbersStack from '../components/UsefulNumbersStack';
import Footer from '../components/Footer';
import OfficialBanner from '../components/OfficialBanner';
import ArticleModal from '../components/Modal/ArticleModal';
import CalendarModal from '../components/CalendarModal';
import { useHighlight } from '../hooks/useHighlight';
import { cx } from '../utils/cx';
import { Article } from '../types';

// Map section → ancre DOM
const SECTION_ANCHORS: Record<string, string> = {
  news: 'component-news-section',
  'evala-feed': 'component-fil-evala',
  'kara-tips': 'component-bons-plans',
  numbers: 'component-useful-numbers',
};

function highlightClass(isHighlighted: boolean) {
  return isHighlighted
    ? 'ring-4 ring-blue-600 ring-offset-2 z-10 scale-[1.01] shadow-lg'
    : '';
}

export default function HomePage() {
  const [activeNavSection, setActiveNavSection] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { highlightedId, setHighlightedId } = useHighlight();

  const handleNavigation = (section: string) => {
    setActiveNavSection(section);

    if (section === 'calendar') {
      setIsCalendarOpen(true);
      return;
    }

    const elementId = SECTION_ANCHORS[section];
    if (!elementId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedId(elementId);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-gray-900 flex flex-col relative" id="pass-evala-root">
      <Header onNavClick={handleNavigation} activeSection={activeNavSection} />

      <main className="flex-grow max-w-[1440px] mx-auto w-full px-4 md:px-8 py-6 md:py-10">
        <OfficialBanner onCalendarClick={() => handleNavigation('calendar')} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 relative">

          <div id="component-news-section" className={cx('order-1 lg:order-none lg:col-span-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 transition-all duration-500 rounded-sm', highlightClass(highlightedId === 'component-news-section'))}>
            <NewsSection onArticleClick={setSelectedArticle} />
          </div>

          <div id="component-fil-evala" className={cx('order-2 lg:order-none lg:col-span-1 lg:col-start-4 lg:row-start-1 lg:row-span-1 transition-all duration-500 rounded-sm', highlightClass(highlightedId === 'component-fil-evala'))}>
            <FilEvalaShorts />
          </div>

          <div id="component-flash-info" className={cx('order-3 lg:order-none lg:col-span-1 lg:col-start-1 lg:row-start-2 lg:row-span-1 transition-all duration-500 rounded-sm', highlightClass(highlightedId === 'component-flash-info'))}>
            <FlashInfoFeed onArticleClick={setSelectedArticle} />
          </div>

          <div id="component-bons-plans" className={cx('order-5 lg:order-none lg:col-span-1 lg:col-start-5 lg:row-start-1 lg:row-span-2 transition-all duration-500 rounded-sm', highlightClass(highlightedId === 'component-bons-plans'))}>
            <BonsPlansKara />
          </div>

          {/* <div id="component-useful-numbers" className={cx('order-4 lg:order-none lg:col-span-1 lg:col-start-2 lg:row-start-2 lg:row-span-1 transition-all duration-500 rounded-sm', highlightClass(highlightedId === 'component-useful-numbers'))}>
            <UsefulNumbersStack />
          </div> */}

          <div className="hidden lg:block lg:col-span-1 lg:col-start-5 lg:row-start-3">
            <SponsorBanner />
          </div>
        </div>

        <div className="block lg:hidden mt-8">
          <SponsorBanner />
        </div>
      </main>

      <Footer />

      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
      {isCalendarOpen && (
        <CalendarModal onClose={() => setIsCalendarOpen(false)} />
      )}
    </div>
  );
}