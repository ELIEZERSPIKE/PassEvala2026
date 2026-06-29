// pages/profile/ProfileAvatar.tsx
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle, Loader, Camera, Trash2 } from 'lucide-react';
import { profileService, UserProfile } from '../../services/profilService';
import getImageUrl from '../../utils/imageUtils';
import { useAuth } from '../../store/authContext';

const STYLE = {
  page: { minHeight: '100vh', background: 'linear-gradient(160deg, #0A1628 0%, #1A2A4A 100%)' },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(59,130,246,0.2)',
    borderRadius: '1.25rem',
    backdropFilter: 'blur(12px)',
  },
  dropzone: (dragging: boolean) => ({
    border: `2px dashed ${dragging ? '#3B82F6' : 'rgba(59,130,246,0.3)'}`,
    borderRadius: '1rem',
    background: dragging ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)',
    transition: 'all 0.2s',
    cursor: 'pointer',
  }),
};

const MAX_SIZE_MB = 2;

export default function ProfileAvatar() {
  const { updateUser } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getMe();
      setProfile(data);
    } catch (err) {
      console.error('Erreur chargement profil:', err);
    }
  };

  const processFile = (f: File) => {
    if (!f.type.startsWith('image/')) {
      setErrorMsg('Seules les images sont acceptées (JPG, PNG, WEBP)');
      setStatus('error');
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`Fichier trop lourd (max ${MAX_SIZE_MB} Mo)`);
      setStatus('error');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus('idle');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };

    const handleUpload = async () => {
  if (!file) return;

  setUploading(true);
  setStatus('idle');

  try {
    await profileService.uploadAvatar(file);

    const updatedProfile = await profileService.getMe();
    console.log('avatar_url reçu:', updatedProfile.avatar_url);

    setProfile(updatedProfile);

    if (updatedProfile.avatar_url) {
      updateUser({ avatar_url: updatedProfile.avatar_url }); // ← direct, sans cache-buster
    }

    setStatus('success');
    setFile(null);
    setPreview(null);
    setTimeout(() => setStatus('idle'), 2800);

  } catch (err: any) {
    setErrorMsg(err.response?.data?.message || 'Erreur lors de l\'upload');
    setStatus('error');
  } finally {
    setUploading(false);
  }
};

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setStatus('idle');
  };

  const currentAvatar = profile?.avatar_url ? getImageUrl(profile.avatar_url) : null;
  const displayAvatar = preview || currentAvatar;
  const initials = profile?.username?.slice(0, 2).toUpperCase() ?? 
                   profile?.name?.slice(0, 2).toUpperCase() ?? '??';

  return (
    <div style={STYLE.page} className="py-12 px-4">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#60A5FA' }}>Profil</p>
          <h1 className="text-3xl font-black flex items-center gap-3" style={{ color: '#F0F7FF' }}>
            <Camera className="w-7 h-7" style={{ color: '#60A5FA' }} />
            Mon avatar
          </h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={STYLE.card} className="p-8 space-y-8">

          {/* Avatar Preview */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-blue-500/30 relative"
              style={{
                background: displayAvatar ? 'transparent' : 'linear-gradient(135deg, #2563EB, #3B82F6)',
                boxShadow: '0 10px 30px rgba(37,99,235,0.4)',
              }}
            >
              {displayAvatar ? (
                <img 
                  src={displayAvatar} 
                  alt="avatar" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/400x400?text=Avatar';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-black text-white">
                  {initials}
                </div>
              )}
            </div>
            <p className="text-xs" style={{ color: '#93A8C9' }}>
              {currentAvatar ? 'Avatar actuel' : 'Aucun avatar — initiales affichées'}
            </p>
          </div>

          {/* Dropzone */}
          <div
            style={STYLE.dropzone(dragging)}
            className="p-10 flex flex-col items-center gap-4 text-center"
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="w-10 h-10" style={{ color: dragging ? '#3B82F6' : '#60A5FA' }} />
            <div>
              <p className="font-semibold" style={{ color: '#F0F7FF' }}>Glisser une image ici</p>
              <p className="text-xs mt-1" style={{ color: '#93A8C9' }}>
                JPG, PNG, WEBP • Max {MAX_SIZE_MB} Mo
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            />
          </div>

          {/* Fichier sélectionné */}
          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
              >
                <span className="text-sm truncate" style={{ color: '#60A5FA' }}>{file.name}</span>
                <button onClick={handleReset}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback */}
          <AnimatePresence>
            {status === 'success' && (
              <motion.div className="flex items-center gap-2 text-sm" style={{ color: '#34D399' }}>
                <CheckCircle className="w-4 h-4" /> Avatar mis à jour avec succès
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div className="flex items-center gap-2 text-sm" style={{ color: '#F87171' }}>
                <AlertCircle className="w-4 h-4" /> {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bouton Upload */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: file ? 'linear-gradient(135deg, #2563EB, #3B82F6)' : 'rgba(255,255,255,0.08)',
              color: file ? '#fff' : '#64748B',
            }}
          >
            {uploading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Upload en cours...' : 'Mettre à jour l\'avatar'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}