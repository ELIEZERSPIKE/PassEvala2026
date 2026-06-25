// features/shorts/components/ShortItem.tsx
import React, { useRef, useState } from 'react';
import { Short } from '../types/short';
import ShortGuard from './ShortGuard';
import ShortReactions from './ShortReaction';
import ShortComments from './ShortComments';
import { ShortPlayerHandle } from './ShortPlayer';

interface Props {
  short: Short;
  index: number;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
}

const SLIDE_HEIGHT = 400;

const ShortItem: React.FC<Props> = ({ short, index, isActive, onNext, onPrev }) => {
  const playerRef = useRef<ShortPlayerHandle>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState(short.comments_count ?? 0);

  return (
    <div
      data-short={index}
      style={{ height: SLIDE_HEIGHT, scrollSnapAlign: 'start', position: 'relative' }}
    >
      <ShortGuard ref={playerRef} short={short} isActive={isActive} />

      {short.processed_path && !commentsOpen && (
        <ShortReactions
          short={{ ...short, comments_count: commentsCount }}
          isActive={isActive}
          onNext={onNext}
          onPrev={onPrev}
          onTogglePlay={() => playerRef.current?.togglePlay()}
          onOpenComments={() => setCommentsOpen(true)}
        />
      )}

      {commentsOpen && (
        <ShortComments
          shortId={short.id}
          onClose={() => setCommentsOpen(false)}
          onCommentAdded={() => setCommentsCount(prev => prev + 1)}
        />
      )}
    </div>
  );
};

export default ShortItem;