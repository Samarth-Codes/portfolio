import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { assetManager } from './utils/assetManager';
import { globalErrorHandler } from './utils/errorHandler';
import { getEnvironmentConfig, isProduction } from './config/environment';
import ErrorBoundary from './components/ErrorBoundary';
import AppContent from './components/AppContent';

function App() {
  // Initialize application on start
  useEffect(() => {
    // Initialize global error handling
    globalErrorHandler.initialize();

    // Initialize asset management
    assetManager.initialize().catch(error => {
      globalErrorHandler.reportError(error, 'Asset Manager Initialization');
    });

    // Log environment info in development
    if (!isProduction()) {
      console.log('Environment Config:', getEnvironmentConfig());
    }

    // Cleanup on unmount
    return () => {
      globalErrorHandler.cleanup();
    };
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
