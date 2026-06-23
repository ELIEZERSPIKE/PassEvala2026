// components/Animations/AdvancedLoader.tsx
import { motion } from 'framer-motion';

export default function AdvancedLoader() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center gap-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-[#8B2500] border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-sm font-bold text-gray-700">Chargement en cours...</p>
        <motion.div
          className="w-full h-1 bg-gray-200 rounded-full overflow-hidden"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          <div className="h-full bg-[#8B2500]" />
        </motion.div>
      </motion.div>
    </div>
  );
}