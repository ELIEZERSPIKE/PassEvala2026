import React, { useRef, useState, useCallback } from 'react';
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

// ✅ Composant pour le drag & drop
const DragDropZone: React.FC<{
  onFileDrop: (file: File) => void;
  children: React.ReactNode;
  isDragging: boolean;
}> = ({ onFileDrop, children, isDragging }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileDrop(files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative transition-all duration-200 ${
        isDragging ? 'ring-2 ring-blue-500 ring-offset-2 scale-[1.01]' : ''
      }`}
    >
      {children}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <span className="text-blue-600 font-medium">📥 Déposez votre vidéo ici</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Composant pour la prévisualisation de la vidéo
const VideoPreview: React.FC<{ file: File; onRemove: () => void }> = ({ file, onRemove }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const url = URL.createObjectURL(file);

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
      
      {/* Overlay avec infos */}
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
};

const ShortForm: React.FC<Props> = ({ initial, onSubmit, onCancel, loading }) => {
  const { form, errors, isEdit, handleChange, validate, reset, getPayload } = useShortForm(initial);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  
  // ✅ Fusion des erreurs
  const allErrors = { ...errors, ...serverErrors };

  // ✅ Gestion du drag & drop
  const handleFileDrop = useCallback((file: File) => {
    if (file.type.startsWith('video/')) {
      handleChangeWithClear('video', file);
    } else {
      setServerErrors({ video: 'Le fichier doit être une vidéo' });
    }
  }, []);

  const handleChangeWithClear = (field: keyof typeof form, value: any) => {
    handleChange(field, value);
    setServerErrors({});
    setUploadProgress(0);
  };

  // ✅ Upload avec progression simulée
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || loading) return;
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      console.log('Erreurs de validation:', validationErrors);
      return;
    }

    // ✅ Simulation de progression
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 95) {
        progress = 95;
        clearInterval(progressInterval);
      }
      setUploadProgress(Math.min(progress, 95));
    }, 200);

    try {
      setIsSubmitting(true);
      const payload = getPayload();
      await onSubmit(payload);
      
      // ✅ Progression à 100%
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 500);
      
      if (!isEdit) reset();
      
    } catch (error) {
      console.error('❌ Erreur lors de la soumission:', error);
      
      const err = error as AxiosError;
      
      if (err.response?.data?.errors) {
        setServerErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setServerErrors({ general: err.response.data.message });
      } else if (err.message) {
        setServerErrors({ general: err.message });
      }
    } finally {
      setIsSubmitting(false);
      clearInterval(progressInterval);
    }
  };

  // ✅ Formater la taille du fichier
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Texte */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Texte <span className="text-gray-400 font-normal">(optionnel)</span>
        </label>
        <textarea
          value={form.text}
          onChange={e => handleChangeWithClear('text', e.target.value)}
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
            onChange={e => handleChangeWithClear('status', e.target.value)}
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

        <DragDropZone onFileDrop={handleFileDrop} isDragging={isDragging}>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragging 
                ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' 
                : form.video 
                  ? 'border-green-500 bg-green-50/30' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
            }`}
          >
            {form.video ? (
              // ✅ Afficher la prévisualisation
              <div className="space-y-3">
                <VideoPreview file={form.video} onRemove={() => handleChangeWithClear('video', null)} />
                <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                  <CheckCircle size={16} />
                  Vidéo sélectionnée
                </div>
              </div>
            ) : (
              // ✅ Zone de dépôt vide
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="p-4 rounded-full bg-blue-50 text-blue-600">
                  <Upload size={32} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {isEdit ? 'Cliquez ou glissez pour remplacer' : 'Cliquez ou glissez pour sélectionner'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    MP4, MOV, AVI, WMV, WebM — max 100 Mo
                  </p>
                </div>
              </div>
            )}
          </div>
        </DragDropZone>

        {/* ✅ Barre de progression */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Upload en cours...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* ✅ Indicateur de taille du fichier */}
        {form.video && uploadProgress === 0 && (
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <FileVideo size={12} />
              {formatFileSize(form.video.size)}
            </span>
            <span className="flex items-center gap-1">
              <Video size={12} />
              {form.video.type || 'Format inconnu'}
            </span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv,video/webm"
          onChange={e => {
            const file = e.target.files?.[0] ?? null;
            if (file) handleChangeWithClear('video', file);
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
          className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {(loading || isSubmitting) && <Loader2 size={16} className="animate-spin" />}
          {loading || isSubmitting 
            ? 'Enregistrement...' 
            : isEdit 
              ? 'Mettre à jour' 
              : 'Publier le short'
          }
        </button>
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default ShortForm;




// import React, { useRef, useState } from 'react';
// import { Upload, X } from 'lucide-react';
// import { Short, ShortPayload, ShortUpdatePayload } from '../types/short';
// import { useShortForm } from '../hooks/useShortForm';

// // Interface pour les erreurs
// interface AxiosError {
//   response?: {
//     data?: {
//       errors?: Record<string, string>;
//       message?: string;
//     };
//     status?: number;
//   };
//   message?: string;
// }

// interface Props {
//   initial?: Short;
//   onSubmit: (data: ShortPayload | ShortUpdatePayload) => Promise<void>;
//   onCancel?: () => void;
//   loading?: boolean;
// }

// const STATUS_OPTIONS = [
//   { label: 'Brouillon', value: 'draft' },
//   { label: 'Publié', value: 'published' },
//   { label: 'Archivé', value: 'archived' },
// ];

// const ShortForm: React.FC<Props> = ({ initial, onSubmit, onCancel, loading }) => {
//   // ✅ Utilisation du hook
//   const { form, errors, isEdit, handleChange, validate, reset, getPayload } = useShortForm(initial);
  
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // ✅ Vérifier si déjà en cours
//     if (isSubmitting || loading) return;
    
//     // ✅ Récupérer les erreurs de validation
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       console.log('Erreurs de validation:', validationErrors);
//       return;
//     }

//     try {
//       setIsSubmitting(true);
      
//       // ✅ Récupérer le payload depuis le hook
//       const payload = getPayload();
//       console.log('📤 Payload envoyé:', payload);
      
//       await onSubmit(payload);
//       if (!isEdit) reset();
      
//     } catch (error) {
//       console.error('❌ Erreur lors de la soumission:', error);
      
//       const err = error as AxiosError;
      
//       if (err.response?.data?.errors) {
//         // ✅ Les erreurs sont déjà gérées par le hook
//         // On les met à jour via handleChange ou on les affiche
//         const errorMessages = err.response.data.errors;
//         // On peut les afficher via un état local ou via le hook
//         // Mais le hook a déjà ses propres erreurs
//         // On va les ajouter manuellement
//         // Pour ça, on peut créer une fonction setErrors dans le hook
//         // Ou on les gère localement
//         console.error('Erreurs de validation serveur:', errorMessages);
//         // On affiche les erreurs serveur
//         setServerErrors(errorMessages);
//       } else if (err.response?.data?.message) {
//         setServerErrors({ general: err.response.data.message });
//       } else if (err.message) {
//         setServerErrors({ general: err.message });
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ✅ État local pour les erreurs serveur (complète les erreurs du hook)
//   const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  
//   // ✅ Fusionner les erreurs du hook et les erreurs serveur
//   const allErrors = { ...errors, ...serverErrors };

//   // ✅ Effacer les erreurs serveur quand le formulaire change
//   const handleChangeWithClear = (field: keyof typeof form, value: any) => {
//     handleChange(field, value);
//     setServerErrors({});
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       {/* Texte */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Texte <span className="text-gray-400 font-normal">(optionnel)</span>
//         </label>
//         <textarea
//           value={form.text}
//           onChange={e => handleChangeWithClear('text', e.target.value)}
//           rows={3}
//           className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//           placeholder="Décrivez votre short..."
//         />
//         {allErrors.text && <p className="text-red-500 text-xs mt-1">{allErrors.text}</p>}
//       </div>

//       {/* Statut (edit uniquement) */}
//       {isEdit && (
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
//           <select
//             value={form.status}
//             onChange={e => handleChangeWithClear('status', e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             {STATUS_OPTIONS.map(opt => (
//               <option key={opt.value} value={opt.value}>{opt.label}</option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Upload vidéo */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Vidéo {isEdit && <span className="text-gray-400 font-normal">(optionnel)</span>}
//         </label>
//         <div
//           onClick={() => fileInputRef.current?.click()}
//           className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
//         >
//           {form.video ? (
//             <div className="flex items-center justify-between px-2">
//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-gray-700 truncate">{form.video.name}</span>
//                 <span className="text-xs text-gray-400">
//                   ({(form.video.size / (1024 * 1024)).toFixed(2)} Mo)
//                 </span>
//               </div>
//               <button
//                 type="button"
//                 onClick={e => { 
//                   e.stopPropagation(); 
//                   handleChangeWithClear('video', null);
//                   if (fileInputRef.current) {
//                     fileInputRef.current.value = '';
//                   }
//                 }}
//                 className="ml-2 text-gray-400 hover:text-red-500"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center gap-2 text-gray-400">
//               <Upload size={24} />
//               <span className="text-sm">
//                 {isEdit ? 'Cliquez pour remplacer la vidéo' : 'Cliquez pour sélectionner une vidéo'}
//               </span>
//               <span className="text-xs">MP4, MOV, AVI, WMV, WebM — max 100 Mo</span>
//             </div>
//           )}
//         </div>
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv,video/webm"
//           onChange={e => {
//             const file = e.target.files?.[0] ?? null;
//             handleChangeWithClear('video', file);
//           }}
//           className="hidden"
//         />
//         {allErrors.video && <p className="text-red-500 text-xs mt-1">{allErrors.video}</p>}
//         {allErrors.general && <p className="text-red-500 text-xs mt-1">{allErrors.general}</p>}
//       </div>

//       {/* Boutons */}
//       <div className="flex gap-3 pt-2">
//         <button
//           type="submit"
//           disabled={loading || isSubmitting}
//           className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {loading || isSubmitting ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Publier le short'}
//         </button>
//         {onCancel && (
//           <button 
//             type="button" 
//             onClick={onCancel}
//             className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50"
//           >
//             Annuler
//           </button>
//         )}
//       </div>
//     </form>
//   );
// };

// export default ShortForm;



