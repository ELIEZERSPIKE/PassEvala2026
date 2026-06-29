// components/CommentSection/CommentForm.tsx
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Send, User, Loader2 } from 'lucide-react';

interface CommentFormProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export default function CommentForm({ value, onChange, onSubmit, isSubmitting }: CommentFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mb-6">
      <div className="flex flex-col gap-2">
        <div className="relative">
          <div className="absolute left-3 top-3">
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écrire un commentaire..."
            className="w-full pl-10 pr-16 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none min-h-[60px] max-h-[150px] bg-gray-50 hover:bg-white focus:bg-white"
            rows={2}
            disabled={isSubmitting}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {value.length}/1000
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          {value.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => onChange('')}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-3 py-1"
            >
              Effacer
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting || !value.trim()}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Commenter
              </>
            )}
          </motion.button>
        </div>
      </div>
    </form>
  );
}