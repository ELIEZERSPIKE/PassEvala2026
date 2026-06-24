import React, { useState, useRef } from 'react';
import { Short } from '../types/short';
import { 
  Pencil, Trash2, Video, Clock, CheckCircle, Archive, Loader2, 
  Users, Calendar, Play, Pause, Maximize2, Volume2, VolumeX 
} from 'lucide-react';

const STATUS_CONFIG = {
  draft: { 
    label: 'En traitement', 
    icon: Loader2, 
    className: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    indicator: 'animate-spin'
  },
  published: { 
    label: 'Publié', 
    icon: CheckCircle, 
    className: 'text-green-600 bg-green-50 border-green-200',
    indicator: ''
  },
  archived: { 
    label: 'Archivé', 
    icon: Archive, 
    className: 'text-gray-500 bg-gray-50 border-gray-200',
    indicator: ''
  },
};

interface Props {
  short: Short;
  onEdit: (short: Short) => void;
  onDelete: (id: number) => void;
  canEdit?: boolean;
  viewMode?: 'grid' | 'list';
}

const ShortCard: React.FC<Props> = ({ short, onEdit, onDelete, canEdit, viewMode = 'grid' }) => {
  const status = STATUS_CONFIG[short.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.draft;
  const StatusIcon = status.icon;
  
  // ✅ État pour le hover vidéo
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  // ✅ Gestion de la lecture vidéo au survol
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current && short.processed_path) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // ✅ URL de la vidéo
  const videoUrl = short.processed_path 
    ? `http://localhost:8000/storage/${short.processed_path}`
    : null;

  // Version grille
  if (viewMode === 'grid') {
    return (
      <div 
        className={`group border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 ${
          short.status === 'draft' ? 'border-yellow-300 bg-yellow-50/30' : 'hover:border-gray-300'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Indicateur de statut (en haut) */}
        {short.status === 'draft' && (
          <div className="flex items-center gap-2 text-xs text-yellow-600 bg-yellow-100/50 px-2.5 py-1.5">
            <Loader2 size={12} className="animate-spin" />
            <span>Traitement en cours...</span>
          </div>
        )}

        {/* ✅ Miniature / Vidéo avec hover */}
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          {videoUrl && short.status === 'published' ? (
            <>
              <video
                ref={videoRef}
                src={videoUrl}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isHovering ? 'opacity-100' : 'opacity-0'
                }`}
                muted={isMuted}
                loop
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {/* ✅ Aperçu statique (visible quand pas en hover) */}
              {short.thumbnail_path && !isHovering && (
                <img 
                  src={`http://localhost:8000/storage/${short.thumbnail_path}`}
                  alt="Miniature"
                  className="w-full h-full object-cover absolute inset-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              
              {/* ✅ Fallback si pas de miniature */}
              {!short.thumbnail_path && !isHovering && (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 absolute inset-0">
                  <Video size={32} className="text-gray-300" />
                </div>
              )}

              {/* ✅ Overlay de lecture au survol */}
              {isHovering && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300">
                  <button
                    onClick={togglePlay}
                    className="p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transform hover:scale-110 transition-all duration-200"
                  >
                    {isPlaying ? (
                      <Pause size={24} className="text-gray-800" />
                    ) : (
                      <Play size={24} className="text-gray-800" />
                    )}
                  </button>
                </div>
              )}

              {/* ✅ Contrôles vidéo au survol */}
              {isHovering && (
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <button
                    onClick={toggleMute}
                    className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </div>
              )}
            </>
          ) : (
            // ✅ Pas de vidéo disponible (draft ou erreur)
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              {short.thumbnail_path ? (
                <img 
                  src={`http://localhost:8000/storage/${short.thumbnail_path}`}
                  alt="Miniature"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <Video size={32} className="text-gray-300" />
              )}
            </div>
          )}

          {/* ✅ Badge de durée */}
          {short.duration && (
            <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
              <Play size={10} />
              {formatDuration(short.duration)}
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-3 space-y-2">
          <p className="text-sm text-gray-800 line-clamp-2 font-medium">
            {short.text ?? <span className="text-gray-400 italic font-normal">Aucun texte</span>}
          </p>
          
          {/* Métadonnées */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${status.className}`}>
              <StatusIcon size={11} className={status.indicator || ''} />
              {status.label}
            </span>
            {short.user && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Users size={11} />
                @{short.user.username}
              </span>
            )}
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar size={11} />
              {formatDate(short.created_at)}
            </span>
          </div>

          {/* Actions */}
          {canEdit && (
            <div className="flex items-center justify-end gap-1 pt-2 border-t border-gray-100 mt-2">
              <button 
                onClick={() => onEdit(short)} 
                className="text-gray-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                title="Modifier"
              >
                <Pencil size={15} />
              </button>
              <button 
                onClick={() => onDelete(short.id)} 
                className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                title="Supprimer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Barre de progression */}
        {short.status === 'draft' && (
          <div className="h-0.5 bg-gray-200 overflow-hidden">
            <div className="h-full bg-yellow-400 animate-pulse" style={{ width: '60%' }} />
          </div>
        )}
      </div>
    );
  }

  // Version liste
  return (
    <div 
      className={`group border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 ${
        short.status === 'draft' ? 'border-yellow-300 bg-yellow-50/30' : 'hover:border-gray-300'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-start gap-4 p-4">
        {/* ✅ Miniature vidéo avec hover (version liste) */}
        <div 
          className="relative w-32 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {videoUrl && short.status === 'published' ? (
            <>
              <video
                ref={videoRef}
                src={videoUrl}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isHovering ? 'opacity-100' : 'opacity-0'
                }`}
                muted={isMuted}
                loop
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {short.thumbnail_path && !isHovering && (
                <img 
                  src={`http://localhost:8000/storage/${short.thumbnail_path}`}
                  alt="Miniature"
                  className="w-full h-full object-cover absolute inset-0"
                />
              )}
              
              {!short.thumbnail_path && !isHovering && (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 absolute inset-0">
                  <Video size={20} className="text-gray-300" />
                </div>
              )}

              {isHovering && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-full bg-white/90 hover:bg-white shadow-lg"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              {short.thumbnail_path ? (
                <img 
                  src={`http://localhost:8000/storage/${short.thumbnail_path}`}
                  alt="Miniature"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Video size={20} className="text-gray-300" />
              )}
            </div>
          )}

          {short.duration && (
            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Play size={8} />
              {formatDuration(short.duration)}
            </div>
          )}
        </div>

        {/* Contenu liste */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-gray-800 line-clamp-1 font-medium">
              {short.text ?? <span className="text-gray-400 italic font-normal">Aucun texte</span>}
            </p>
            {canEdit && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <button 
                  onClick={() => onEdit(short)} 
                  className="text-gray-400 hover:text-blue-600 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button 
                  onClick={() => onDelete(short.id)} 
                  className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${status.className}`}>
              <StatusIcon size={10} className={status.indicator || ''} />
              {status.label}
            </span>
            {short.user && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Users size={11} />
                @{short.user.username}
              </span>
            )}
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar size={11} />
              {formatDate(short.created_at)}
            </span>
          </div>
        </div>
      </div>

      {short.status === 'draft' && (
        <div className="h-0.5 bg-gray-200 overflow-hidden">
          <div className="h-full bg-yellow-400 animate-pulse" style={{ width: '60%' }} />
        </div>
      )}
    </div>
  );
};

export default ShortCard;