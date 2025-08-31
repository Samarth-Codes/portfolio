import React from 'react';
import LazyImage from './LazyImage';

interface ImageSource {
  src: string;
  type?: string;
  media?: string;
}

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sources?: ImageSource[];
  sizes?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  sources = [],
  sizes,
  fallbackSrc,
  onLoad,
  onError
}) => {
  // Use provided sources only, don't auto-generate
  const optimizedSources = sources;

  // If we have multiple sources, use picture element for better format support
  if (optimizedSources.length > 0) {
    return (
      <picture className={className}>
        {optimizedSources.map((source, index) => (
          <source
            key={index}
            srcSet={source.src}
            type={source.type}
            media={source.media}
            sizes={sizes}
          />
        ))}
        <LazyImage
          src={src}
          alt={alt}
          className="w-full h-full"
          priority={priority}
          fallbackSrc={fallbackSrc || '/images/placeholder.svg'}
          onLoad={onLoad}
          onError={onError}
        />
      </picture>
    );
  }

  // Fallback to regular LazyImage
  return (
    <LazyImage
      src={src}
      alt={alt}
      className={className}
      priority={priority}
      fallbackSrc={fallbackSrc || '/images/placeholder.svg'}
      onLoad={onLoad}
      onError={onError}
    />
  );
};

export default OptimizedImage;