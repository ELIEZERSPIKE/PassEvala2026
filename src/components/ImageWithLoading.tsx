// components/ImageWithLoading.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ImageWithLoadingProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageWithLoading({ src, alt, className = '' }: ImageWithLoadingProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gray-200"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
        </motion.div>
      )}
      
      <motion.img
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ 
          scale: isLoading ? 1.1 : 1, 
          opacity: isLoading ? 0 : 1 
        }}
        transition={{ duration: 0.5 }}
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        className={`w-full h-full object-cover ${className}`}
      />
    </div>
  );
}