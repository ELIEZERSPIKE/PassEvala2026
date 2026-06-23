// components/Animations/ArticleSkeleton.tsx
import { motion } from 'framer-motion';

export default function ArticleSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white border border-[#E5E5E5] rounded-sm overflow-hidden shadow-sm"
    >
      <div className="relative h-64 md:h-80 w-full bg-gray-200 animate-pulse" />
      <div className="p-6 flex flex-col gap-3">
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
      </div>
    </motion.div>
  );
}