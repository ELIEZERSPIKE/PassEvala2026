// components/Animations/LoadingSpinner.tsx
import { motion } from 'framer-motion';
import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <motion.div
        className="w-8 h-8 border-4 rounded-full"
        style={{ 
          borderColor: '#D4822A',
          borderTopColor: 'transparent',
        }}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: 'linear' 
        }}
      />
    </div>
  );
}