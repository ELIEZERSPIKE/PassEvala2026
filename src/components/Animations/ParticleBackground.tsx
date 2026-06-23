// components/Animations/ParticleBackground.tsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

export default function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#8B2500]"
          style={{
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
          initial={{ x: particle.x, y: particle.y }}
          animate={{
            y: [particle.y, -20],
            opacity: [particle.opacity, 0],
          }}
          transition={{
            duration: 10 / particle.speed,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}