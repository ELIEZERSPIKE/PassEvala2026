// components/Animations/AnimatedCounter.tsx
import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export default function AnimatedCounter({ 
  target, 
  duration = 2000, 
  prefix = '', 
  suffix = '' 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, target, duration]);

  return (
    <motion.span
      ref={ref}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="font-bold text-3xl"
    >
      {prefix}{count}{suffix}
    </motion.span>
  );
}