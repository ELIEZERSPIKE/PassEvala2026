// components/Animations/PageTransition.tsx
import { motion, Variants, Transition } from 'framer-motion';
import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale';
  delay?: number;
  duration?: number;
  className?: string;
}

const animations: Record<string, Variants> = {
  'fade': {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  },
  'slide-up': {
    initial: { opacity: 0, y: 30 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -30 },
  },
  'slide-down': {
    initial: { opacity: 0, y: -30 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: 30 },
  },
  'scale': {
    initial: { opacity: 0, scale: 0.9 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 0.9 },
  },
};

export default function PageTransition({ 
  children, 
  animation = 'slide-up',
  delay = 0,
  duration = 0.5,
  className = ''
}: PageTransitionProps) {
  const transition: Transition = {
    type: 'tween',
    ease: 'easeOut',
    duration: duration,
    delay: delay,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={animations[animation]}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}