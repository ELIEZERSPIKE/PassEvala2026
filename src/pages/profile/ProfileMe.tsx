// pages/profile/ProfileMe.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { profileService, UserProfile, UpdateProfilePayload } from '../../services/profilService';
import getImageUrl from '../../utils/imageUtils';

const STYLE = {
  page: { minHeight: '100vh', background: 'linear-gradient(160deg, #0A1628 0%, #1A2A4A 100%)' },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(59,130,246,0.2)',
    borderRadius: '1.25rem',
    backdropFilter: 'blur(12px)',
  },
  input: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(59,130,246,0.25)',
    borderRadius: '0.75rem',
    color: '#F0F7FF',
    outline: 'none',
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
  },
  label: { 
    color: '#93A8C9', 
    fontSize: '0.75rem', 
    fontWeight: 600, 
    textTransform: 'uppercase' as const, 
    letterSpacing: '0.08em' 
  },
};

export default function ProfileMe() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getMe();
      setProfile(data);
      setForm({
        name: data.name || '',
        email: data.email || '',
        password: '',
        password_confirmation: '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setStatus('idle');
    setErrorMsg('');

    try {
      const payload: UpdateProfilePayload = {
        name: form.name,
      };

      // Ajouter email seulement s'il a changé
      if (form.email && form.email !== profile.email) {
        payload.email = form.email;
      }

      // Ajouter le mot de passe seulement s'il est rempli
      if (form.password) {
        if (form.password !== form.password_confirmation) {
          throw new Error("Les mots de passe ne correspondent pas");
        }
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }

      await profileService.updateProfile(payload);
      
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);

      // Recharger les données
      await loadProfile();

    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Erreur lors de la mise à jour');
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={STYLE.page} className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" style={{ color: '#60A5FA' }} />
      </div>
    );
  }

  const avatarUrl = profile?.avatar_url ? getImageUrl(profile.avatar_url) : null;

  return (
    <div style={STYLE.page} className="py-12 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#60A5FA' }}>Compte</p>
          <h1 className="text-3xl font-black" style={{ color: '#F0F7FF' }}>Informations personnelles</h1>
        </motion.div>

        {/* Avatar + Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-5 mb-10">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-blue-500/30 flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-black text-white">
                {profile?.username?.slice(0, 2).toUpperCase() || '??'}
              </div>
            )}
          </div>
          <div>
            <p className="text-xl font-bold" style={{ color: '#F0F7FF' }}>{profile?.name}</p>
            <p className="text-sm" style={{ color: '#60A5FA' }}>@{profile?.username}</p>
            <span className="inline-block mt-1 text-[10px] px-3 py-1 rounded-full font-bold" 
                  style={{ background: 'rgba(59,130,246,0.15)', color: '#60A5FA' }}>
              {profile?.role}
            </span>
          </div>
        </motion.div>

        {/* Formulaire */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <form onSubmit={handleSubmit} style={STYLE.card} className="p-8 space-y-6">

            <div>
              <label style={STYLE.label} className="mb-2 block">Nom complet</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                style={STYLE.input} 
                required 
              />
            </div>

            <div className="pt-4 border-t border-blue-500/10">
              <p className="text-xs mb-4" style={{ color: '#93A8C9' }}>
                Changer le mot de passe (laisser vide si vous ne voulez pas le modifier)
              </p>

              <div className="space-y-5">
                <div>
                  <label style={STYLE.label} className="mb-2 block">Nouveau mot de passe</label>
                  <input 
                    name="password" 
                    type="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    style={STYLE.input} 
                    placeholder="Veuillez saisir votre nouveau de passe" 
                  />
                </div>
                <div>
                  <label style={STYLE.label} className="mb-2 block">Confirmer le nouveau mot de passe</label>
                  <input 
                    name="password_confirmation" 
                    type="password" 
                    value={form.password_confirmation} 
                    onChange={handleChange} 
                    style={STYLE.input} 
                    placeholder="Confirmez votre nouveau mot de passe" 
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            {status === 'success' && (
              <div className="flex items-center gap-2 text-sm" style={{ color: '#34D399' }}>
                <CheckCircle className="w-4 h-4" /> Profil mis à jour avec succès !
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-sm" style={{ color: '#F87171' }}>
                <AlertCircle className="w-4 h-4" /> {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all mt-4"
              style={{ 
                background: 'linear-gradient(135deg, #2563EB, #3B82F6)', 
                color: '#fff',
                opacity: saving ? 0.75 : 1 
              }}
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Enregistrement en cours...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}