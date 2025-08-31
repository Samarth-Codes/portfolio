import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  placeholder?: string;
  priority?: boolean;
  onLoad?: (() => void) | undefined;
  onError?: (() => void) | undefined;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/images/placeholder.svg',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  priority = false,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const [currentSrc, setCurrentSrc] = useState(placeholder);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
      setHasError(false);
      onLoad?.();
    };

    img.onerror = () => {
      if (fallbackSrc && fallbackSrc !== src) {
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          setCurrentSrc(fallbackSrc);
          setIsLoaded(true);
          setHasError(false);
        };
        fallbackImg.onerror = () => {
          setHasError(true);
          onError?.();
        };
        fallbackImg.src = fallbackSrc;
      } else {
        setHasError(true);
        onError?.();
      }
    };

    img.src = src;
  }, [isInView, src, fallbackSrc, onLoad, onError]);

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-800 text-gray-400 ${className}`}
        ref={imgRef}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">📷</div>
          <div className="text-sm">Image not available</div>
        </div>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-70'
      } ${className}`}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
};

export default LazyImage;