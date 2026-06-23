// components/Animations/HoverCard.tsx
import { motion } from 'framer-motion';
import React from 'react';

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function HoverCard({ children, className = '', onClick }: HoverCardProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
        transition: { type: 'spring', stiffness: 400, damping: 10 }
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}