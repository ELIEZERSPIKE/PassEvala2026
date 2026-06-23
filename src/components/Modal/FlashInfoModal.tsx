// components/Modal/FlashInfoModal.tsx
import React from 'react';
import { X, Calendar, Zap, Link } from 'lucide-react';
import { motion } from 'framer-motion';
import { FlashInfo } from '../../types';

interface FlashInfoModalProps {
  flashInfo: FlashInfo;
  onClose: () => void;
}

export default function FlashInfoModal({ flashInfo, onClose }: FlashInfoModalProps) {
  // Formater la date
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#222222] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500 fill-current" />
            <h2 className="text-sm font-display font-black uppercase tracking-widest">
              Flash Info
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>{formatDate(flashInfo.created_at)}</span>
          </div>

          <h3 className="font-display font-black text-lg text-gray-900 leading-snug">
            {flashInfo.title}
          </h3>

          {flashInfo.link ? (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100 flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Link className="w-3.5 h-3.5 text-blue-600" /> Lien externe / Détails
              </span>
              <a
                href={flashInfo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all font-medium"
              >
                {flashInfo.link}
              </a>
            </div>
          ) : (
            <p className="text-sm text-gray-600 italic">
              Aucun lien supplémentaire fourni.
            </p>
          )}

          <button
            onClick={onClose}
            className="mt-4 w-full bg-[#222222] hover:bg-black text-white text-xs font-display font-black uppercase py-3 rounded-sm transition-colors tracking-widest"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
