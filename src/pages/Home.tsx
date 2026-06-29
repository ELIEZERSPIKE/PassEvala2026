// HomePage.tsx - Version complète
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
 import SponsorBanner from '../components/SponsorBanner';
import FlashInfoFeed from '../components/FlashInfoFeed';
import NewsSection from '../components/NewsSection';
import FilEvalaShorts from '../components/FilEvalaShorts';
import BonsPlansKara from '../components/BonsPlansKara';
import UsefulNumbersStack from '../components/UsefulNumbersStack';
import Footer from '../components/Footer';
import ArticleModal from '../components/Modal/ArticleModal';
import CalendarModal from '../components/CalendarModal';
import { useHighlight } from '../hooks/useHighlight';
import { Article, FlashInfo } from '../types';
import FlashInfoModal from '../components/Modal/FlashInfoModal';
import { useEffect } from 'react';

import { Calendar } from 'lucide-react';
import PageTransition from '../components/Animations/PageTransition';
import RevealOnScroll from '../components/Animations/RevealOnScroll';
import { useToast } from '../hooks/useToast';

type NavSection = 'news' | 'evala-shorts' | 'kara-tips' | 'numeros utiles' | 'calendrier' | 'all' | string;

const NAV_MAP: Partial<Record<NavSection, string>> = {
  news: 'component-news-section-wrapper',
  'evala-shorts': 'component-fil-evala-wrapper',
  'kara-tips': 'component-bons-plans-wrapper',
  numbers: 'component-useful-numbers-wrapper',
};

export default function HomePage() {
  const [activeNavSection, setActiveNavSection] = useState<NavSection>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedFlashInfo, setSelectedFlashInfo] = useState<FlashInfo | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { showArticleToast } = useToast();

  // Sync like update across components dynamically
  useEffect(() => {
    const handleLikeUpdate = (e: Event) => {
      const { articleId, isLiked, likesCount } = (e as CustomEvent).detail;
      if (selectedArticle && selectedArticle.id === articleId) {
        setSelectedArticle(prev => prev ? { ...prev, is_liked_by_user: isLiked, likes_count: likesCount } : null);
      }
    };
    window.addEventListener('article-like-updated', handleLikeUpdate);
    return () => window.removeEventListener('article-like-updated', handleLikeUpdate);
  }, [selectedArticle]);


  const { highlightedId, setHighlightedId } = useHighlight();

  const handleNavigation = (section: string) => {
    setActiveNavSection(section);

    if (section === 'calendar') {
      setIsCalendarOpen(true);
      return;
    }

    const elementId = NAV_MAP[section];
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

  // Gestion du clic sur un article avec toast personnalisé
 const handleArticleClick = (article: Article) => {
  setSelectedArticle(article);
  showArticleToast(`Vous lisez l'article : "${article.title}"`);
};

  const highlight = (id: string) =>
    highlightedId === id
      ? 'ring-4 ring-blue-600 ring-offset-2 scale-[1.01] shadow-lg transition-all duration-500'
      : 'transition-all duration-300';

  return (
    <PageTransition animation="slide-up" duration={0.5}>
      <div className="min-h-screen bg-[#F5F5F5] text-gray-900 flex flex-col">

        {/* HEADER */}
        <Header onNavClick={handleNavigation} activeSection={activeNavSection as string} />

        <main className="max-w-[1440px] mx-auto w-full px-4 md:px-8 py-6">

          {/* INFO BAR - Avec animation au scroll */}
          <RevealOnScroll direction="up" delay={0.1}>
            <motion.div 
              className="mb-6 bg-white border-l-4 border-blue-600 p-4 rounded-r-md flex flex-col sm:flex-row justify-between gap-4 shadow-sm"
              whileHover={{ boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase">
                  PASS AFRICA OFFICIEL
                </p>
                <p className="text-sm font-semibold">
                  PASS EVALA 2026 — Suivi en direct des luttes traditionnelles
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#1a56db' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation('calendar')}
                className="bg-black text-white px-3 py-2 text-xs uppercase font-bold flex items-center gap-2 cursor-pointer hover:bg-blue-600 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Programme
              </motion.button>
            </motion.div>
          </RevealOnScroll>

          {/* GRID SYSTEM - Avec animations */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >

            {/* LEFT SIDEBAR - Animation depuis la gauche */}
            <motion.aside 
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="sticky top-24 flex flex-col gap-6">

                <RevealOnScroll direction="right" delay={0.1}>
                  <motion.div 
                    className="rounded-sm"
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    / <SponsorBanner /> 
                  </motion.div>
                </RevealOnScroll>

                <RevealOnScroll direction="right" delay={0.2}>
                  <div
                    id="component-flash-info-wrapper"
                    className={highlight('component-flash-info-wrapper')}
                  >
                    <FlashInfoFeed onFlashInfoClick={setSelectedFlashInfo} />
                  </div>
                </RevealOnScroll>

                <RevealOnScroll direction="right" delay={0.3}>
                  <div
                    id="component-useful-numbers-wrapper"
                    className={highlight('component-useful-numbers-wrapper')}
                  >
                    <UsefulNumbersStack />
                  </div>
                </RevealOnScroll>

              </div>
            </motion.aside>

            {/* CENTER - NEWS - Animation depuis le centre */}
            <motion.section
              id="component-news-section-wrapper"
              className={`lg:col-span-6 ${highlight('component-news-section-wrapper')}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <RevealOnScroll direction="up" delay={0.1}>
                <NewsSection onArticleClick={handleArticleClick} />
              </RevealOnScroll>
            </motion.section>

            {/* RIGHT SIDEBAR - Animation depuis la droite */}
            <motion.aside 
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="sticky top-24 flex flex-col gap-6">

                <RevealOnScroll direction="left" delay={0.1}>
                  <motion.div
                    id="component-fil-evala-wrapper"
                    className={highlight('component-fil-evala-wrapper')}
                    whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <FilEvalaShorts />
                  </motion.div>
                </RevealOnScroll>

                <RevealOnScroll direction="left" delay={0.2}>
                  <motion.div
                    id="component-bons-plans-wrapper"
                    className={highlight('component-bons-plans-wrapper')}
                    whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <BonsPlansKara />
                  </motion.div>
                </RevealOnScroll>

              </div>
            </motion.aside>

          </motion.div>
        </main>

        <Footer />

        {/* MODALS - Avec animations */}
        <AnimatePresence mode="wait">
          {selectedArticle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArticleModal
                article={selectedArticle}
                onClose={() => setSelectedArticle(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {selectedFlashInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FlashInfoModal
                flashInfo={selectedFlashInfo}
                onClose={() => setSelectedFlashInfo(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>


        <AnimatePresence mode="wait">
          {isCalendarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CalendarModal onClose={() => setIsCalendarOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}