import { useState, useEffect } from 'react';

export function useHighlight(duration = 2500) {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    if (!highlightedId) return;
    const timer = setTimeout(() => setHighlightedId(null), duration);
    return () => clearTimeout(timer);
  }, [highlightedId, duration]);

  return { highlightedId, setHighlightedId };
}