// features/shorts/components/ShortGuard.tsx
import React, { forwardRef } from 'react';
import { Short } from '../types/short';
import ShortPlayer, { ShortPlayerHandle } from './ShortPlayer';

interface Props {
  short: Short;
  isActive: boolean;
}

const ShortGuard = forwardRef<ShortPlayerHandle, Props>(({ short, isActive }, ref) => {
  if (!short.processed_path && !short.raw_path) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-sm"> Vidéo indisponible</p>
          <p className="text-white/30 text-xs mt-1">Une erreur est survenue</p>
        </div>
      </div>
    );
  }

  if (!short.processed_path && short.status === 'published') {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent mx-auto mb-4" />
          <p className="text-white text-sm font-medium"> Traitement en cours</p>
          <p className="text-white/50 text-xs mt-1">Optimisation de la vidéo...</p>
          {short.duration && (
            <p className="text-white/30 text-[10px] mt-2">Durée : {Math.round(short.duration)}s</p>
          )}
        </div>
      </div>
    );
  }

  return <ShortPlayer ref={ref} short={short} isActive={isActive} />;
});

ShortGuard.displayName = 'ShortGuard';
export default ShortGuard;