// components/Animations/ButtonWithFeedback.tsx
import { motion } from 'framer-motion';
import React from 'react';

interface ButtonWithFeedbackProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function ButtonWithFeedback({ 
  children, 
  onClick, 
  className = '' 
}: ButtonWithFeedbackProps) {
  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: [1, 1.02, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse'
        }
      }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}