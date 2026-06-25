// features/shorts/components/ShortPlayer.tsx
import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { Short } from '../types/short';
import getImageUrl from '@/utils/imageUtils';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  short: Short;
  isActive: boolean;
}

export interface ShortPlayerHandle {
  togglePlay: () => void;
}

type PlayState = 'idle' | 'playing' | 'ended';

const ShortPlayer = forwardRef<ShortPlayerHandle, Props>(({ short, isActive }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playState, setPlayState] = useState<PlayState>('idle');
  const [muted, setMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const videoUrl = getImageUrl(short.processed_path, '');
  const thumbUrl = getImageUrl(short.thumbnail_path, '');

  const displayInitial = (short.user?.username ?? short.user?.name ?? 'U').charAt(0).toUpperCase();
  const displayName = short.user?.username || short.user?.name || 'Utilisateur';

  // Gestion automatique de la lecture
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive && playState !== 'ended') {
      video.play().catch((err) => {
        console.error(`❌ Lecture vidéo ${short.id}:`, err);
        setError(err.message);
      });
      setPlayState('playing');
    } else if (!isActive) {
      video.pause();
      video.currentTime = 0;
      setPlayState('idle');
    }
  }, [isActive, short.id]);

  // Gestion du timeout des contrôles
  useEffect(() => {
    if (playState === 'playing') {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = null;
      }
    };
  }, [playState]);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
    if (playState === 'playing') {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [playState]);

  const handleReplay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(console.error);
    setPlayState('playing');
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  const handleClick = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playState === 'ended') {
      handleReplay();
      return;
    }

    if (playState === 'playing') {
      video.pause();
      setPlayState('idle');
      setShowControls(true);
    } else {
      video.play().catch(console.error);
      setPlayState('playing');
      showControlsTemporarily();
    }
  }, [playState, handleReplay, showControlsTemporarily]);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  const handleMuteToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setMuted((m) => !m);
      showControlsTemporarily();
    },
    [showControlsTemporarily]
  );

  useImperativeHandle(ref, () => ({
    togglePlay: handleClick,
  }), [handleClick]);

  // Écouteur pour les touches clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        handleClick();
      }
      if (e.key === 'f') {
        toggleFullscreen();
      }
      if (e.key === 'm') {
        setMuted((m) => !m);
      }
    };

    if (isActive) {
      document.addEventListener('keydown', handleKeyPress);
    }
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isActive, handleClick, toggleFullscreen]);

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  const controlsVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 },
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden"
    >
      {/* Loader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/70 z-10 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 size={48} className="text-[#D4822A]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 backdrop-blur-md"
          >
            <div className="text-center text-white p-6 max-w-sm">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-sm font-medium">{error}</p>
              <p className="text-xs text-gray-400 mt-2">ID : {short.id}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbUrl || undefined}
        muted={muted}
        playsInline
        loop={false}
        onClick={handleClick}
        onEnded={() => setPlayState('ended')}
        onLoadedData={() => {
          setIsLoading(false);
          setError(null);
          showControlsTemporarily();
        }}
        onError={() => {
          setIsLoading(false);
          setError('Impossible de charger la vidéo');
        }}
        className="w-full h-full object-contain cursor-pointer select-none"
      />

      {/* Play/Pause Overlay */}
      <AnimatePresence>
        {playState === 'idle' && !isLoading && !error && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 backdrop-blur-[2px]"
            onClick={handleClick}
          >
            <motion.div
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(212, 130, 42, 0.85)',
                boxShadow: '0 0 40px rgba(212, 130, 42, 0.3)',
                border: '2px solid rgba(255,255,255,0.2)',
              }}
            >
              <Play className="w-10 h-10 text-white fill-current ml-1" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replay Overlay */}
      <AnimatePresence>
        {playState === 'ended' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/60 backdrop-blur-sm"
            onClick={handleReplay}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'rgba(212, 130, 42, 0.9)',
                  boxShadow: '0 0 60px rgba(212, 130, 42, 0.4)',
                  border: '2px solid rgba(255,255,255,0.3)',
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: '2px solid transparent',
                    borderTopColor: 'rgba(255,255,255,0.5)',
                    borderRadius: '50%',
                  }}
                />
                <RotateCcw className="w-10 h-10 text-white relative z-10" />
              </div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white text-sm font-bold uppercase tracking-wider"
              >
                Rejouer
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Info */}
      <motion.div
        variants={controlsVariants}
        initial="hidden"
        animate={showControls ? 'visible' : 'hidden'}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-20"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
        }}
        onMouseEnter={() => {
          setShowControls(true);
          if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
            controlsTimeoutRef.current = null;
          }
        }}
        onMouseLeave={() => {
          if (playState === 'playing') {
            controlsTimeoutRef.current = setTimeout(() => {
              setShowControls(false);
            }, 2000);
          }
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-[#D4822A]"
            style={{ background: '#8B2500' }}
          >
            {displayInitial}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {short.user?.username && (
                <span className="text-sm font-bold" style={{ color: '#D4822A' }}>
                  @{short.user.username}
                </span>
              )}
              {short.user?.name && (
                <span className="text-sm text-white/80 truncate">{short.user.name}</span>
              )}
            </div>
            {short.text && (
              <p className="text-white/90 text-sm leading-relaxed line-clamp-2 mt-1">{short.text}</p>
            )}
          </div>
        </div>

        {short.duration && (
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs font-mono text-[#D4822A]/80">
              {formatDuration(short.duration)}
            </span>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #D4822A, #F4A460)' }}
                initial={{ width: '0%' }}
                animate={{
                  width: playState === 'ended' ? '100%' : playState === 'playing' ? '100%' : '0%',
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Top Controls */}
      <motion.div
        variants={controlsVariants}
        initial="visible"
        animate={showControls ? 'visible' : 'hidden'}
        transition={{ duration: 0.3 }}
        className="absolute top-4 right-4 left-4 flex justify-between items-start z-10"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          className="text-white/60 text-xs font-mono bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full"
        >
          {displayName}
        </motion.div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleMuteToggle}
            className="p-2.5 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {muted ? <VolumeX className="w-4 h-4 text-white/80" /> : <Volume2 className="w-4 h-4 text-white/80" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFullscreen}
            className="p-2.5 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-white/80" />
            ) : (
              <Maximize2 className="w-4 h-4 text-white/80" />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Progress Bar Hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1"
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-full w-full bg-white/5">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: playState === 'ended' ? '100%' : '0%',
              background: 'linear-gradient(90deg, #D4822A, #F4A460)',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
});

// Helper function
const formatDuration = (duration: number): string => {
  const mins = Math.floor(duration / 60);
  const secs = Math.floor(duration % 60);
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `0:${secs.toString().padStart(2, '0')}`;
};

ShortPlayer.displayName = 'ShortPlayer';
export default ShortPlayer;