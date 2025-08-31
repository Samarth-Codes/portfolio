import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { assetManager } from '../utils/assetManager';

const PAGE_ASSET_MAP: Record<string, string> = {
  '/': 'home',
  '/about': 'about',
  '/projects': 'projects',
  '/skills': 'skills',
  '/contact': 'contact'
};

export const usePageAssets = () => {
  const location = useLocation();

  useEffect(() => {
    const pageName = PAGE_ASSET_MAP[location.pathname];
    if (pageName) {
      // Preload assets for current page
      assetManager.preloadPageAssets(pageName).catch(console.error);
    }
  }, [location.pathname]);

  return {
    preloadPageAssets: assetManager.preloadPageAssets.bind(assetManager),
    getAssetStats: assetManager.getStats.bind(assetManager)
  };
};