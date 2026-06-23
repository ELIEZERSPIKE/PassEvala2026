// components/Animations/Swipeable.tsx
import { motion, useDragControls } from 'framer-motion';
import { useState } from 'react';

interface SwipeableProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export default function Swipeable({ children, onSwipeLeft, onSwipeRight }: SwipeableProps) {
  const [x, setX] = useState(0);
  const controls = useDragControls();

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 50;
    if (info.offset.x > threshold && onSwipeRight) {
      onSwipeRight();
      setX(0);
    } else if (info.offset.x < -threshold && onSwipeLeft) {
      onSwipeLeft();
      setX(0);
    } else {
      setX(0);
    }
  };

  return (
    <motion.div
      drag="x"
      dragControls={controls}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}