import { imagePreloader } from './imagePreloader';

// Asset configuration interface for future use
// interface AssetConfig {
//   critical: string[];
//   lazy: string[];
//   preconnect: string[];
// }

class AssetManager {
  private loadedAssets = new Set<string>();
  private failedAssets = new Set<string>();

  /**
   * Initialize asset management
   */
  async initialize(): Promise<void> {
    // Preconnect to external domains
    this.preconnectDomains();
    
    // Preload critical assets
    await this.preloadCriticalAssets();
  }

  /**
   * Preconnect to external domains for faster loading
   */
  private preconnectDomains(): void {
    const domains = [
      'https://www.transparenttextures.com',
      // Add other external domains used in the portfolio
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });
  }

  /**
   * Preload critical above-the-fold assets
   */
  private async preloadCriticalAssets(): Promise<void> {
    const criticalAssets = [
      '/images/download.png', // Profile image
      // Add other critical images that appear above the fold
    ];

    try {
      await imagePreloader.preloadImages(criticalAssets);
      criticalAssets.forEach(asset => this.loadedAssets.add(asset));
    } catch (error) {
      console.warn('Some critical assets failed to preload:', error);
    }
  }

  /**
   * Preload assets for a specific page/component
   */
  async preloadPageAssets(page: string): Promise<void> {
    const pageAssets: Record<string, string[]> = {
      about: ['/images/download.png'],
      achievements: [
        '/images/achievement1.jpg',
        '/images/achievement2.jpg',
        '/images/achievement3.jpg',
        '/images/achievement4.jpg',
        '/images/achievement5.jpg',
        '/images/achievement6.jpg',
        '/images/achievement7.jpg'
      ],
      // Add other page-specific assets
    };

    const assets = pageAssets[page] || [];
    if (assets.length === 0) return;

    try {
      await imagePreloader.preloadImages(assets);
      assets.forEach(asset => this.loadedAssets.add(asset));
    } catch (error) {
      console.warn(`Failed to preload assets for ${page}:`, error);
    }
  }

  /**
   * Check if an asset is loaded
   */
  isAssetLoaded(src: string): boolean {
    return this.loadedAssets.has(src);
  }

  /**
   * Check if an asset failed to load
   */
  isAssetFailed(src: string): boolean {
    return this.failedAssets.has(src);
  }

  /**
   * Mark an asset as failed
   */
  markAssetFailed(src: string): void {
    this.failedAssets.add(src);
  }

  /**
   * Get optimized image URL based on device capabilities
   */
  getOptimizedImageUrl(src: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpg' | 'png';
  } = {}): string {
    // For now, return the original src
    // In a real implementation, this could integrate with image CDN services
    // like Cloudinary, ImageKit, or custom image optimization service
    
    const { format } = options;
    
    // Check if browser supports WebP
    const supportsWebP = this.checkWebPSupport();
    const supportsAVIF = this.checkAVIFSupport();
    
    // Generate optimized URL (this is a placeholder implementation)
    let optimizedSrc = src;
    
    // If we have format preference and browser support, try to use it
    if (format === 'webp' && supportsWebP) {
      optimizedSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    } else if (format === 'avif' && supportsAVIF) {
      optimizedSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.avif');
    }
    
    return optimizedSrc;
  }

  /**
   * Check WebP support
   */
  private checkWebPSupport(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  /**
   * Check AVIF support
   */
  private checkAVIFSupport(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    try {
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    } catch {
      return false;
    }
  }

  /**
   * Get asset loading statistics
   */
  getStats() {
    return {
      loaded: this.loadedAssets.size,
      failed: this.failedAssets.size,
      loadedAssets: Array.from(this.loadedAssets),
      failedAssets: Array.from(this.failedAssets),
      preloaderStats: imagePreloader.getStats()
    };
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.loadedAssets.clear();
    this.failedAssets.clear();
    imagePreloader.clearCache();
  }
}

// Create singleton instance
export const assetManager = new AssetManager();

// React hook for asset management
export const useAssetManager = () => {
  return {
    preloadPageAssets: assetManager.preloadPageAssets.bind(assetManager),
    isAssetLoaded: assetManager.isAssetLoaded.bind(assetManager),
    isAssetFailed: assetManager.isAssetFailed.bind(assetManager),
    getOptimizedImageUrl: assetManager.getOptimizedImageUrl.bind(assetManager),
    getStats: assetManager.getStats.bind(assetManager)
  };
};