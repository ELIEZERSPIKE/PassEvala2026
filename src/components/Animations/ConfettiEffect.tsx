// components/Animations/ConfettiEffect.tsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ConfettiEffect({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; color: string }>>([]);

  useEffect(() => {
    if (active) {
      const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6BD6'];
      const newParticles = Array.from({ length: 50 }, () => ({
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);
      
      setTimeout(() => setParticles([]), 2000);
    }
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{ 
            x: p.x * 10,
            y: p.y * 10,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 1.5, delay: i * 0.02 }}
          className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}