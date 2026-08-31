'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackIcon?: React.ReactNode;
  fallbackClassName?: string;
}

export function SafeImage({
  src,
  alt,
  className,
  fallbackIcon,
  fallbackClassName,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);

  // If no source is provided or source had a load error
  if (!src || error || typeof src !== 'string' || src.trim() === '') {
    return (
      <div
        className={cn(
          'w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 p-4 select-none',
          fallbackClassName,
          className
        )}
      >
        {fallbackIcon || <ImageIcon className="w-8 h-8 opacity-40 mb-1" />}
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider line-clamp-1 text-center">
          {alt || 'Image Preview'}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}