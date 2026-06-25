// features/shorts/components/FilEvalaShorts.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShortItem from './ShortItem';

import { usePublicShorts } from '../hooks/usePublicShorts';

const SLIDE_HEIGHT = 400;

// ─── Header sorti du composant → plus d'erreur "implicitly any" ──────────────

interface HeaderProps {
  count?: number;
}

const ShortsHeader: React.FC<HeaderProps> = ({ count }) => (
  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
    <h2 className="font-display font-black text-base text-[#222222] uppercase tracking-wide flex items-center gap-2">
      <Play className="w-4 h-4 text-red-600 fill-current" />
      Fil Evala
    </h2>
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-sm uppercase tracking-widest animate-pulse">
        {count !== undefined ? `${count} Shorts` : 'Shorts'}
      </span>
      <Link
        to="/partager/short"
        className="text-[10px] font-bold bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full transition-colors flex items-center gap-1"
      >
        <Plus className="w-3 h-3" />
        Partager
      </Link>
    </div>
  </div>
);

// ─── Composant principal ──────────────────────────────────────────────────────

export default function FilEvalaShorts() {
  const { shorts, loading } = usePublicShorts();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver — détecte le slide actif
  useEffect(() => {
    const container = containerRef.current;
    if (!container || shorts.length === 0) return;

    const slides = container.querySelectorAll<HTMLElement>('[data-short]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveIndex(Number((entry.target as HTMLElement).dataset.short));
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    slides.forEach(slide => observer.observe(slide));
    return () => observer.disconnect();
  }, [shorts]);
  
  const scrollToIndex = (index: number) => {
  const container = containerRef.current;
  if (!container) return;
  const target = index < 0 ? 0 : index >= shorts.length ? shorts.length - 1 : index;
  const slides = container.querySelectorAll<HTMLElement>('[data-short]');
  slides[target]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

  // ─── États ────────────────────────────────────────────────────────────────

  if (loading && shorts.length === 0) {
    return (
      <div className="w-full flex flex-col gap-3">
        <ShortsHeader />
        <div className="flex items-center justify-center" style={{ height: SLIDE_HEIGHT }}>
          <Loader2 size={32} className="animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div className="w-full flex flex-col gap-3">
        <ShortsHeader />
        <div className="flex items-center justify-center" style={{ height: SLIDE_HEIGHT }}>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Aucun short pour le moment</p>
            <p className="text-gray-300 text-xs">Soyez le premier à publier !</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Affichage ────────────────────────────────────────────────────────────

  return (
    <div className="w-full flex flex-col gap-3" id="component-fil-evala">
      <ShortsHeader count={shorts.length} />

      {/* Indicateur de position */}
      <div className="flex items-center justify-center gap-1.5">
        {shorts.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? '18px' : '6px',
              height: '6px',
              background: i === activeIndex ? '#D4822A' : '#D1C4B8',
            }}
          />
        ))}
      </div>

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="w-full rounded-lg overflow-hidden"
        style={{
          height: SLIDE_HEIGHT,
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {shorts.map((short, i) => (
           <ShortItem
    key={short.id}
    short={short}
    index={i}
    isActive={i === activeIndex}
    onNext={() => scrollToIndex(i + 1)}   
    onPrev={() => scrollToIndex(i - 1)}   
  />
        ))}
      </div>
    </div>
  );
}