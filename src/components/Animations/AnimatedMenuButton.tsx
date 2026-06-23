// components/Animations/AnimatedMenuButton.tsx
import { motion } from 'framer-motion';

interface AnimatedMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function AnimatedMenuButton({ isOpen, onClick }: AnimatedMenuButtonProps) {
  return (
    <button onClick={onClick} className="w-10 h-10 flex flex-col justify-center items-center gap-1.5">
      <motion.div
        className="w-6 h-0.5 bg-white rounded-full"
        animate={{
          rotate: isOpen ? 45 : 0,
          y: isOpen ? 6 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="w-6 h-0.5 bg-white rounded-full"
        animate={{
          opacity: isOpen ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="w-6 h-0.5 bg-white rounded-full"
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? -6 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </button>
  );
}