import { isProduction } from '../config/environment';

export interface ErrorReport {
  message: string;
  stack?: string | undefined;
  url?: string | undefined;
  lineNumber?: number | undefined;
  columnNumber?: number | undefined;
  timestamp: string;
  userAgent: string;
  environment: string;
}

/**
 * Global error handler for unhandled errors and promise rejections
 */
class GlobalErrorHandler {
  private initialized = false;

  /**
   * Initialize global error handling
   */
  initialize() {
    if (this.initialized) return;

    // Handle unhandled JavaScript errors
    window.addEventListener('error', this.handleError);

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handlePromiseRejection);

    this.initialized = true;
    console.log('Global error handler initialized');
  }

  /**
   * Clean up event listeners
   */
  cleanup() {
    window.removeEventListener('error', this.handleError);
    window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
    this.initialized = false;
  }

  /**
   * Handle JavaScript errors
   */
  private handleError = (event: ErrorEvent) => {
    const errorReport: ErrorReport = {
      message: event.message,
      stack: event.error?.stack,
      url: event.filename,
      lineNumber: event.lineno,
      columnNumber: event.colno,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      environment: isProduction() ? 'production' : 'development'
    };

    this.logError('JavaScript Error', errorReport);
  };

  /**
   * Handle unhandled promise rejections
   */
  private handlePromiseRejection = (event: PromiseRejectionEvent) => {
    const errorReport: ErrorReport = {
      message: event.reason?.message || 'Unhandled Promise Rejection',
      stack: event.reason?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      environment: isProduction() ? 'production' : 'development'
    };

    this.logError('Promise Rejection', errorReport);

    // Prevent the default browser behavior (logging to console)
    event.preventDefault();
  };

  /**
   * Log error to console and external services
   */
  private logError(type: string, errorReport: ErrorReport) {
    // Always log to console
    console.error(`[${type}]`, errorReport);

    // In production, send to monitoring service
    if (isProduction()) {
      this.sendToMonitoringService(type, errorReport);
    }
  }

  /**
   * Send error to external monitoring service
   */
  private sendToMonitoringService(type: string, errorReport: ErrorReport) {
    try {
      // This is where you would integrate with services like:
      // - Sentry
      // - LogRocket
      // - Bugsnag
      // - Custom logging endpoint

      // Example implementation for a custom endpoint:
      /*
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          ...errorReport
        })
      }).catch(err => {
        console.error('Failed to send error to monitoring service:', err);
      });
      */

      // For now, just log that we would send it
      console.log('Would send to monitoring service:', { type, ...errorReport });
    } catch (error) {
      console.error('Error in monitoring service integration:', error);
    }
  }

  /**
   * Manually report an error
   */
  reportError(error: Error, context?: string) {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      environment: isProduction() ? 'production' : 'development'
    };

    this.logError(context || 'Manual Report', errorReport);
  }
}

// Create singleton instance
export const globalErrorHandler = new GlobalErrorHandler();

/**
 * Utility function to safely execute async operations with error handling
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback?: T,
  context?: string
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    globalErrorHandler.reportError(error as Error, context);
    return fallback;
  }
}

/**
 * Utility function to safely execute synchronous operations with error handling
 */
export function safeSync<T>(
  operation: () => T,
  fallback?: T,
  context?: string
): T | undefined {
  try {
    return operation();
  } catch (error) {
    globalErrorHandler.reportError(error as Error, context);
    return fallback;
  }
}

/**
 * Create a wrapper for API calls with automatic error handling
 */
export function createApiWrapper(baseUrl?: string) {
  return async function apiCall<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T | null> {
    try {
      const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        }
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      globalErrorHandler.reportError(error as Error, `API Call: ${endpoint}`);
      return null;
    }
  };
}