// features/shorts/components/ShortForm.tsx
import React, { useRef, useState, useCallback, useMemo } from 'react';
import { Upload, X, Video, CheckCircle, AlertCircle, Loader2, FileVideo } from 'lucide-react';
import { Short, ShortPayload, ShortUpdatePayload } from '../types/short';
import { useShortForm } from '../hooks/useShortForm';

interface AxiosError {
  response?: {
    data?: {
      errors?: Record<string, string>;
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

interface Props {
  initial?: Short;
  onSubmit: (data: ShortPayload | ShortUpdatePayload) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

const STATUS_OPTIONS = [
  { label: 'Brouillon', value: 'draft' },
  { label: 'Publié', value: 'published' },
  { label: 'Archivé', value: 'archived' },
];

// ─── VideoPreview optimisé ────────────────────────────────────────────────────

const VideoPreview: React.FC<{ file: File; onRemove: () => void }> = React.memo(({ file, onRemove }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const url = useMemo(() => URL.createObjectURL(file), [file]);

  return (
    <div className="relative group rounded-lg overflow-hidden bg-black/5">
      <video
        ref={videoRef}
        src={url}
        className={`w-full aspect-video object-contain transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        controls
        onLoadedData={() => setIsLoaded(true)}
      />
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <FileVideo size={16} />
            <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span>{(file.size / (1024 * 1024)).toFixed(1)} Mo</span>
            <button
              onClick={onRemove}
              className="p-1.5 rounded-full bg-red-500/80 hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// ─── Composant principal ──────────────────────────────────────────────────────

const ShortForm: React.FC<Props> = ({ initial, onSubmit, onCancel, loading }) => {
  const { form, errors, isEdit, handleChange, validate, reset, getPayload } = useShortForm(initial);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [durationError, setDurationError] = useState<string | null>(null);

  const allErrors = { ...errors, ...serverErrors };

  // ─── Validation durée ──────────────────────────────────────────────────────

  const validateVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        const duration = video.duration;
        URL.revokeObjectURL(video.src);
        resolve(duration);
      };

      video.onerror = () => {
        reject(new Error('Impossible de lire la vidéo'));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  // ─── Simulation progression ────────────────────────────────────────────────

  const simulateProgress = useCallback(() => {
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 8 + 2, 95);
      setUploadProgress(Math.round(progress));
      if (progress >= 95) {
        clearInterval(interval);
        setUploadStatus('processing');
      }
    }, 300);
    
    return interval;
  }, []);

  // ─── Soumission ────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || loading) return;
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      console.log('Erreurs de validation:', validationErrors);
      return;
    }

    const progressInterval = simulateProgress();

    try {
      setIsSubmitting(true);
      await onSubmit(getPayload());
      
      setUploadProgress(100);
      setUploadStatus('done');
      
      setTimeout(() => {
        setUploadProgress(0);
        setUploadStatus('idle');
        if (!isEdit) reset();
      }, 1500);
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      setUploadStatus('error');
      
      const err = error as AxiosError;
      if (err.response?.data?.errors) {
        setServerErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setServerErrors({ general: err.response.data.message });
      } else if (err.message) {
        setServerErrors({ general: err.message });
      }
      
      setTimeout(() => setUploadStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
      clearInterval(progressInterval);
    }
  };

  // ─── Sélection fichier avec validation durée ───────────────────────────────

  const handleFileSelect = useCallback(async (file: File) => {
    if (file.type.startsWith('video/')) {
      try {
        const duration = await validateVideoDuration(file);
        setVideoDuration(duration);

        if (duration > 120) {
          setDurationError(`La vidéo dure ${Math.round(duration)}s. Maximum 120s (2 minutes).`);
          setServerErrors({ video: `Durée maximale : 2 minutes (${Math.round(duration)}s détectées)` });
          return;
        }

        setDurationError(null);
        handleChange('video', file);
        setServerErrors({});
        setUploadProgress(0);
        setUploadStatus('idle');
      } catch {
        setServerErrors({ video: 'Impossible de lire la vidéo' });
      }
    } else {
      setServerErrors({ video: 'Le fichier doit être une vidéo' });
    }
  }, [handleChange]);

  const handleRemoveVideo = useCallback(() => {
    handleChange('video', null);
    setServerErrors({});
    setUploadProgress(0);
    setUploadStatus('idle');
    setVideoDuration(null);
    setDurationError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [handleChange]);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
  }, []);

  // ─── JSX ───────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Texte */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Texte <span className="text-gray-400 font-normal">(optionnel)</span>
        </label>
        <textarea
          value={form.text}
          onChange={e => handleChange('text', e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
          placeholder="Décrivez votre short..."
        />
        {allErrors.text && (
          <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
            <AlertCircle size={12} />
            {allErrors.text}
          </p>
        )}
      </div>

      {/* Statut (edit uniquement) */}
      {isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Statut</label>
          <select
            value={form.status}
            onChange={e => handleChange('status', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Upload vidéo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Vidéo {isEdit && <span className="text-gray-400 font-normal">(optionnel)</span>}
        </label>

        {/* Conseils */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-800 font-medium"> Conseils :</p>
          <ul className="text-xs text-blue-700 mt-1 space-y-0.5">
            <li>• Durée maximale : <strong>2 minutes (120 secondes)</strong></li>
            <li>• Taille maximale : <strong>100 Mo</strong></li>
            <li>• Formats acceptés : MP4, MOV, AVI, WMV, WebM</li>
            <li>• Le traitement peut prendre quelques minutes</li>
          </ul>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const files = e.dataTransfer.files;
            if (files.length > 0) handleFileSelect(files[0]);
          }}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging 
              ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' 
              : form.video 
                ? 'border-green-500 bg-green-50/30' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
          }`}
        >
          {form.video ? (
            <div className="space-y-3">
              <VideoPreview file={form.video} onRemove={handleRemoveVideo} />
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <CheckCircle size={16} />
                Vidéo sélectionnée
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="p-4 rounded-full bg-blue-50 text-blue-600">
                <Upload size={32} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {isEdit ? 'Cliquez ou glissez pour remplacer' : 'Cliquez ou glissez pour sélectionner'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  MP4, MOV, AVI, WMV, WebM — max 100 Mo · max 2 min
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Barre de progression */}
        {uploadProgress > 0 && (
          <div className="mt-4 space-y-2">
            <div className="relative">
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ease-out ${
                    uploadStatus === 'error' ? 'bg-red-500' :
                    uploadStatus === 'done' ? 'bg-green-500' :
                    'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-xs text-gray-500">
                  {uploadStatus === 'uploading' && 'Publication en cours...'}
                  {uploadStatus === 'processing' && 'Traitement...'}
                  {uploadStatus === 'done' && 'Terminé !'}
                  {uploadStatus === 'error' && 'Erreur'}
                </span>
                <span className="text-xs font-mono font-bold text-gray-600">
                  {uploadProgress}%
                </span>
              </div>
            </div>
            {uploadStatus === 'processing' && (
              <div className="flex items-center gap-2 text-xs text-orange-500">
                <Loader2 size={12} className="animate-spin" />
                <span>Optimisation en cours...</span>
              </div>
            )}
          </div>
        )}

        {/* Métadonnées fichier + durée */}
        {form.video && uploadProgress === 0 && uploadStatus === 'idle' && (
          <div className="mt-2 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-gray-400">
              <FileVideo size={12} />
              {formatFileSize(form.video.size)}
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <Video size={12} />
              {form.video.type || 'Format inconnu'}
            </span>
            {videoDuration !== null && (
              <span className={`flex items-center gap-1 ${videoDuration > 120 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                ⏱ {Math.round(videoDuration)}s {videoDuration > 120 && '⚠️ Trop long (max 120s)'}
              </span>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv,video/webm"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            if (file) handleFileSelect(file);
          }}
          className="hidden"
        />
        
        {allErrors.video && (
          <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
            <AlertCircle size={12} />
            {allErrors.video}
          </p>
        )}
        {allErrors.general && (
          <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
            <AlertCircle size={12} />
            {allErrors.general}
          </p>
        )}
      </div>

      {/* Boutons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || isSubmitting || (uploadProgress > 0 && uploadProgress < 100)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {(loading || isSubmitting) && <Loader2 size={16} className="animate-spin" />}
          {loading || isSubmitting 
            ? uploadStatus === 'processing' ? 'Traitement...' : 'Publication...'
            : isEdit ? 'Modifier' : 'Publier le short'
          }
        </button>
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
            disabled={loading || isSubmitting}
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default ShortForm;