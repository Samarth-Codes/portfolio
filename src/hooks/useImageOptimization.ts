import { useState, useEffect, useCallback } from 'react';
import { assetManager } from '../utils/assetManager';
import { PLACEHOLDERS } from '../utils/placeholderGenerator';

interface UseImageOptimizationOptions {
  priority?: boolean;
  placeholder?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

interface ImageState {
  src: string;
  isLoading: boolean;
  hasError: boolean;
  isOptimized: boolean;
}

export const useImageOptimization = (
  originalSrc: string,
  options: UseImageOptimizationOptions = {}
) => {
  const {
    priority = false,
    placeholder = PLACEHOLDERS.GENERIC,
    fallbackSrc,
    onLoad,
    onError
  } = options;

  const [imageState, setImageState] = useState<ImageState>({
    src: placeholder,
    isLoading: true,
    hasError: false,
    isOptimized: false
  });

  const loadImage = useCallback(async () => {
    if (!originalSrc) return;

    // Check if already loaded
    if (assetManager.isAssetLoaded(originalSrc)) {
      setImageState({
        src: originalSrc,
        isLoading: false,
        hasError: false,
        isOptimized: true
      });
      onLoad?.();
      return;
    }

    // Check if previously failed
    if (assetManager.isAssetFailed(originalSrc)) {
      if (fallbackSrc) {
        setImageState({
          src: fallbackSrc,
          isLoading: false,
          hasError: false,
          isOptimized: false
        });
      } else {
        setImageState(prev => ({
          ...prev,
          hasError: true,
          isLoading: false
        }));
        onError?.();
      }
      return;
    }

    try {
      // Get optimized URL
      const optimizedSrc = assetManager.getOptimizedImageUrl(originalSrc, {
        format: 'webp',
        quality: 85
      });

      // Try to load optimized version first
      const img = new Image();
      
      img.onload = () => {
        setImageState({
          src: optimizedSrc,
          isLoading: false,
          hasError: false,
          isOptimized: true
        });
        onLoad?.();
      };

      img.onerror = () => {
        // Fallback to original if optimized fails
        const fallbackImg = new Image();
        
        fallbackImg.onload = () => {
          setImageState({
            src: originalSrc,
            isLoading: false,
            hasError: false,
            isOptimized: false
          });
          onLoad?.();
        };

        fallbackImg.onerror = () => {
          assetManager.markAssetFailed(originalSrc);
          
          if (fallbackSrc) {
            setImageState({
              src: fallbackSrc,
              isLoading: false,
              hasError: false,
              isOptimized: false
            });
          } else {
            setImageState(prev => ({
              ...prev,
              hasError: true,
              isLoading: false
            }));
            onError?.();
          }
        };

        fallbackImg.src = originalSrc;
      };

      img.src = optimizedSrc;
    } catch (error) {
      console.error('Image optimization error:', error);
      setImageState(prev => ({
        ...prev,
        hasError: true,
        isLoading: false
      }));
      onError?.();
    }
  }, [originalSrc, fallbackSrc, onLoad, onError]);

  useEffect(() => {
    if (priority) {
      loadImage();
    }
  }, [loadImage, priority]);

  const triggerLoad = useCallback(() => {
    if (!priority && imageState.isLoading && imageState.src === placeholder) {
      loadImage();
    }
  }, [loadImage, priority, imageState.isLoading, imageState.src, placeholder]);

  return {
    ...imageState,
    triggerLoad,
    retry: loadImage
  };
};