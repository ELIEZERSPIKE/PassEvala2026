// features/shorts/components/FilEvalaShorts.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Short } from '@/features/shorts/types/short';
import shortService from '@/features/shorts/services/shortService';
import ShortItem from '@/features/shorts/components/ShortItem';

const SLIDE_HEIGHT = 400;

// ─── Header ──────────────────────────────────────────────────────────────────

interface HeaderProps { 
  count?: number; 
  isLoading?: boolean;
}

const ShortsHeader: React.FC<HeaderProps> = ({ count, isLoading }) => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center justify-between border-b pb-3"
    style={{ borderColor: 'rgba(59, 130, 246, 0.2)' }}
  >
    <h2 className="font-bold text-base uppercase tracking-wide flex items-center gap-2"
      style={{ color: '#1A2A4A' }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
      >
        <Play className="w-4 h-4" style={{ color: '#2563EB', fill: '#2563EB' }} />
      </motion.div>
      <span className="font-display font-black tracking-wide" style={{ color: '#0A1628' }}>
        Fil <span style={{ color: '#2563EB' }}>Evala</span>
      </span>
    </h2>
    <div className="flex items-center gap-2">
      <motion.span 
        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
        style={{ 
          background: 'rgba(37, 99, 235, 0.1)',
          color: '#2563EB',
          border: '1px solid rgba(37, 99, 235, 0.2)',
        }}
        whileHover={{ scale: 1.05 }}
      >
        {isLoading ? 'Chargement...' : count !== undefined ? `${count} Shorts` : 'Shorts'}
      </motion.span>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to="/partager/short"
          className="text-[10px] font-bold px-3 py-1 rounded-full transition-all flex items-center gap-1"
          style={{ 
            background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
            color: '#FFFFFF',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
          }}
        >
          <Plus className="w-3 h-3" />
          Partager
        </Link>
      </motion.div>
    </div>
  </motion.div>
);

// ─── Composant principal ──────────────────────────────────────────────────────

