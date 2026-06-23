// components/Animations/InfiniteScroll.tsx
import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
}

export default function InfiniteScroll({ children, onLoadMore, hasMore }: InfiniteScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const controls = useAnimation();

  useEffect(() => {
    if (isInView && hasMore) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
      });
      onLoadMore();
    }
  }, [isInView, hasMore, controls, onLoadMore]);

  return (
    <>
      {children}
      {hasMore && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          className="flex justify-center py-4"
        >
          <motion.div
            className="w-8 h-8 border-4 border-[#8B2500] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
    </>
  );
}