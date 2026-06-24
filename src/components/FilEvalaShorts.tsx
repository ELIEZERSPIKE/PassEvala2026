import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Short } from '../types';
import { shortService } from '../services';
import { Play, RotateCcw, Volume2, VolumeX, Plus } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import { Link } from 'react-router-dom';

// ─── Player individuel ────────────────────────────────────────────────────────

interface ShortPlayerProps {
  short: Short;
  isActive: boolean;
}

const ShortPlayer: React.FC<ShortPlayerProps> = ({ short, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [muted, setMuted] = useState(true);

  const videoUrl = getImageUrl(short.processed_path, '');
  const thumbUrl = getImageUrl(short.thumbnail_path, '');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive && state !== 'ended') {
      video.play().catch(() => {});
      setState('playing');
    } else {
      video.pause();
      if (!isActive) {
        video.currentTime = 0;
        setState('idle');
      }
    }
  }, [isActive]);

  const handleReplay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
    setState('playing');
  }, []);

  const handleClick = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (state === 'ended') { handleReplay(); return; }
    if (state === 'playing') {
      video.pause();
      setState('idle');
    } else {
      video.play().catch(() => {});
      setState('playing');
    }
  }, [state, handleReplay]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Vidéo */}
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbUrl || undefined}
          muted={muted}
          playsInline
          loop={false}
          onClick={handleClick}
          onEnded={() => setState('ended')}
          className="w-full h-full object-contain cursor-pointer"
        />
      )}

      {/* Overlay pause/play */}
      {state === 'idle' && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={handleClick}
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.45)', border: '2px solid rgba(255,255,255,0.3)' }}>
            <Play className="w-9 h-9 text-white fill-current ml-1" />
          </div>
        </div>
      )}

      {/* Overlay replay */}
      {state === 'ended' && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={handleReplay}
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(212,130,42,0.85)', border: '2px solid rgba(255,255,255,0.4)' }}>
              <RotateCcw className="w-9 h-9 text-white" />
            </div>
            <span className="text-white text-xs font-bold uppercase tracking-widest">Rejouer</span>
          </div>
        </div>
      )}

      {/* Infos en bas */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-12"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white"
            style={{ background: '#8B2500' }}>
            {short.user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <span className="text-white text-xs font-bold">{short.user?.name ?? 'Inconnu'}</span>
          <span className="text-xs" style={{ color: '#D4822A' }}>@{short.user?.username ?? 'user'}</span>
        </div>
        {short.text && (
          <p className="text-white text-xs leading-relaxed line-clamp-2">{short.text}</p>
        )}
        {short.duration && (
          <span className="text-[10px] font-mono mt-1 block" style={{ color: '#8C6A52' }}>
            0:{short.duration.toString().padStart(2, '0')}
          </span>
        )}
      </div>

      {/* Bouton mute */}
      <button
        onClick={(e) => { e.stopPropagation(); setMuted(m => !m); }}
        className="absolute top-3 right-3 p-2 rounded-full"
        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        {muted
          ? <VolumeX className="w-4 h-4 text-white" />
          : <Volume2 className="w-4 h-4 text-white" />
        }
      </button>
    </div>
  );
};

// ─── Composant principal ──────────────────────────────────────────────────────