export default function FilEvalaShorts() {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // ─── Chargement ───────────────────────────────────────────────────────────

  const loadShorts = useCallback(async () => {
    try {
      const response = await shortService.getPublicShorts();
      setShorts(response.data.filter(s => s.status === 'published'));
    } catch (err) {
      console.error('❌ Erreur chargement shorts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadShorts(); }, [loadShorts]);

  // ─── IntersectionObserver ─────────────────────────────────────────────────

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

  // ─── Navigation clavier (scroll programmatique) ───────────────────────────

  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const target = Math.max(0, Math.min(index, shorts.length - 1));
    const slides = container.querySelectorAll<HTMLElement>('[data-short]');
    slides[target]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [shorts.length]);

  // ─── États ────────────────────────────────────────────────────────────────

  if (loading && shorts.length === 0) {
    return (
      <div className="w-full flex flex-col gap-3">
        <ShortsHeader isLoading={true} />
        <motion.div 
          className="flex items-center justify-center rounded-xl"
          style={{ 
            height: SLIDE_HEIGHT,
            background: 'rgba(37, 99, 235, 0.05)',
            border: '2px dashed rgba(37, 99, 235, 0.2)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={32} style={{ color: '#2563EB' }} />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div className="w-full flex flex-col gap-3">
        <ShortsHeader count={0} />
        <motion.div 
          className="flex items-center justify-center rounded-xl"
          style={{ 
            height: SLIDE_HEIGHT,
            background: 'rgba(37, 99, 235, 0.05)',
            border: '2px dashed rgba(37, 99, 235, 0.2)',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ 
                background: 'rgba(37, 99, 235, 0.1)',
                border: '2px solid rgba(37, 99, 235, 0.2)',
              }}
            >
              <Play className="w-8 h-8" style={{ color: '#2563EB' }} />
            </motion.div>
            <p className="text-sm font-medium" style={{ color: '#1A2A4A' }}>
              Aucun short pour le moment
            </p>
            <p className="text-xs mt-1" style={{ color: '#93A8C9' }}>
              Soyez le premier à publier !
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Affichage ────────────────────────────────────────────────────────────

  return (
    <motion.div 
      className="w-full flex flex-col gap-3" 
      id="component-fil-evala"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ShortsHeader count={shorts.length} />

      {/* ❌ Suppression des indicateurs de progression */}

      {/* Scroll container */}
      <motion.div
        ref={containerRef}
        className="w-full rounded-xl overflow-hidden"
        style={{
          height: SLIDE_HEIGHT,
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          border: '1px solid rgba(37, 99, 235, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 20, 60, 0.1)',
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
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
      </motion.div>
    </motion.div>
  );
}








// features/shorts/components/FilEvalaShorts.tsx
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Play, Plus, Loader2 } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { Short } from '@/features/shorts/types/short';
// import shortService from '@/features/shorts/services/shortService';
//  import ShortItem from '@/features/shorts/components/ShortItem';



// const SLIDE_HEIGHT = 400;


// interface HeaderProps { count?: number; }

// const ShortsHeader: React.FC<HeaderProps> = ({ count }) => (
//   <div className="flex items-center justify-between border-b border-gray-200 pb-2">
//     <h2 className="font-display font-black text-base text-[#222222] uppercase tracking-wide flex items-center gap-2">
//       <Play className="w-4 h-4 text-red-600 fill-current" />
//       Fil Evala
//     </h2>
//     <div className="flex items-center gap-2">
//       <span className="text-[10px] font-mono font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-sm uppercase tracking-widest animate-pulse">
//         {count !== undefined ? `${count} Shorts` : 'Shorts'}
//       </span>
//       <Link
//         to="/partager/short"
//         className="text-[10px] font-bold bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full transition-colors flex items-center gap-1"
//       >
//         <Plus className="w-3 h-3" />
//         Partager
//       </Link>
//     </div>
//   </div>
// );

// // ─── Composant principal ──────────────────────────────────────────────────────

// export default function FilEvalaShorts() {
//   const [shorts, setShorts] = useState<Short[]>([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // ─── Chargement ───────────────────────────────────────────────────────────

//   const loadShorts = useCallback(async () => {
//     try {
//       const response = await shortService.getPublicShorts();
//       setShorts(response.data.filter(s => s.status === 'published'));
//     } catch (err) {
//       console.error('❌ Erreur chargement shorts:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { loadShorts(); }, [loadShorts]);

//   // ─── IntersectionObserver ─────────────────────────────────────────────────

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container || shorts.length === 0) return;

//     const slides = container.querySelectorAll<HTMLElement>('[data-short]');
//     const observer = new IntersectionObserver(
//       entries => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             setActiveIndex(Number((entry.target as HTMLElement).dataset.short));
//           }
//         });
//       },
//       { root: container, threshold: 0.6 }
//     );

//     slides.forEach(slide => observer.observe(slide));
//     return () => observer.disconnect();
//   }, [shorts]);

//   // ─── Navigation clavier (scroll programmatique) ───────────────────────────

//   const scrollToIndex = useCallback((index: number) => {
//     const container = containerRef.current;
//     if (!container) return;
//     const target = Math.max(0, Math.min(index, shorts.length - 1));
//     const slides = container.querySelectorAll<HTMLElement>('[data-short]');
//     slides[target]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   }, [shorts.length]);

//   // ─── États ────────────────────────────────────────────────────────────────

//   if (loading && shorts.length === 0) {
//     return (
//       <div className="w-full flex flex-col gap-3">
//         <ShortsHeader />
//         <div className="flex items-center justify-center" style={{ height: SLIDE_HEIGHT }}>
//           <Loader2 size={32} className="animate-spin text-gray-400" />
//         </div>
//       </div>
//     );
//   }

//   if (shorts.length === 0) {
//     return (
//       <div className="w-full flex flex-col gap-3">
//         <ShortsHeader />
//         <div className="flex items-center justify-center" style={{ height: SLIDE_HEIGHT }}>
//           <div className="text-center">
//             <p className="text-gray-400 text-sm"> Aucun short pour le moment</p>
//             <p className="text-gray-300 text-xs">Soyez le premier à publier !</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ─── Affichage ────────────────────────────────────────────────────────────

//   return (
//     <div className="w-full flex flex-col gap-3" id="component-fil-evala">
//       <ShortsHeader count={shorts.length} />

//       {/* Scroll container */}
//       <div
//         ref={containerRef}
//         className="w-full rounded-lg overflow-hidden"
//         style={{
//           height: SLIDE_HEIGHT,
//           overflowY: 'scroll',
//           scrollSnapType: 'y mandatory',
//           scrollbarWidth: 'none',
//           msOverflowStyle: 'none',
//         }}
//       >
//         {shorts.map((short, i) => (
//           <ShortItem
//             key={short.id}
//             short={short}
//             index={i}
//             isActive={i === activeIndex}
//             onNext={() => scrollToIndex(i + 1)}
//             onPrev={() => scrollToIndex(i - 1)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }








