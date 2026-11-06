'use client';

import { useEffect, useRef } from 'react';
import { incrementArticleViewCount } from '@/lib/actions/articles';

interface ArticleViewTrackerProps {
  slug: string;
}

export function ArticleViewTracker({ slug }: ArticleViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      void incrementArticleViewCount(slug);
    }
  }, [slug]);

  return null;
}