export default function FilEvalaShorts() {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    shortService.getShorts()
      .then((data: Short[]) => {
        setShorts(data.filter(s => s.status === 'published'));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || shorts.length === 0) return;

    const slides = container.querySelectorAll<HTMLElement>('[data-short]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.short);
            setActiveIndex(index);
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    slides.forEach(slide => observer.observe(slide));
    return () => observer.disconnect();
  }, [shorts]);

  if (shorts.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-3" id="component-fil-evala">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <h2 className="font-display font-black text-base text-[#222222] uppercase tracking-wide flex items-center gap-2">
          <Play className="w-4 h-4 text-red-600 fill-current" />
          Fil Evala
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-sm uppercase tracking-widest animate-pulse">
            Shorts
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

      {/* Container scroll */}
      <div
        ref={containerRef}
        className="w-full rounded-lg overflow-hidden"
        style={{
          height: '400px',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {shorts.map((short, i) => (
          <div
            key={short.id}
            data-short={i}
            style={{ height: '400px', scrollSnapAlign: 'start' }}
          >
            <ShortPlayer short={short} isActive={i === activeIndex} />
          </div>
        ))}
      </div>
    </div>
  );
}







// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Short } from '../types';
// import { shortService } from '../services';
// import { Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
// import { getImageUrl } from '../utils/imageUtils';

// // ─── Player individuel ────────────────────────────────────────────────────────

// interface ShortPlayerProps {
//   short: Short;
//   isActive: boolean;
// }

// const ShortPlayer: React.FC<ShortPlayerProps> = ({ short, isActive }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [state, setState] = useState<'idle' | 'playing' | 'ended'>('idle');
//   const [muted, setMuted] = useState(true);

//   const videoUrl = getImageUrl(short.processed_path, '');
//   const thumbUrl = getImageUrl(short.thumbnail_path, '');

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (isActive && state !== 'ended') {
//       video.play().catch(() => {});
//       setState('playing');
//     } else {
//       video.pause();
//       if (!isActive) {
//         video.currentTime = 0;
//         setState('idle');
//       }
//     }
//   }, [isActive]);

//   const handleReplay = useCallback(() => {
//     const video = videoRef.current;
//     if (!video) return;
//     video.currentTime = 0;
//     video.play().catch(() => {});
//     setState('playing');
//   }, []);

//   const handleClick = useCallback(() => {
//     const video = videoRef.current;
//     if (!video) return;
//     if (state === 'ended') { handleReplay(); return; }
//     if (state === 'playing') {
//       video.pause();
//       setState('idle');
//     } else {
//       video.play().catch(() => {});
//       setState('playing');
//     }
//   }, [state, handleReplay]);

//   return (
//     <div className="relative w-full h-full bg-black overflow-hidden">


//       {/* Vidéo */}
//       {videoUrl && (
//         <video
//           ref={videoRef}
//           src={videoUrl}
//           poster={thumbUrl || undefined}
//           muted={muted}
//           playsInline
//           loop={false}
//           onClick={handleClick}
//           onEnded={() => setState('ended')}
//           className="w-full h-full object-contain cursor-pointer"
//         />
//       )}

//       {/* Overlay pause/play */}
//       {state === 'idle' && (
//         <div
//           className="absolute inset-0 flex items-center justify-center cursor-pointer"
//           onClick={handleClick}
//         >
//           <div className="w-20 h-20 rounded-full flex items-center justify-center"
//             style={{ background: 'rgba(0,0,0,0.45)', border: '2px solid rgba(255,255,255,0.3)' }}>
//             <Play className="w-9 h-9 text-white fill-current ml-1" />
//           </div>
//         </div>
//       )}

//       {/* Overlay replay */}
//       {state === 'ended' && (
//         <div
//           className="absolute inset-0 flex items-center justify-center cursor-pointer"
//           onClick={handleReplay}
//           style={{ background: 'rgba(0,0,0,0.5)' }}
//         >
//           <div className="flex flex-col items-center gap-3">
//             <div className="w-20 h-20 rounded-full flex items-center justify-center"
//               style={{ background: 'rgba(212,130,42,0.85)', border: '2px solid rgba(255,255,255,0.4)' }}>
//               <RotateCcw className="w-9 h-9 text-white" />
//             </div>
//             <span className="text-white text-xs font-bold uppercase tracking-widest">Rejouer</span>
//           </div>
//         </div>
//       )}

//       {/* Infos en bas */}
//       <div
//         className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-12"
//         style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}
//       >
//         <div className="flex items-center gap-2 mb-1">
//           <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white"
//             style={{ background: '#8B2500' }}>
//             {short.user?.name?.charAt(0).toUpperCase() ?? 'U'}
//           </div>
//           <span className="text-white text-xs font-bold">{short.user?.name ?? 'Inconnu'}</span>
//           <span className="text-xs" style={{ color: '#D4822A' }}>@{short.user?.username ?? 'user'}</span>
//         </div>
//         {short.text && (
//           <p className="text-white text-xs leading-relaxed line-clamp-2">{short.text}</p>
//         )}
//         {short.duration && (
//           <span className="text-[10px] font-mono mt-1 block" style={{ color: '#8C6A52' }}>
//             0:{short.duration.toString().padStart(2, '0')}
//           </span>
//         )}
//       </div>

//       {/* Bouton mute */}
//       <button
//         onClick={(e) => { e.stopPropagation(); setMuted(m => !m); }}
//         className="absolute top-3 right-3 p-2 rounded-full"
//         style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)' }}
//       >
//         {muted
//           ? <VolumeX className="w-4 h-4 text-white" />
//           : <Volume2 className="w-4 h-4 text-white" />
//         }
//       </button>
//     </div>
//   );
// };

// // ─── Composant principal ──────────────────────────────────────────────────────

// export default function FilEvalaShorts() {
//   const [shorts, setShorts] = useState<Short[]>([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//   shortService.getShorts()
//     .then((data: Short[]) => {
//       setShorts(data.filter(s => s.status === 'published'));
//     })
//     .catch(console.error);
// }, []);

//   // IntersectionObserver : détecte quel short est visible
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container || shorts.length === 0) return;

//     const slides = container.querySelectorAll<HTMLElement>('[data-short]');

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             const index = Number((entry.target as HTMLElement).dataset.short);
//             setActiveIndex(index);
//           }
//         });
//       },
//       { root: container, threshold: 0.6 }
//     );

//     slides.forEach(slide => observer.observe(slide));
//     return () => observer.disconnect();
//   }, [shorts]);

//   if (shorts.length === 0) return null;

//   // Dans FilEvalaShorts - ajuster la hauteur selon la colonne

//   return (
//     <div className="w-full flex flex-col gap-3" id="component-fil-evala">
//       {/* Header */}
//       <div className="flex items-center justify-between border-b border-gray-200 pb-2">
//         <h2 className="font-display font-black text-base text-[#222222] uppercase tracking-wide flex items-center gap-2">
//           <Play className="w-4 h-4 text-red-600 fill-current" />
//           Fil Evala
//         </h2>
//         <span className="text-[10px] font-mono font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-sm uppercase tracking-widest animate-pulse">
//           Shorts
//         </span>
//       </div>

//       {/* Indicateur de position */}
//       <div className="flex items-center justify-center gap-1.5">
//         {shorts.map((_, i) => (
//           <div
//             key={i}
//             className="rounded-full transition-all duration-300"
//             style={{
//               width: i === activeIndex ? '18px' : '6px',
//               height: '6px',
//               background: i === activeIndex ? '#D4822A' : '#D1C4B8',
//             }}
//           />
//         ))}
//       </div>

//       {/* Container scroll - hauteur ajustée */}
//       <div
//         ref={containerRef}
//         className="w-full rounded-lg overflow-hidden"
//         style={{
//           height: '400px', // Réduit pour mieux s'adapter à la colonne
//           overflowY: 'scroll',
//           scrollSnapType: 'y mandatory',
//           scrollbarWidth: 'none',
//           msOverflowStyle: 'none',
//         }}
//       >
//         {shorts.map((short, i) => (
//           <div
//             key={short.id}
//             data-short={i}
//             style={{ height: '400px', scrollSnapAlign: 'start' }}
//           >
//             <ShortPlayer short={short} isActive={i === activeIndex} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

