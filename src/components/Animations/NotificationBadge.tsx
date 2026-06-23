// components/Animations/NotificationBadge.tsx
import { motion } from 'framer-motion';

interface NotificationBadgeProps {
  count: number;
  className?: string; // Ajout de la prop className
  maxCount?: number;
}

export default function NotificationBadge({ 
  count, 
  className = '', 
  maxCount = 99 
}: NotificationBadgeProps) {
  if (count === 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count;

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full ${className}`}
    >
      {displayCount}
    </motion.span>
  );
}