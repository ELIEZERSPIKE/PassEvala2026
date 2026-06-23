// components/Animations/RevealOnScroll.tsx
import { motion, useInView, Variants } from 'framer-motion';
import React, { useRef } from 'react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const directionMap = {
  up: { y: 50, x: 0 },
  down: { y: -50, x: 0 },
  left: { x: 50, y: 0 },
  right: { x: -50, y: 0 },
};

const variants = (direction: string, delay: number, duration: number): Variants => ({
  hidden: {
    opacity: 0,
    ...directionMap[direction as keyof typeof directionMap],
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: duration,
      delay: delay,
      ease: 'easeOut',
    },
  },
});

export default function RevealOnScroll({ 
  children, 
  direction = 'up', 
  delay = 0,
  duration = 0.6,
  className = '',
  once = true,
}: RevealOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: once, 
    margin: '-50px',
  });

  return (
    <motion.div
      ref={ref}
      variants={variants(direction, delay, duration)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}