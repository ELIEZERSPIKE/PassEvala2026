// components/CommentSection/CommentList.tsx
import { AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { Comment } from '../../types';
import CommentItem from '../CommentItem';

interface CommentListProps {
  comments: Comment[];
  onEdit: (commentId: number, content: string) => void | Promise<void>;
  onDelete: (commentId: number) => void | Promise<void>;
}

export default function CommentList({ comments, onEdit, onDelete }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-400 font-medium">Aucun commentaire pour le moment</p>
        <p className="text-sm text-gray-300">Soyez le premier à partager votre avis !</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </AnimatePresence>
  );
}