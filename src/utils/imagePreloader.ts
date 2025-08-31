interface PreloadOptions {
  priority?: boolean;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

class ImagePreloader {
  private preloadedImages = new Set<string>();
  private preloadPromises = new Map<string, Promise<void>>();

  /**
   * Preload a single image
   */
  preloadImage(src: string, options: PreloadOptions = {}): Promise<void> {
    if (this.preloadedImages.has(src)) {
      return Promise.resolve();
    }

    if (this.preloadPromises.has(src)) {
      return this.preloadPromises.get(src)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.preloadedImages.add(src);
        this.preloadPromises.delete(src);
        resolve();
      };

      img.onerror = () => {
        this.preloadPromises.delete(src);
        reject(new Error(`Failed to preload image: ${src}`));
      };

      if (options.crossOrigin) {
        img.crossOrigin = options.crossOrigin;
      }

      img.src = src;
    });

    this.preloadPromises.set(src, promise);
    return promise;
  }

  /**
   * Preload multiple images
   */
  preloadImages(sources: string[], options: PreloadOptions = {}): Promise<void[]> {
    return Promise.all(sources.map(src => this.preloadImage(src, options)));
  }

  /**
   * Preload critical images that should be loaded immediately
   */
  preloadCriticalImages(): Promise<void[]> {
    const criticalImages = [
      '/images/download.png', // Profile image in About component
      // Add other critical above-the-fold images here
    ];

    return this.preloadImages(criticalImages, { priority: true });
  }

  /**
   * Check if an image has been preloaded
   */
  isPreloaded(src: string): boolean {
    return this.preloadedImages.has(src);
  }

  /**
   * Clear preloaded images cache
   */
  clearCache(): void {
    this.preloadedImages.clear();
    this.preloadPromises.clear();
  }

  /**
   * Get preload statistics
   */
  getStats() {
    return {
      preloadedCount: this.preloadedImages.size,
      pendingCount: this.preloadPromises.size,
      preloadedImages: Array.from(this.preloadedImages)
    };
  }
}

// Create a singleton instance
export const imagePreloader = new ImagePreloader();

// Hook for React components
export const useImagePreloader = () => {
  return {
    preloadImage: imagePreloader.preloadImage.bind(imagePreloader),
    preloadImages: imagePreloader.preloadImages.bind(imagePreloader),
    preloadCriticalImages: imagePreloader.preloadCriticalImages.bind(imagePreloader),
    isPreloaded: imagePreloader.isPreloaded.bind(imagePreloader),
    getStats: imagePreloader.getStats.bind(imagePreloader)
  };
};